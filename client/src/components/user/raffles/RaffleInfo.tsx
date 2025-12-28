"use client";

import { Raffle } from "@/type/Raffle";

interface Props {
  raffle: Raffle;
  soldPercentage: number;
}

export default function RaffleInfo({ raffle, soldPercentage }: Props) {
  return (
    <div className="flex md:flex-row flex-col items-start justify-between">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 text-black">{raffle.title}</h1>
        <p className="text-gray-400 mb-4">{raffle.description}</p>
        <p className="font-semibold text-black">🎟️ Total tickets: {raffle.total_numbers}</p>
        <p className="font-semibold text-black">💰 Precio por ticket: ${raffle.price}</p>
        <p className="text-sm text-gray-500 mt-2">
          ⏰ Termina: {new Date(raffle.end_date).toLocaleString()}
        </p>
      </div>

      <div className="md:mt-6 mt-0 md:mb-0 mb-14">
        <p className="text-black text-sm mb-1">
          🎯 Progreso de venta: {soldPercentage.toFixed(2)}%
        </p>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${soldPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
