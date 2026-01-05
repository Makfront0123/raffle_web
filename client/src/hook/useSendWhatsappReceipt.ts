"use client";
import { AuthStore } from "@/store/authStore";
import { useState } from "react";
import { api } from "@/api/api";

export function useWhatsappReceipt() {
  const { user } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendReceipt = async ({
    phone,
    raffleId,
    tickets,
    amount,
  }: {
    phone: string;
    raffleId: number;
    tickets: string[];
    amount: number;
  }) => {
    if (!user) throw new Error("Debes iniciar sesión");

    let cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("57")) cleanPhone = "57" + cleanPhone;

    setLoading(true);
    try {
      await api.post("/api/payment/whatsapp/receipt", {
        phone: `+${cleanPhone}`,
        raffleId,
        tickets,
        amount,
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };


  return { sendReceipt, loading, sent };
}
