"use client";

import { useRaffles } from "@/hook/useRaffles";
import { RaffleForm } from "@/components/admin/raffle/RaffleForm";
import { RafflesTable } from "@/components/admin/raffle/RaffleTable";
import { useZodForm } from "@/hook/useZodForm";
import { raffleSchema } from "@/lib/schemas/raffle.schema";
import { initialForm } from "@/type/Raffle";


const RafflesAdmin = () => {
  const {
    paginatedRaffles,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    statusFilter,
    setStatusFilter,
    createRaffle,
    deleteRaffle,
    activateRaffle,
    deactivateRaffle,
    updateRaffle,
  } = useRaffles();
  const {
    form,
    handleChange,
    validate,
    errors
  } = useZodForm(initialForm, raffleSchema);

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await createRaffle(form);
  };
  return (
    <main className="space-y-8 p-4 sm:p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Administrar Rifas</h1>
      <RaffleForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        minDate={minDate}
        errors={errors}
      />

      <RafflesTable
        raffles={paginatedRaffles}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        deleteRaffle={deleteRaffle}
        activateRaffle={activateRaffle}
        deactivateRaffle={deactivateRaffle}
        updateRaffle={updateRaffle}
      />

    </main>
  );
};

export default RafflesAdmin;
