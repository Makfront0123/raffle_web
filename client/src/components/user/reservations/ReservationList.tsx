import ReservationCard from "./ReservationCard";
import { Raffle } from "@/type/Raffle";
import { Reservation } from "@/type/Reservation";

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
  onPay: (method: "nequi" | "daviplata", raffleId: number, ticketId: number) => Promise<void>;
}) {
  if (paginatedReservations.length === 0)
    return <div className="text-gray-400">No tienes reservas activas</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedReservations.map((r) => {
        const ticket = r.reservationTickets?.[0]?.ticket;
        if (!ticket) return null;
        const raffle = raffles.find((rf) => rf.id === ticket.raffleId);

        return (
          <ReservationCard
            key={r.id}
            reservation={r}
            raffle={raffle}
            canceling={canceling}
            onCancel={onCancel}
            onPay={onPay}
          />
        );
      })}
    </div>
  );
}
