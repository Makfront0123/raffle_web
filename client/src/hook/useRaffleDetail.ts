"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { AuthStore } from "@/store/authStore";
import { useRaffleStore } from "@/store/raffleStore";
import { useReservationStore } from "@/store/reservationStore";
import { useTicketStore } from "@/store/ticketStore";
import { Ticket } from "@/type/Ticket";
import { Raffle } from "@/type/Raffle";
import { TicketStatusEnum } from "@/type/Payment";

interface Props {
  payWithWompiWidget: (args: {
    tickets: Ticket[];
    raffle: Raffle;
    method: "pay";
  }) => Promise<void>;
}

export function useRaffleDetail({ payWithWompiWidget }: Props) {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const MAX_TICKETS = 5;
  const perPage = 50;

  const { token } = AuthStore();
  const { raffles, getRaffleById } = useRaffleStore();
  const { createReservation } = useReservationStore();
  const { soldPercentage, getSoldPercentage } = useTicketStore();

  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [localTickets, setLocalTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  // --- useCallback para evitar recreación en cada render
  const refreshRaffle = useCallback(async () => {
    if (!id || !token) return;
    try {
      const updated = await getRaffleById(id, token);
      setRaffle(updated);
    } catch {
      console.error("Error cargando rifa");
    }
  }, [id, token, getRaffleById]);

  // --- Cargar rifa al montar o cuando id/token cambian
  useEffect(() => {
    refreshRaffle();
  }, [refreshRaffle]);

  // --- Actualizar rifa si cambia el store de raffles
  useEffect(() => {
    const found = raffles.find((r) => r.id === id);
    if (found) setRaffle(found);
  }, [raffles, id]);

  // --- Actualizar tickets y porcentaje vendidos cuando cambia la rifa
  useEffect(() => {
    if (raffle?.tickets) {
      setLocalTickets(raffle.tickets);
      if (token) getSoldPercentage(raffle.id, token);
    }
  }, [raffle, token, getSoldPercentage]);

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
    if (ticket.status !== TicketStatusEnum.AVAILABLE) {
      toast.error("Este ticket no está disponible");
      return;
    }

    setSelectedTickets((prev) => {
      const exists = prev.some((t) => t.id_ticket === ticket.id_ticket);

      if (exists) {
        return prev.filter((t) => t.id_ticket !== ticket.id_ticket);
      }
      if (prev.length >= MAX_TICKETS) {
        toast.error(`Máximo ${MAX_TICKETS} tickets por compra`);
        return prev;
      }

      return [...prev, ticket];
    });
  };

  const handleAction = async (action: "pay" | "reserved") => {
    if (!raffle || selectedTickets.length === 0) return;

    if (action === "reserved") {
      try {
        await Promise.all(
          selectedTickets.map((t) =>
            createReservation(t.id_ticket, raffle.id, token!)
          )
        );

        toast.success("Tickets reservados 🕒");
        setOpen(false);

        setLocalTickets((prev) =>
          prev.map((t) =>
            selectedTickets.some((s) => s.id_ticket === t.id_ticket)
              ? { ...t, status: TicketStatusEnum.RESERVED }
              : t
          )
        );

        setSelectedTickets([]);
      } catch {
        toast.error("No se pudo reservar");
      }
      return;
    }

    setOpen(false);
    await payWithWompiWidget({
      tickets: selectedTickets,
      raffle,
      method: "pay",
    });
  };

  return {
    raffle,
    page,
    setPage,
    totalPages,
    currentTickets,
    open,
    setSelectedTickets,
    setOpen,
    getTicketColor,
    handleAction,
    soldPercentage,
    refreshRaffle,
    handleTicketSelect,
    selectedTickets,
  };
}
