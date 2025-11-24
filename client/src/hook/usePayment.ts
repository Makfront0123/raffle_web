"use client";

import { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import {  PaymentCreateDto } from "@/type/Payment";
import { toast } from "sonner";

export function usePayment() {
    const { payments, createPayment, cancelPayment, getPayments, completePayment } = usePaymentStore();

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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [token, user?.id]);


    const makePayment = async (data: PaymentCreateDto) => {
        if (!token) {
            toast.error("Debes iniciar sesión para pagar.");
            return;
        }

        try {
            setLoading(true);
            const payment = await createPayment(data, token);
            toast.success("💳 Pago registrado exitosamente");
            return payment;
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error al procesar el pago");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancel = async (id: number) => {
        if (!token) return;
        try {
            await cancelPayment(id, token);
            toast.success("Pago cancelado correctamente");
        } catch {
            toast.error("Error al cancelar el pago");
        }
    };

    return {
        payments,
        loading,
        error,
        makePayment,
        cancel,
        completePayment
    };
}
