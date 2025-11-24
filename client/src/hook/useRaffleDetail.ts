"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { AuthStore } from "@/store/authStore";
import { useRaffleStore } from "@/store/raffleStore";
import { useReservationStore } from "@/store/reservationStore";
import { useTicketStore } from "@/store/ticketStore";
import { usePayment } from "@/hook/usePayment";
import { Ticket } from "@/type/Ticket";
import { PaymentCreateDto } from "@/type/Payment";

export function useRaffleDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const { token } = AuthStore();
  const { raffles, getRaffleById } = useRaffleStore();
  const { createReservation } = useReservationStore();
  const { makePayment } = usePayment();
  const { soldPercentage, getSoldPercentage } = useTicketStore();

  const [raffle, setRaffle] = useState<any>(null);
  const [localTickets, setLocalTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 50;


  useEffect(() => {
    if (!id || !token) return;

    const fetchRaffle = async () => {
      try {
        const data = await getRaffleById(id, token);
        setRaffle(data);
      } catch (error) {
        console.error("Error cargando rifa:", error);
      }
    };

    fetchRaffle();
  }, [id, token, getRaffleById]);


  useEffect(() => {
    if (!id) return;
    const found = raffles.find((r) => r.id === id);
    if (found) setRaffle(found);
  }, [raffles, id]);


  useEffect(() => {
    if (raffle?.tickets) {
      setLocalTickets(raffle.tickets);
      getSoldPercentage(raffle.id, token!);
    }
  }, [raffle, getSoldPercentage, token]);

  const totalPages = Math.ceil(localTickets.length / perPage);
  const start = (page - 1) * perPage;
  const currentTickets = localTickets.slice(start, start + perPage);

  const getTicketColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
      case "reserved":
        return "bg-blue-100 text-blue-800 border-blue-300 cursor-not-allowed opacity-70";
      case "purchased":
        return "bg-red-100 text-red-800 border-red-300 cursor-not-allowed opacity-70";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleTicketSelect = (ticket: Ticket) => {
    if (ticket.status !== "available") {
      toast.error(
        ticket.status === "reserved"
          ? "Este ticket ya fue reservado 🕒"
          : "Este ticket ya fue comprado ❌",
        { duration: 1500 }
      );
      return;
    }
    setSelectedTicket(ticket);
    setOpen(true);
  };

  const handleAction = async (action: string) => {
    if (!selectedTicket || !raffle) return;
    setOpen(false);

    try {
      if (action === "reserve") {
        await createReservation(selectedTicket.id_ticket, raffle.id, token || "");
        setLocalTickets((prev) =>
          prev.map((t) =>
            t.id_ticket === selectedTicket.id_ticket ? { ...t, status: "reserved" } : t
          )
        );
        toast.success(`Ticket #${selectedTicket.ticket_number} reservado ✅`, {
          duration: 1500,
        });
        return;
      }

      const paymentData: PaymentCreateDto = {
        method: action as "nequi" | "daviplata",
        raffle_id: raffle.id,
        ticket_ids: [selectedTicket.id_ticket],
      };

      await makePayment(paymentData);

      setLocalTickets((prev) =>
        prev.map((t) =>
          t.id_ticket === selectedTicket.id_ticket ? { ...t, status: "purchased" } : t
        )
      );
      toast.success(`Pago realizado con ${action} 💳`, { duration: 1500 });
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la acción ❌");
    } finally {
      setSelectedTicket(null);
    }
  };

  return {
    token,
    raffle,
    page,
    setPage,
    totalPages,
    currentTickets,
    selectedTicket,
    setSelectedTicket,
    open,
    setOpen,
    getTicketColor,
    handleTicketSelect,
    handleAction,
    soldPercentage,
  };
}
