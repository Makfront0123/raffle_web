"use client";

import { useEffect } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";

export function useAdminPayments() {
    const { payments, getPayments, loading, completePayment } = usePaymentStore();
    const { token, user } = AuthStore();

    const isAdmin = user?.role === "admin";


    console.log("USER", user);
    console.log("IS ADMIN", isAdmin);


    useEffect(() => {
        if (!token || !isAdmin) return;
        getPayments(token).catch(() =>
            console.error("Error cargando pagos admin")
        );
    }, [token, isAdmin, getPayments]);

    return {
        payments,
        loading,
        completePayment,
    };
}
