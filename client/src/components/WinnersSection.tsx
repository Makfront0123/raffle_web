"use client";

import { Winner } from "@/type/Winner";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useState } from "react";

export default function WinnersSection({ winners }: { winners: Winner[] }) {
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(winners.length / itemsPerPage);

  const paginatedWinners = winners.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <section  id="winners" className="py-20 bg-black/80 relative rounded-lg shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <Trophy className="h-8 w-8 text-gold" />
          <h2 className="text-3xl font-bold text-gold drop-shadow-xl">
            Ganadores Recientes
          </h2>
        </div>


        <div
          className="grid gap-8 justify-center px-10"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >

          {paginatedWinners.map((w: Winner) => (
            <motion.div
              key={w?.id}
              className="bg-black/60 border border-gold/40 rounded-xl shadow-lg p-5 flex flex-col items-center text-center backdrop-blur-xl"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <img src={w.winner_user?.picture} className="w-24 h-24 rounded-full border-2 border-gold object-cover shadow-md" />
              <h3 className="text-xl text-gold font-semibold mt-4">
                {w.winner_user?.name ?? "Usuario desconocido"}
              </h3>
              <p className="text-gray-300 text-sm mt-1">{w.raffle_title}</p>
              <p className="text-gold font-bold text-lg mt-2">
                {w.winner_ticket.ticket_number}
              </p>
            </motion.div>
          ))}
        </div>
 
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg border border-gold/40 text-gold 
              ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gold/20"}`}
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
              ${page === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gold/20"}`}
          >
            Siguiente ▶
          </button>
        </div>
      </div>
    </section>
  );
}
