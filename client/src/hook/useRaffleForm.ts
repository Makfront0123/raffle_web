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

  return {
    form,
    setForm,
    handleChange,
    resetForm,
  };
};
