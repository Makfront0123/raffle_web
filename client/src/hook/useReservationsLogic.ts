"use client";
import { useState, useEffect, useMemo } from "react";
import { useReservation } from "@/hook/useReservation";
import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";
import { usePayment } from "@/hook/usePayment";
import { toast } from "sonner";
import { PaymentCreateDto } from "@/type/Payment";
import { useRaffles } from "./useRaffles";
export function useReservationsLogic() {
  const { reservations, loading, error, fetchReservations } = useReservation();
  const { cancelReservation, } = useReservationStore();
  const { raffles } = useRaffles();

  const { token } = AuthStore();
  const { makePayment } = usePayment();


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

  const handlePayment = async (
    method: "nequi" | "daviplata",
    raffleId: number,
    ticketId: number
  ) => {
    if (!token) return;
    const raffle = raffles.find(r => r.id === raffleId);
    if (!raffle) return toast.error("Rifa no encontrada");

    const total_amount = raffle.price;
    const reference = `RAFFLE_${raffleId}_TICKET_${ticketId}_${Date.now()}`;

    const paymentData: PaymentCreateDto = {
      method,
      raffle_id: raffleId,
      ticket_id: ticketId,
      total_amount,
      reference,
    };


    try {
      await makePayment(paymentData);
      await fetchReservations();
      toast.success(`Pago realizado con ${method === "nequi" ? "Nequi" : "Daviplata"} 💰`);
    } catch {
      toast.error("Error al procesar el pago");
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
    handlePayment,
  };
}
