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

export function useRaffleDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const { token } = AuthStore();
  const { raffles, getRaffleById } = useRaffleStore();
  const { createReservation } = useReservationStore();
  const { payWithWompiWidget } = usePayment(); // ✅ CAMBIO
  const { soldPercentage, getSoldPercentage } = useTicketStore();

  const [raffle, setRaffle] = useState<any>(null);
  const [localTickets, setLocalTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket>();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const perPage = 50;

  useEffect(() => {
    if (!id || !token) return;

    getRaffleById(id, token)
      .then(setRaffle)
      .catch(() => console.error("Error cargando rifa"));
  }, [id, token]);

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
  }, [raffle, token]);

  const totalPages = Math.ceil(localTickets.length / perPage);
  const start = (page - 1) * perPage;
  const currentTickets = localTickets.slice(start, start + perPage);

  const getTicketColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-gold/30 border border-gold text-white hover:bg-gold/40";
      case "reserved":
        return "bg-white/20 border border-white/40 text-white/70 cursor-not-allowed opacity-70";
      case "purchased":
        return "bg-red-700/60 border border-red-500 text-white cursor-not-allowed opacity-70";
      default:
        return "bg-gray-500/20 border border-gray-500/40 text-white/70";
    }
  };


  const handleTicketSelect = (ticket: Ticket) => {
    if (ticket.status !== "available") {
      toast.error(
        ticket.status === "reserved"
          ? "Este ticket ya fue reservado 🕒"
          : "Este ticket ya fue comprado ❌"
      );
      return;
    }
    setSelectedTicket(ticket);
    setOpen(true);
  };

  const handleAction = async (action: "card" | "pse" | "reserve") => {
    if (!selectedTicket || !raffle) return;

    if (action === "reserve") {
      try {
        await createReservation(selectedTicket.id_ticket, raffle.id, token!);
        toast.success("Ticket reservado 🕒");

        setOpen(false);
        if (raffle.tickets) {
          setLocalTickets((prev) =>
            prev.map((t) =>
              t.id_ticket === selectedTicket.id_ticket
                ? { ...t, status: "reserved" }
                : t
            )
          );
        }
      } catch (err) {
        toast.error("No se pudo reservar el ticket");
      }
      return;
    }



    if (action === "card" || action === "pse") {
      setOpen(false);
      await payWithWompiWidget({
        ticket: selectedTicket,
        raffle,
        method: action
      });


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