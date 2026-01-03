"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { Raffle } from "@/type/Raffle";
import { Ticket } from "@/type/Ticket";
import { PaymentTicket, TicketStatusEnum } from "@/type/Payment";

interface UsePaymentProps {
  onPaymentSuccess?: () => Promise<void>;
}

export function usePayment({ onPaymentSuccess }: UsePaymentProps = {}) {
  const {
    userPayments,
    getPaymentsUser,
    widgetPayment,
    getWompiSignature,
    loading,
  } = usePaymentStore();

  const { user } = AuthStore();

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    raffleName?: string;
    tickets?: string[];
  } | null>(null);

  useEffect(() => {
    if (user) getPaymentsUser();
  }, [user, getPaymentsUser]);


  const loadWompiScript = () =>
    new Promise<void>((resolve) => {
      if (window.WidgetCheckout) return resolve();
      const script = document.createElement("script");
      script.src = "https://checkout.wompi.co/widget.js";
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });


  const payWithWompiWidget = async ({
    tickets,
    raffle,
    reservation_id,
  }: {
    tickets: Ticket[];
    raffle: Raffle;
    reservation_id?: number;
  }) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      const reference = `RAFFLE_${raffle.id}_${Date.now()}`;
      const amountInCents = raffle.price * tickets.length * 100;

      const ticketsForPayment: PaymentTicket[] = tickets.map((t) => ({
        id_ticket: t.id_ticket,
        ticket_number: t.ticket_number,
        status: t.status as TicketStatusEnum,
      }));

      await widgetPayment({
        method: "wompi",
        raffle_id: raffle.id,
        ticket_ids: ticketsForPayment.map((t) => t.id_ticket),
        reservation_id,
        reference,
        total_amount: raffle.price * tickets.length,
      });

      const { signature } = await getWompiSignature({
        reference,
        amount_in_cents: amountInCents,
        currency: "COP",
      })

      await loadWompiScript();

      const checkout = new window.WidgetCheckout({
        currency: "COP",
        amountInCents,
        reference,
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        signature: { integrity: signature },
      });

      checkout.open((result) => {
        const tx = result?.transaction;
        if (!tx) return;

        if (tx.status === "APPROVED") {
          toast.success("Pago aprobado ✅");

          setPaymentInfo({
            raffleName: raffle.title,
            tickets: ticketsForPayment.map((t) => t.ticket_number),
          });

          setSuccessModalOpen(true);

          getPaymentsUser();
          onPaymentSuccess?.();
        }

        if (tx.status === "DECLINED") toast.error("Pago rechazado ❌");
        if (tx.status === "ERROR") toast.error("Error en el pago ⚠️");
      });
    } catch (e) {
      console.error(e);
      toast.error("Error iniciando pago");
    }
  };

  return {
    loading,
    userPayments,
    payWithWompiWidget,
    successModalOpen,
    setSuccessModalOpen,
    paymentInfo,
  };
}
