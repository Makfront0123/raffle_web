"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import Image from "next/image";
import { Winner } from "@/type/Winner";
import { formatCOP } from "@/app/utils/formatCOP";

interface Props {
  winners: Winner[];
  raffles: { id: number; title: string }[];
  raffleId: number | "all";
  onRaffleChange: (value: number | "all") => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function WinnersSection({
  winners,
  raffles,
  raffleId,
  onRaffleChange,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <section
      id="winners"
      className="py-20 bg-black/80 relative rounded-2xl shadow-xl border border-gold/30"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-gold" />
            <h2 className="text-3xl font-extrabold text-gold">
              Ganadores de la rifa
            </h2>
          </div>

          <select
            value={raffleId}
            onChange={(e) =>
              onRaffleChange(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="bg-black/70 border border-gold/40 text-gold px-4 py-2 rounded-lg"
          >
            <option value="all">Todas las rifas</option>
            {raffles.map(r => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        {winners.length === 0 ? (
          <div className="text-center py-16 text-white/40 font-light">
            No hay ganadores
          </div>
        ) : (
          <div className="space-y-4">
            {winners.map((w, index) => (
              <motion.div
                key={`${w.prize_id}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between gap-4 bg-black/50 border border-gold/20 rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    alt="avatar"
                    src={w.winner_user?.picture || "/icons/mynaui--user.png"}
                    width={48}
                    height={48}
                    className="rounded-full border border-gold object-cover"
                  />
                  <div>
                    <p className="text-gold font-semibold">
                      {w.winner_user.name}
                    </p>
                    <p className="text-yellow-500">{w.raffle_title}</p>
                    <p className="text-gray-400 text-sm">
                      Ticket #{w.winner_ticket}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:items-end items-start">
                  <p className="text-white font-semibold md:text-lg text-sm">
                    {w.prize_name}</p>
                  <span className="md:text-2xl text-sm text-yellow-500 font-bold">{formatCOP(w.value)} COP</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-6 mt-10">
            <button
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="px-4 py-2 border border-gold/40 rounded-lg text-gold disabled:opacity-40"
            >
              ◀ Anterior
            </button>

            <span className="text-gold">
              Página {page} de {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-4 py-2 border border-gold/40 rounded-lg text-gold disabled:opacity-40"
            >
              Siguiente ▶
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
