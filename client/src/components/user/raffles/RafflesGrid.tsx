"use client";

import RaffleCard from "@/components/user/raffles/RaffleCard";
import { Raffle } from "@/type/Raffle";
import { motion } from "framer-motion";

export default function RaffleGrid({
  raffles,
  setShowExpiredModal,
}: {
  raffles: Raffle[];
  setShowExpiredModal: (open: boolean, raffle?: Raffle) => void;
}) {
  return (
    <section className="py-16 relative w-full">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gold mb-10 drop-shadow-lg">
          Rifas Disponibles
        </h2>

 
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {raffles.map((r) => (
            <RaffleCard
              key={r.id}
              raffle={r}
              setShowExpiredModal={() => setShowExpiredModal}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
