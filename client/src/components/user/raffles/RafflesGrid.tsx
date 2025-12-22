"use client";

import RaffleCard from "@/components/RaffleCard";
import { Raffle } from "@/type/Raffle";

interface Props {
  raffles: Raffle[];
  currentPage: number;
  rafflesPerPage: number;
  setShowExpiredModal: (v: any) => void;
}

export default function RafflesGrid({
  raffles,
  currentPage,
  rafflesPerPage,
  setShowExpiredModal,
}: Props) {
  const startIndex = (currentPage - 1) * rafflesPerPage;
  const endIndex = startIndex + rafflesPerPage;
  const paginatedRaffles = raffles.slice(startIndex, endIndex);

  return (
    <div className="flex flex-wrap justify-start gap-10 mt-10">
      {paginatedRaffles.length === 0 ? (
        <p className="text-gray-400 mt-10">
          No se encontraron rifas con esos criterios 😢
        </p>
      ) : (
        paginatedRaffles.map((raffle) => (
          <RaffleCard
            key={raffle.id}
            raffle={raffle}
            setShowExpiredModal={setShowExpiredModal}
          />
        ))
      )}
    </div>
  );
}
