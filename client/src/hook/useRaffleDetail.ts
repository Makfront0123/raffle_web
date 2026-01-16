"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const params = useParams<{ id?: string }>();
  const id = params?.id ? Number(params.id) : undefined;

  const MAX_TICKETS = 5;
  const perPage = 50;
  const router = useRouter();
  const { user } = AuthStore();
  const { raffles, getRaffleById } = useRaffleStore();
  const { createReservation } = useReservationStore();
  const { getSoldPercentage } = useTicketStore();

  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [localTickets, setLocalTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [soldPercentage, setSoldPercentage] = useState<number>(0);

  const refreshRaffle = useCallback(async () => {
    if (!id || !user) return;
    try {
      const updated = await getRaffleById(id);
      setRaffle(updated);
      if (updated?.id) {
        const percentNumber = await getSoldPercentage(updated.id);
        setSoldPercentage(percentNumber);

      }
    } catch {
      console.error("Error cargando rifa");
    }
  }, [id, getRaffleById, getSoldPercentage, user]);


  useEffect(() => {
    refreshRaffle();
  }, [refreshRaffle]);

  useEffect(() => {
    if (!id) return;
    const found = raffles.find((r) => r.id === id);
    if (found) setRaffle(found);
  }, [raffles, id]);
  useEffect(() => {
    if (!raffle) return;
    setLocalTickets(raffle.tickets || []);
    if (raffle.id && user) {
      (async () => {
        const percentObj = await getSoldPercentage(raffle.id);
        setSoldPercentage(percentObj ?? 0);
      })();
    }
  }, [raffle, getSoldPercentage, user]);

  useEffect(() => {
    if (!raffle?.end_date) return;

    const endTime = new Date(raffle.end_date).getTime();

    const interval = setInterval(() => {
      if (Date.now() > endTime) {
        toast.info("La rifa ha finalizado");
        router.replace("/raffles");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [raffle?.end_date, router]);





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

    if (raffle?.end_date && new Date(raffle.end_date) < new Date()) {
      toast.error("La rifa ya finalizó");
      return;
    }


    setSelectedTickets((prev) => {
      const exists = prev.some((t) => t.id_ticket === ticket.id_ticket);
      if (exists) return prev.filter((t) => t.id_ticket !== ticket.id_ticket);
      if (prev.length >= MAX_TICKETS) {
        toast.error(`Máximo ${MAX_TICKETS} tickets por compra`);
        return prev;
      }
      return [...prev, ticket];
    });
  };

  const handleAction = async (action: "pay" | "reserved") => {
    if (!raffle || selectedTickets.length === 0) return;

    if (raffle?.end_date && new Date(raffle.end_date) < new Date()) {
      toast.error("La rifa ya finalizó");
      return;
    }


    if (action === "reserved") {
      try {
        await Promise.all(
          selectedTickets.map((t) => createReservation(t.id_ticket, raffle.id))
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
    await payWithWompiWidget({ tickets: selectedTickets, raffle, method: "pay" });
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
