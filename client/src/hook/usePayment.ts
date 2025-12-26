"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { Raffle } from "@/type/Raffle";
import { PaymentTicket } from "@/type/Payment";

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

  const { token } = AuthStore();

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    raffleName?: string;
    tickets?: string[];
  } | null>(null);

  /** 🔹 Cargar pagos del usuario */
  useEffect(() => {
    if (token) getPaymentsUser(token);
  }, [token, getPaymentsUser]);

  /** 🔹 Script Wompi */
  const loadWompiScript = () =>
    new Promise<void>((resolve) => {
      if ((window as any).WidgetCheckout) return resolve();
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
    tickets: PaymentTicket[];
    raffle: Raffle;
    reservation_id?: number;
  }) => {
    if (!token) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      const reference = `RAFFLE_${raffle.id}_${Date.now()}`;
      const amountInCents = raffle.price * tickets.length * 100;

      /** 1️⃣ Crear pago */
      await widgetPayment(
        {
          method: "wompi",
          raffle_id: raffle.id,
          ticket_ids: tickets.map((t) => t.id_ticket),
          reservation_id,
          reference,
          total_amount: raffle.price * tickets.length,
        },
        token
      );

      /** 2️⃣ Obtener firma */
      const { signature } = await getWompiSignature(
        {
          reference,
          amount_in_cents: amountInCents,
          currency: "COP",
        },
        token
      );

      await loadWompiScript();

      /** 3️⃣ Abrir Widget */
      const checkout = new (window as any).WidgetCheckout({
        currency: "COP",
        amountInCents,
        reference,
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        signature: { integrity: signature },
      });

      checkout.open((result: any) => {
        const tx = result?.transaction;
        if (!tx) return;

        if (tx.status === "APPROVED") {
          toast.success("Pago aprobado ✅");

          /** Guardar info para modal */
          setPaymentInfo({
            raffleName: raffle.title,
            tickets: tickets.map((t) => t.ticket_number), // ✅ array de tickets
          });

          setSuccessModalOpen(true);

          getPaymentsUser(token); // refresca tickets
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