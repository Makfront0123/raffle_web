"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hook/useCountdown";
import { toast } from "sonner";
import { Raffle } from "@/type/Raffle";
import { Reservation } from "@/type/Reservation";
import RaffleTicketModal from "@/components/user/raffles/RaffleTickedModal";
import { Ticket } from "@/type/Ticket";
import { useReservationsLogic } from "@/hook/useReservationsLogic";
import { Payment } from "@/type/Payment";

export default function ReservationCard({
  reservation,
  raffle,
  canceling,
  onCancel,
  onPay,
}: {
  reservation: Reservation;
  raffle?: Raffle;
  canceling: number | null;
  onCancel: (id: number) => Promise<void>;
  onPay: (reservation: Reservation, raffle: Raffle) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const countdown = useCountdown(reservation.expires_at);
  const ticket = reservation.reservationTickets?.[0]?.ticket;

  useEffect(() => {
    if (countdown === "Expirada" || countdown === "00:00") {
      toast.error(`La reserva #${reservation.id} ha expirado 😔`);
    }
  }, [countdown, reservation.id]);

  if (!ticket || !raffle) return null;
  const ticketForModal: Ticket = {
    ...ticket,
    raffle: {
      id: raffle.id,
      title: raffle.title,
      description: raffle.description,
      total_numbers: raffle.total_numbers,
      price: String(raffle.price),
    },
  };


  return (
    <>
      <Card className="p-8 bg-black text-white border border-gold rounded-2xl shadow-xl hover:scale-[1.02] transition-all">
        <CardHeader>
          <h3 className="font-semibold text-xl text-gold">{raffle.title}</h3>
          <p className="text-sm text-white/60">
            Ticket #{ticket.ticket_number} — {ticket.status}
          </p>
          <p className="text-sm text-white/70">{raffle.description}</p>
        </CardHeader>

        <CardContent>
          <p className="text-white/80">
            ⏳ Expira en: <span className="font-bold text-gold">{countdown}</span>
          </p>

          <div className="flex mt-6 gap-4">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={canceling === reservation.id}
              onClick={() => onCancel(reservation.id)}
            >
              {canceling === reservation.id ? "Cancelando..." : "Cancelar"}
            </Button>

            {ticket.status === "reserved" && (
              <Button
                className="bg-gold text-white hover:bg-gold/80"
                onClick={() => setOpen(true)}
              >
                Comprar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <RaffleTicketModal
        open={open}
        setOpen={setOpen}
        tickets={[ticketForModal]}   // ✅
        raffle={raffle}
        handleAction={async () => {
          await onPay(reservation, raffle);
          setOpen(false);
        }}
      />

    </>
  );
}