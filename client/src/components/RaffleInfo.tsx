"use client";

import { Raffle } from "@/type/Raffle";

interface RaffleInfoProps {
  raffle: Raffle;
  soldPercentage: number;
}

const RaffleInfo = ({ raffle, soldPercentage }: RaffleInfoProps) => {
  if (!raffle) return null;

  return (
    <div className="w-full mb-12 relative">

      <h1 className="
        text-4xl font-extrabold mb-4 
        text-gold drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]
      ">
        {raffle.title}
      </h1>

      <p className="text-white/70 max-w-xl mb-4">
        {raffle.description}
      </p>

      <div className="space-y-1 text-white/90 font-semibold">
        <p>🎟️ Total tickets: {raffle.total_numbers}</p>
        <p>💰 Precio por ticket: ${raffle.price}</p>
        <p>🔥 Vendidos: {soldPercentage}%</p>
      </div>
    </div>
  );
};

export default RaffleInfo;
