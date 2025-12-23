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
  const {
    userPayments,
    getPaymentsUser,
    widgetPayment,
    getWompiSignature,
  } = usePaymentStore();

  const { token, user } = AuthStore();

  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    raffleName?: string;
    ticketNumber?: string;
  } | null>(null);

  useEffect(() => {
    if (!token || !user?.id) return;
    getPaymentsUser(token).catch(() =>
      console.error("Error cargando pagos")
    );
  }, [token, user?.id, getPaymentsUser]);

  const payWithWompiWidget = async ({
    ticket,
    raffle,
    method,
  }: {
    ticket: any;
    raffle: any;
    method: "card" | "pse";
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
          method,
          reference,
        },
        token
      );

      const { signature } = await getWompiSignature(
        {
          reference,
          amount_in_cents: amountInCents,
          currency: "COP",
        },
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

            // 🔥 REFRESCAR RIFA / TICKETS
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
  };
}





/*
"use client";

import { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { PaymentCreateDto } from "@/type/Payment";
import { toast } from "sonner";
import { flushSync } from "react-dom";

export function usePayment() {
  const {
    payments,
    createPayment,
    cancelPayment,
    getPayments,
    completePayment,
    widgetPayment,
    getWompiSignature,
  } = usePaymentStore();

  const { token, user } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    raffleName?: string;
    ticketNumber?: string;
  } | null>(null);

  useEffect(() => {
    if (!token || !user?.id) return;
    getPayments(token).catch(() => setError("Error al cargar los pagos"));
  }, [token, user?.id]);

  const makePayment = async (data: PaymentCreateDto): Promise<void> => {
    if (!token) {
      toast.error("Debes iniciar sesión");
      return;
    }
    await createPayment(data, token);
  };

  const payWithWompiWidget = async ({
    ticket,
    raffle,
    method,
  }: {
    ticket: any;
    raffle: any;
    method: "card" | "pse";
  }) => {
    if (!token) return toast.error("Debes iniciar sesión");

    if (typeof window === "undefined" || !(window as any).WidgetCheckout) {
      toast.error("Wompi no está listo");
      return;
    }

    try {
      setLoading(true);

      const reference = `RAFFLE_${raffle.id}_TICKET_${ticket.id_ticket}_${Date.now()}`;
      const amountInCents = Math.round(Number(raffle.price) * 100);

      // Crear el pago en backend
      await widgetPayment({ raffle_id: raffle.id, ticket_id: ticket.id_ticket, method, reference }, token);

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


      checkout.open((result: any) => {
        const tx = result?.transaction;

        if (!tx) {
          console.warn("Sandbox: transaction es null, usando fallback");
          flushSync(() => {
            setPaymentInfo({ raffleName: raffle.name, ticketNumber: ticket.ticket_number });
            setSuccessModalOpen(true);
          });
          toast.success("Pago aprobado (sandbox)");
          return;
        }

        if (tx.status === "APPROVED") {
          flushSync(() => {
            setPaymentInfo({ raffleName: raffle.name, ticketNumber: ticket.ticket_number });
            setSuccessModalOpen(true);
          });
          toast.success("Pago aprobado");
        } else if (tx.status === "DECLINED") {
          toast.error("Pago rechazado");
        } else if (tx.status === "ERROR") {
          toast.error("Ocurrió un error en el pago");
        }
      });

    } catch (err) {
      console.error(err);
      toast.error("Error iniciando pago con Wompi");
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    makePayment,
    payWithWompiWidget,
    cancelPayment,
    completePayment,
    successModalOpen,
    setSuccessModalOpen,
    paymentInfo,
  };

}


*/