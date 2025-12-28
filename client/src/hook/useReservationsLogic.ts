"use client";

import { useState,useMemo } from "react";
import { useReservation } from "@/hook/useReservation";
import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";
import { usePayment } from "@/hook/usePayment";
import { toast } from "sonner";
import { useRaffles } from "./useRaffles";
import { Reservation } from "@/type/Reservation";
import { Raffle } from "@/type/Raffle";
import { Ticket } from "@/type/Ticket";
import { TicketStatusEnum } from "@/type/Payment";

export function useReservationsLogic() {
  const { reservations, loading, error, fetchReservations } = useReservation();
  const { cancelReservation } = useReservationStore();
  const { raffles } = useRaffles();
  const { token } = AuthStore();
  const { payWithWompiWidget } = usePayment();

  const [canceling, setCanceling] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  const activeReservations = useMemo(
    () =>
      reservations.filter(
        (r) => new Date(r.expires_at).getTime() > Date.now()
      ),
    [reservations]
  );

  const paginatedReservations = useMemo(() => {
    return activeReservations.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }, [activeReservations, page]);

  const totalPages = Math.ceil(activeReservations.length / itemsPerPage);

  const handleCancel = async (id: number) => {
    if (!token) return;
    setCanceling(id);
    await cancelReservation(id, token);
    await fetchReservations();
    setCanceling(null);
  };

  const handleAction = async (reservation: Reservation, raffle: Raffle) => {
    if (!token) return;

    try {
      const tickets: Ticket[] = reservation.reservationTickets.map(t => ({
        ...t.ticket,
        status: t.ticket.status as TicketStatusEnum,
        raffle,
      }));


      await payWithWompiWidget({
        raffle,
        tickets, // ✅ ahora sí cumplen con Ticket[]
        reservation_id: reservation.id,
      });


      toast.success("Pago de reserva registrado ✅");

      await fetchReservations();
    } catch (err) {
      console.error(err);
      toast.error("Error creando pago");
    }
  };


  return {
    reservations,
    loading,
    error,
    raffles,
    canceling,
    page,
    totalPages,
    paginatedReservations,
    setPage,
    handleCancel,
    handleAction,
  };
}