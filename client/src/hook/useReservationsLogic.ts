"use client";
import { useState, useEffect, useMemo } from "react";
import { useReservation } from "@/hook/useReservation";
import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";
import { usePayment } from "@/hook/usePayment";
import { toast } from "sonner";
import { useRaffles } from "./useRaffles";

export function useReservationsLogic() {
  const { reservations, loading, error, fetchReservations } = useReservation();
  const { cancelReservation, createReservation } = useReservationStore();
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

  const handleAction = async (

    reservationTicket: any,
    raffleId: number
  ) => {
    if (!token) return;

    const raffle = raffles.find((r) => r.id === raffleId);
    if (!raffle) {
      toast.error("Rifa no encontrada");
      return;
    }
    await payWithWompiWidget({
      ticket: reservationTicket,
      raffle,
     
    });
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
