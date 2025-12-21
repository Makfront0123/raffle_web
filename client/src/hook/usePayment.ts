"use client";

import { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { PaymentCreateDto } from "@/type/Payment";
import { toast } from "sonner";

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

  useEffect(() => {
    if (!token || !user?.id) return;
    getPayments(token).catch(() => setError("Error al cargar los pagos"));
  }, [token, user?.id]);

  // 🔵 Pago backend clásico
  const makePayment = async (data: PaymentCreateDto) => {
    if (!token) {
      toast.error("Debes iniciar sesión");
      return;
    }
    return createPayment(data, token);
  };

  // 🔵 Pago con Wompi Widget
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

      // 🔥 1. CREAR PAGO EN BACKEND
      await widgetPayment(
        {
          raffle_id: raffle.id,
          ticket_id: ticket.id_ticket,
          method, // ✅ usar el método que tú controlas
          reference,
        },
        token
      );

      // 🔥 2. OBTENER FIRMA
      const { signature } = await getWompiSignature(
        { reference, amount_in_cents: amountInCents, currency: "COP" },
        token
      );

      // 🔥 3. ABRIR WIDGET
      const checkout = new (window as any).WidgetCheckout({
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        currency: "COP",
        amountInCents,
        reference,
        signature: { integrity: signature },
      });


      checkout.open(async (result: any) => {
        const tx = result?.transaction;

        if (tx?.status === "APPROVED") {
          toast.success("Pago aprobado, esperando confirmación...");
        } else if (tx?.status === "DECLINED") {
          toast.error("Pago rechazado");
        } else if (tx?.status === "ERROR") {
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
  };
}


/*
# Variables de entorno públicas (cliente)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=987029861973-lgmv242645t13lpjp6g1lunkc2ipvdka.apps.googleusercontent.com
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_Kk2WLiEL1dX7vFC0ea5gIOpK8FGHd2hL

 //WOMPI INTEGRATION
WOMPI_PUBLIC_KEY=pub_test_Kk2WLiEL1dX7vFC0ea5gIOpK8FGHd2hL
WOMPI_PRIVATE_KEY=prv_test_1enGTHa2v4ALs4L3ADwnOhaHpe1VQqlm
WOMPI_INTEGRITY_SECRET=test_integrity_mkuGZ8PNZTT6KFaHz4iRA3B7q0tNy1LL


*/

/*
"use client";

import { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { PaymentCreateDto } from "@/type/Payment";
import { toast } from "sonner";

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

  useEffect(() => {
    if (!token || !user?.id) return;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        await getPayments(token);
      } catch (err) {
        setError("Error al cargar los pagos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token, user?.id]);

  // 🔵 Backend clásico
  const makePayment = async (data: PaymentCreateDto) => {
    if (!token) {
      toast.error("Debes iniciar sesión para pagar.");
      return;
    }

    setLoading(true);
    try {
      return await createPayment(data, token);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Widget Wompi
  const payWithWidget = async (data: any) => {
    if (!token) {
      toast.error("Debes iniciar sesión");
      return;
    }
    return widgetPayment(data, token);
  };

  return {
    payments,
    loading,
    error,
    makePayment,
    payWithWidget, // 👈 IMPORTANTE
    cancelPayment,
    completePayment,
  };
}

*/