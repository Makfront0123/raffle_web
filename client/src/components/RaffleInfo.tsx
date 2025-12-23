"use client";

import { Raffle } from "@/type/Raffle";

interface RaffleInfoProps {
  raffle: Raffle;
  soldPercentage: number;
}

const RaffleInfo = ({ raffle, soldPercentage }: RaffleInfoProps) => {
  if (!raffle) return null;

  const isHot = soldPercentage >= 80;

  return (
    <div className="w-full mb-12 relative">
      <h1
        className="
          text-4xl font-extrabold mb-4
          text-gold
          drop-shadow-[0_0_14px_rgba(212,175,55,0.45)]
        "
      >
        {raffle.title}
      </h1>

      <p className="text-white/70 max-w-xl mb-6">
        {raffle.description}
      </p>
      <div className="space-y-1 text-white/90 font-semibold mb-6">
        <p>🎟️ Total tickets: {raffle.total_numbers}</p>
        <p>💰 Precio por ticket: ${raffle.price}</p>
      </div>
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center mb-2 text-sm font-semibold">
          <span className="text-white/80">Progreso de ventas</span>
          <span
            className={`${
              isHot ? "text-red-400 animate-pulse" : "text-gold"
            }`}
          >
            {soldPercentage}%
          </span>
        </div>

        <div
          className="
            relative h-4 rounded-full overflow-hidden
            bg-white/10 backdrop-blur-md
            border border-white/15
          "
        >

          {isHot && (
            <div
              className="
                absolute inset-0
                bg-[linear-gradient(110deg,
                  transparent 30%,
                  rgba(255,255,255,0.6) 50%,
                  transparent 70%
                )]
                animate-[shimmer_1.2s_linear_infinite]
                opacity-70
              "
            />
          )}

          <div
            className={`
              h-full rounded-full
              transition-all duration-700 ease-out
              bg-gradient-to-r
              from-[#caa94a]
              via-[#ffe28a]
              to-[#caa94a]
              ${
                isHot
                  ? "shadow-[0_0_30px_rgba(255,215,100,0.95)]"
                  : "shadow-[0_0_18px_rgba(212,175,55,0.65)]"
              }
            `}
            style={{ width: `${Math.min(soldPercentage, 100)}%` }}
          />
        </div>

        {isHot && (
          <p className="mt-2 text-xs text-red-400 font-semibold tracking-wide animate-pulse">
            ⚡ ¡Últimos tickets disponibles!
          </p>
        )}
      </div>
    </div>
  );
};

export default RaffleInfo;
