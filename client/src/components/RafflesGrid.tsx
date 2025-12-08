"use client";

import RaffleCard from "@/components/RaffleCard";
import { motion } from "framer-motion";

export default function RaffleGrid({
  raffles,
  setShowExpiredModal,
}: {
  raffles: any[];
  setShowExpiredModal: (open: boolean, raffle?: any) => void;
}) {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gold mb-10 drop-shadow-lg">
          Rifas Disponibles
        </h2>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {raffles.map((r) => (
            <RaffleCard
              key={r.id}
              raffle={r}
              setShowExpiredModal={setShowExpiredModal}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
