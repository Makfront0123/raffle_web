"use client";

import { useRaffles } from "@/hook/useRaffles";
import { AuthStore } from "@/store/authStore";
import { useRaffleForm } from "@/hook/useRaffleForm";

import { useState } from "react";
import { RaffleForm } from "@/components/admin/raffle/RaffleForm";
import { RafflesTable } from "@/components/admin/raffle/RaffleTable";

const RafflesAdmin = () => {

  const {
    raffles,
    addRaffle,
    loading,
    error,
    deleteRaffle,
    activateRaffle,
    deactivateRaffle,
    updateRaffle,
  } = useRaffles();

  const { form, handleChange, resetForm } = useRaffleForm();

  const [currentPage, setCurrentPage] = useState(1);
  const rafflesPerPage = 5;

  const start = (currentPage - 1) * rafflesPerPage;
  const currentRaffles = raffles.slice(start, start + rafflesPerPage);
  const totalPages = Math.ceil(raffles.length / rafflesPerPage);

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const date = new Date(form.end_date);
    const min = new Date();
    min.setDate(min.getDate() + 7);

    if (!form.end_date) return alert("Selecciona una fecha.");
    if (date < min) return alert("Debe ser mínimo 7 días después.");

    await addRaffle({
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      end_date: new Date(form.end_date + "T23:59:59").toISOString(),
      digits: form.digits,
    });

    resetForm();
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Administrar Rifas</h1>

      <RaffleForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        minDate={minDate}
      />

      <RafflesTable
        raffles={currentRaffles}
        loading={loading}
        error={error}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        deleteRaffle={deleteRaffle}
        activateRaffle={activateRaffle}
        deactivateRaffle={deactivateRaffle}
        updateRaffle={updateRaffle}
      />
    </main>
  );
};

export default RafflesAdmin;
