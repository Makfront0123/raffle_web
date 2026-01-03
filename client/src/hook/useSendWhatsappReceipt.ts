"use client";

import axios from "axios";
import { AuthStore } from "@/store/authStore";
import { useState } from "react";

export function useWhatsappReceipt() {
  const { user } = AuthStore();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendReceipt = async ({
    phone,
    raffleName,
    tickets, // array de tickets
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

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/whatsapp/receipt`,
        {
          phone: cleanPhone,
          raffleName,
          tickets,
          amount,
          userId: user.id,
        }
      );

      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return { sendReceipt, loading, sent };
}
