"use client";

import { Winner } from "@/type/Winner";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function WinnersSection({ winners }: { winners: Winner[] }) {
  const itemsPerPage = 2;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(winners.length / itemsPerPage));

  return (
    <section
      id="winners"
      className="py-20 bg-black/80 relative rounded-2xl shadow-xl border border-gold/30"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <Trophy className="h-8 w-8 text-gold" />
          <h2 className="text-3xl font-extrabold text-gold drop-shadow-xl">
            Ganadores de la rifa
          </h2>
        </div>
        {winners.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-bold text-white/30">
              No hay ganadores aún
            </h3>
            <p className="text-sm text-white/50">
              ¡Próximamente!
            </p>
          </div>
        )}

        {winners.length > 0 && (
          <div className="bg-black/60 border border-gold/40 rounded-2xl p-8 backdrop-blur-xl shadow-lg">

            <div className="space-y-4">
              {winners.map((w, index) => (
                <motion.div
                  key={`winner-${w.prize_id}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between bg-black/50 border border-gold/20 rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gold font-bold text-lg">
                      #{index + 1}
                    </span>
                    <Image
                      alt="avatar"
                      src={w.winner_user?.picture || "/icons/mynaui--user.png"}
                      width={48}
                      height={48}
                      className="rounded-full border border-gold object-cover"
                    />

                    <div>
                      <p className="text-gold font-semibold md:text-lg text-sm">
                        {w.winner_user?.name ?? "Usuario desconocido"}
                      </p>
                      <p className="md:text-lg text-sm text-yellow-500">
                        {w.raffle_title}
                      </p>
                      <p className="md:text-lg text-xs text-gray-400">
                        Ticket #{w.winner_ticket.ticket_number}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg border border-gold/40 text-gold
                ${page === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gold/20"
                }`}
            >
              ◀ Anterior
            </button>

            <span className="text-gold font-semibold">
              Página {page} de {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg border border-gold/40 text-gold
                ${page === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gold/20"
                }`}
            >
              Siguiente ▶
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
