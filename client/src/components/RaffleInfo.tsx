"use client";

import { Raffle } from "@/type/Raffle";

 

interface RaffleInfoProps {
  raffle: Raffle;
  soldPercentage: number;
}

const RaffleInfo = ({ raffle, soldPercentage }: RaffleInfoProps) => {
  if (!raffle) return null; // ⛑️ Evita el crash inicial

  return (
    <div className="w-full min-h-[30vh] relative md:mt-0 mt-20">
      <div className="flex md:flex-row flex-col items-start justify-between">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2 text-black">{raffle.title}</h1>
          <p className="text-gray-400 mb-4">{raffle.description}</p>

          <p className="font-semibold text-black">
            🎟️ Total tickets: {raffle.total_numbers}
          </p>

          <p className="font-semibold text-black">
            💰 Precio por ticket: ${raffle.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RaffleInfo;
