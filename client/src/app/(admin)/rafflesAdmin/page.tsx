"use client";

import { useRaffles } from "@/hook/useRaffles";
import { useRaffleForm } from "@/hook/useRaffleForm";
import { useMemo, useState } from "react";
import { RaffleForm } from "@/components/admin/raffle/RaffleForm";
import { RafflesTable } from "@/components/admin/raffle/RaffleTable";


const RafflesAdmin = () => {
  const { raffles, createRaffle, loading, error, deleteRaffle, activateRaffle, deactivateRaffle, updateRaffle } = useRaffles();
  const { form, handleChange, resetForm } = useRaffleForm();
  const { page, totalPages, items: currentRaffles, setPage } = usePagination(raffles, 5, false);

  const [currentPage, setCurrentPage] = useState(1);
  const rafflesPerPage = 5;
  const start = (currentPage - 1) * rafflesPerPage;
  const currentRaffles = useMemo(
    () => raffles.slice(start, start + rafflesPerPage),
    [raffles, start]
  );

  const totalPages = Math.ceil(raffles.length / rafflesPerPage);

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  })();

  const handleSubmit = () => {
    const formattedForm = {
      ...form,
      price: Number(form.price),
      digits: Number(form.digits),
    };

    createRaffle(formattedForm, resetForm).catch(console.error);
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
        currentPage={page}
        setCurrentPage={setPage}
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