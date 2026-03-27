"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { Raffle } from "@/type/Raffle";
import { Ticket } from "@/type/Ticket";
import { PaymentStatusEnum } from "@/type/Payment";
import axios from "axios";

interface UsePaymentProps {
  onPaymentSuccess?: () => Promise<void>;
}

export function usePayment({ onPaymentSuccess }: UsePaymentProps = {}) {
  const {
    userPayments,
    getPaymentsUser,
    widgetPayment,
    getWompiSignature,
    getPaymentStatusByReference,
    attachTransactionId,
    verifyPaymentManually,
    loading,
  } = usePaymentStore();

  const { user } = AuthStore();

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    raffle: Raffle
    tickets?: string[];
    amount?: number;
    reference?: string;
  } | null>(null);


  const [failedModalOpen, setFailedModalOpen] = useState(false);
  const [failedPaymentInfo, setFailedPaymentInfo] = useState<{ raffleName?: string; tickets?: string[]; reason?: string } | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  useEffect(() => {
    if (user) getPaymentsUser();
  }, [user, getPaymentsUser]);


  const loadWompiScript = () =>
    new Promise<void>((resolve) => {
      if (window.WidgetCheckout) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.wompi.co/widget.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve());
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.wompi.co/widget.js";
      script.async = true;
      script.onload = () => resolve();

      document.body.appendChild(script);
    });
  async function waitForPayment(reference: string): Promise<PaymentStatusEnum> {
    let attempts = 0;

    while (attempts < 10) {
      const status = await getPaymentStatusByReference(reference);

      if (status === PaymentStatusEnum.COMPLETED) {
        return status;
      }

      await new Promise((res) => setTimeout(res, 2000));
      attempts++;
    }

    return PaymentStatusEnum.PENDING;
  }
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

      const paymentData = await widgetPayment({
        method: "wompi",
        raffle_id: raffle.id,
        ticket_ids: tickets.map((t) => t.id_ticket),
        reservation_id,
        reference,
      });

      const amountInCents = paymentData.amount_in_cents;
      const finalReference = paymentData.reference;

      const { signature } = await getWompiSignature({
        reference: finalReference,
        amount_in_cents: amountInCents,
        currency: "COP",
      });

      await loadWompiScript();

      const merchant = await axios.get(
        `https://api-sandbox.wompi.co/v1/merchants/${process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY}`
      );

      const acceptanceToken =
        merchant.data.data.presigned_acceptance.acceptance_token;

      const checkout = new window.WidgetCheckout({
        currency: "COP",
        amountInCents,
        reference: finalReference,
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY!,
        acceptanceToken,
        signature: { integrity: signature },
      });

      checkout.open(async (result) => {
        const tx = result?.transaction;


        if (!tx) {
          setFailedModalOpen(true);
          return;
        }

        if (tx?.id) {
          await attachTransactionId(finalReference, tx.id);
        }


        if (tx.status === "DECLINED" || tx.status === "ERROR") {
          setFailedModalOpen(true);
          return;
        }

        if (tx.status === "APPROVED") {
          setVerifyingPayment(true);
          const status = await waitForPayment(finalReference);

          setVerifyingPayment(false);

          if (status === PaymentStatusEnum.COMPLETED) {
            setPaymentInfo({
              raffle,
              tickets: tickets.map((t) => t.ticket_number),
              amount: raffle.price * tickets.length,
              reference: finalReference,
            });

            setSuccessModalOpen(true);

            if (onPaymentSuccess) {
              await onPaymentSuccess();
            }

            return;
          }
          setFailedPaymentInfo({
            raffleName: raffle.title,
            tickets: tickets.map((t) => t.ticket_number),
            reason: "El pago no fue confirmado a tiempo",
          });

          setFailedModalOpen(true);
        }
      });
    } catch (error: unknown) {
      let message = "No se pudo iniciar el pago";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }

      toast.error(message);

      setFailedPaymentInfo({
        raffleName: raffle.title,
        tickets: tickets.map((t) => t.ticket_number),
        reason: message,
      });

      setFailedModalOpen(true);

      throw error;
    }
  };
  return {
    loading,
    userPayments,
    payWithWompiWidget,
    successModalOpen,
    setSuccessModalOpen,
    paymentInfo,
    failedModalOpen,
    setFailedModalOpen,
    failedPaymentInfo,
    setFailedPaymentInfo,
    verifyingPayment,
  };
}



/*
https://api-sandbox.wompi.co/v1/merchants/pub_test_Kk2WLiEL1dX7vFC0ea5gIOpK8FGHd2hL
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
    raffle: Raffle
    tickets?: string[];
    amount?: number;
  } | null>(null);


  const [failedModalOpen, setFailedModalOpen] = useState(false);
  const [failedPaymentInfo, setFailedPaymentInfo] = useState<{ raffleName?: string; tickets?: string[]; reason?: string } | null>(null);


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
            raffle,
            tickets: ticketsForPayment.map((t) => t.ticket_number),
            amount: raffle.price * tickets.length,
          });

          setSuccessModalOpen(true);

          getPaymentsUser();
          onPaymentSuccess?.();
        }

        if (tx.status === "DECLINED" || tx.status === "ERROR") {
          toast.error(`Pago ${tx.status === "DECLINED" ? "rechazado" : "fallido"}`);

          setFailedPaymentInfo({
            raffleName: raffle.title,
            tickets: ticketsForPayment.map((t) => t.ticket_number),
            reason: tx.status === "DECLINED" ? "El pago fue rechazado por el banco" : "Error en el procesamiento del pago",
          });

          setFailedModalOpen(true);
        }

        if (tx.status === "ERROR") toast.error("Error en el pago");
      });
    } catch (error: unknown) {

      let message = "No se pudo iniciar el pago";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }

      toast.error(message);

      setFailedPaymentInfo({
        raffleName: raffle.title,
        tickets: tickets.map((t) => t.ticket_number),
        reason: message,
      });

      setFailedModalOpen(true);

      throw error;
    }


  };

  return {
    loading,
    userPayments,
    payWithWompiWidget,
    successModalOpen,
    setSuccessModalOpen,
    paymentInfo,
    failedModalOpen,
    setFailedModalOpen,
    failedPaymentInfo,
    setFailedPaymentInfo,
  };
}

*/