// src/components/RafflesList.tsx
"use client";
import React from "react";
import { useRaffles } from "@/hook/useRaffles";

export default function RafflesList() {
  const { raffles, loading, error } = useRaffles();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!raffles || raffles.length === 0) return <div>No hay rifas disponibles</div>;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-y-10">
      {raffles.map((raffle: any) => (
        <div
          key={raffle.id}
          className="w-full max-w-md bg-white rounded-lg shadow-lg p-10 flex flex-col items-center justify-center gap-y-5"
        >
          <h1 className="text-4xl font-bold text-black">{raffle.title}</h1>
          <p className="text-xl text-black">{raffle.price}</p>
          <p className="text-xl text-black">{raffle.total_numbers} tickets</p>
          <button
            onClick={() => (window.location.href = `/raffles/${raffle.id}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Participar
          </button>
        </div>
      ))}
    </div>
  );
}
