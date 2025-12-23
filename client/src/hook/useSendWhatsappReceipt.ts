"use client";

import axios from "axios";
import { AuthStore } from "@/store/authStore";
import { useState } from "react";

export function useWhatsappReceipt() {
    const { token } = AuthStore();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const sendReceipt = async ({
        phone,
        raffleName,
        ticketNumber,
        amount,
    }: {
        phone: string;
        raffleName: string;
        ticketNumber: string;
        amount: number;
    }) => {
        try {
            const cleanPhone = phone.replace(/\D/g, "");
            setLoading(true);

            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/whatsapp/receipt`,
                { phone: cleanPhone, raffleName, ticketNumber, amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSent(true);
        } finally {
            setLoading(false);
        }
    };

    return { sendReceipt, loading, sent };
}
