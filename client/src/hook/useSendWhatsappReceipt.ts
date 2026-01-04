"use client";

import axios from "axios";
import { AuthStore } from "@/store/authStore";
import { useState } from "react";
import { api } from "@/api/api";

export function useWhatsappReceipt() {
  const { user } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendReceipt = async ({
    phone,
    raffleName,
    tickets,
    amount,
  }: {
    phone: string;
    raffleName: string;
    tickets: string[];
    amount: number;
  }) => {
    if (!user) {
      throw new Error("Debes iniciar sesión");
    }

    try {
      let cleanPhone = phone.replace(/\D/g, "");

      if (!cleanPhone.startsWith("57")) {
        cleanPhone = "57" + cleanPhone;
      }

      cleanPhone = `+${cleanPhone}`;

      setLoading(true);
      await api.post("/api/payment/whatsapp/receipt", {
        phone: cleanPhone,
        raffleName,
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
