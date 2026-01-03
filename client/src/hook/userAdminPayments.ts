"use client";

import { useEffect } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";

export function useAdminPayments() {
    const { payments, getPayments, loading, completePayment } = usePaymentStore();
    const {  user } = AuthStore();

    const isAdmin = user?.role === "admin";

    useEffect(() => {
        if (!user || !isAdmin) return;
        getPayments().catch(() =>
            console.error("Error cargando pagos admin")
        );
    }, [user, isAdmin, getPayments]);

    return {
        payments,
        loading,
        completePayment,
    };
}
