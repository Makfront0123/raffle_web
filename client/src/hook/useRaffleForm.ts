"use client";
import { Prizes } from "@/type/Prizes";
import { Ticket } from "@/type/Ticket";
import { useState } from "react";

export type RaffleFormLocal = {
  title: string;
  description: string;
  price: string;
  end_date: string;
  digits: number;
  status: string;
  tickets: Ticket[];
  prizes: Prizes[];
};

const initialForm: RaffleFormLocal = {
  title: "",
  description: "",
  price: "8",
  end_date: "",
  digits: 3,
  status: "active",
  tickets: [],
  prizes: [],
};

export const useRaffleForm = () => {
  const [form, setForm] = useState<RaffleFormLocal>(initialForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const resetForm = () => setForm(initialForm);

  const getValidatedPayload = () => {
    if (!form.end_date) throw new Error("Selecciona una fecha");

    const endDate = new Date(form.end_date + "T23:59:59");
    if (isNaN(endDate.getTime())) throw new Error("Fecha inválida");

    const min = new Date();
    min.setDate(min.getDate() + 7);
    if (endDate < min) throw new Error("Debe ser mínimo 7 días después");

    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) throw new Error("Precio inválido");

    return {
      title: form.title,
      description: form.description,
      price,
      digits: form.digits,
      endDate: endDate.toISOString(),
    };
  };

  return { form, setForm, handleChange, resetForm, getValidatedPayload };
};
