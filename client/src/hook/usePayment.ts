"use client";

import { flushSync } from "react-dom";
import { toast } from "sonner";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { Payment } from "@/type/Payment";
import { useState, useEffect } from "react";
import { Ticket } from "@/type/Ticket";
import { Raffle } from "@/type/Raffle";

interface UsePaymentProps {
  onPaymentSuccess?: () => Promise<void>;
}

export function usePayment({ onPaymentSuccess }: UsePaymentProps = {}) {
  const { userPayments, getPaymentsUser, widgetPayment, getWompiSignature, createPayment } =
    usePaymentStore();
  const { token, user } = AuthStore();

  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    raffleName?: string;
    ticketNumber?: string;
  } | null>(null);

  useEffect(() => {
    if (!token || !user?.id) return;
    getPaymentsUser(token).catch(() => console.error("Error cargando pagos"));
  }, [token, user?.id, getPaymentsUser]);

  const payWithWompiWidget = async ({
    tickets,
    raffle,
  }: {
    tickets: Ticket[];
    raffle: Raffle;
  }) => {

    if (!token) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      setLoading(true);

      const ticketIds = tickets.map(t => t.id_ticket);

      const reference = `RAFFLE_${raffle.id}_TICKETS_${ticketIds.join("-")}_${Date.now()}`;

      await createPayment(
        {
          raffle_id: raffle.id,
          ticket_ids: ticketIds,
          reference,
          total_amount: raffle.price * tickets.length,
        },
        token
      );



      // Simulamos un pago aprobado directamente
      flushSync(() => {
        setPaymentInfo({
          raffleName: raffle.title,
          ticketNumber: tickets.map(t => t.ticket_number).join(", "),
        });

        setSuccessModalOpen(true);
      });

      toast.success("Pago aprobado (simulado)");

      // Refrescamos la rifa si hay callback
      if (onPaymentSuccess) await onPaymentSuccess();

    } catch (error) {
      console.error(error);
      toast.error("Error creando pago de prueba");
    } finally {
      setLoading(false);
    }
  };

  return {
    userPayments,
    loading,
    payWithWompiWidget,
    successModalOpen,
    setSuccessModalOpen,
    paymentInfo,
    createPayment
  };
}


/*
"use client";

import { flushSync } from "react-dom";
import { toast } from "sonner";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { Payment } from "@/type/Payment";
import { useState, useEffect } from "react";

interface UsePaymentProps {
  onPaymentSuccess?: () => Promise<void>;
}

export function usePayment({ onPaymentSuccess }: UsePaymentProps = {}) {
  const { userPayments, getPaymentsUser, widgetPayment, getWompiSignature, createPayment } =
    usePaymentStore();
  const { token, user } = AuthStore();

  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    raffleName?: string;
    ticketNumber?: string;
  } | null>(null);

  useEffect(() => {
    if (!token || !user?.id) return;
    getPaymentsUser(token).catch(() => console.error("Error cargando pagos"));
  }, [token, user?.id, getPaymentsUser]);

  const payWithWompiWidget = async ({
    ticket,
    raffle,
  }: {
    ticket: any;
    raffle: any;
  }) => {
    if (!token) {
      toast.error("Debes iniciar sesión");
      return;
    }

    if (typeof window === "undefined" || !(window as any).WidgetCheckout) {
      toast.error("Wompi no está listo");
      return;
    }

    try {
      setLoading(true);

      const reference = `RAFFLE_${raffle.id}_TICKET_${ticket.id_ticket}_${Date.now()}`;
      const amountInCents = Math.round(Number(raffle.price) * 100);
      await widgetPayment(
        {
          raffle_id: raffle.id,
          ticket_id: ticket.id_ticket,
          method: "pay",
          reference,
        },
        token
      );

      const { signature } = await getWompiSignature(
        { reference, amount_in_cents: amountInCents, currency: "COP" },
        token
      );

      const checkout = new (window as any).WidgetCheckout({
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        currency: "COP",
        amountInCents,
        reference,
        signature: { integrity: signature },
      });

      checkout.open(() => {
        flushSync(() => {
          setPaymentInfo({
            raffleName: raffle.title,
            ticketNumber: ticket.ticket_number,
          });
        });
        const interval = setInterval(async () => {
          const updatedPayments = await getPaymentsUser(token);
          const payment = updatedPayments.find(
            (p: Payment) => p.reference === reference
          );

          if (payment?.status === "completed") {
            clearInterval(interval);
            flushSync(() => setSuccessModalOpen(true));
            setLoading(false);
            toast.success("Pago aprobado");

            if (onPaymentSuccess) {
              await onPaymentSuccess();
            }
          }
        }, 3000);
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Error iniciando pago con Wompi");
    }
  };

  return {
    userPayments,
    loading,
    payWithWompiWidget,
    successModalOpen,
    setSuccessModalOpen,
    paymentInfo,
    createPayment
  };
}



*/