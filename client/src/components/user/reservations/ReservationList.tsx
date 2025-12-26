"use client";

import ReservationCard from "./ReservationCard";
import { Raffle } from "@/type/Raffle";
import { Reservation } from "@/type/Reservation";
import { AnimatePresence, motion } from "framer-motion";

export default function ReservationsList({
  paginatedReservations,
  raffles,
  canceling,
  onCancel,
  onPay,
}: {
  paginatedReservations: Reservation[];
  raffles: Raffle[];
  canceling: number | null;
  onCancel: (id: number) => Promise<void>;
  onPay: (reservation: Reservation, raffle: Raffle) => Promise<void>;
}) {
  if (paginatedReservations.length === 0)
    return <div className="text-black text-center">No tienes reservas activas</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {paginatedReservations.map((r) => {
          const ticket = r.reservationTickets?.[0]?.ticket;
          if (!ticket) return null;
          const raffle = raffles.find((rf) => rf.id === ticket.raffleId);

          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReservationCard
                reservation={r}
                raffle={raffle!}
                canceling={canceling}
                onCancel={onCancel}
                onPay={onPay}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}