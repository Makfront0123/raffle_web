"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { AuthStore } from "@/store/authStore";
import { useRaffleStore } from "@/store/raffleStore";
import { useReservationStore } from "@/store/reservationStore";
import { useTicketStore } from "@/store/ticketStore";
import { Ticket } from "@/type/Ticket";

interface Props {
  payWithWompiWidget: (args: {
    ticket: Ticket;
    raffle: any;
    method: "card" | "pse";
  }) => Promise<void>;
}

export function useRaffleDetail({ payWithWompiWidget }: Props) {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const { token } = AuthStore();
  const { raffles, getRaffleById } = useRaffleStore();
  const { createReservation } = useReservationStore();
  const { soldPercentage, getSoldPercentage } = useTicketStore();

  const [raffle, setRaffle] = useState<any>(null);
  const [localTickets, setLocalTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket>();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const perPage = 50;

  const refreshRaffle = async () => {
    if (!id || !token) return;
    const updated = await getRaffleById(id, token);
    setRaffle(updated);
  };

  useEffect(() => {
    refreshRaffle().catch(() =>
      console.error("Error cargando rifa")
    );
  }, [id, token]);

  useEffect(() => {
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
        return "bg-gold/30 border border-gold";
      case "reserved":
        return "bg-white/20 opacity-70";
      case "purchased":
        return "bg-red-700/60 opacity-70";
      default:
        return "bg-gray-500/20";
    }
  };

  const handleTicketSelect = (ticket: Ticket) => {
    if (ticket.status !== "available") {
      toast.error("Este ticket no está disponible");
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

        setLocalTickets((prev) =>
          prev.map((t) =>
            t.id_ticket === selectedTicket.id_ticket
              ? { ...t, status: "reserved" }
              : t
          )
        );
      } catch {
        toast.error("No se pudo reservar");
      }
      return;
    }

    setOpen(false);
    await payWithWompiWidget({
      ticket: selectedTicket,
      raffle,
      method: action,
    });
  };

  return {
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
    refreshRaffle, // 👈 IMPORTANTE
  };
}
