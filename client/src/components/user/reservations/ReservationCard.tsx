"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hook/useCountdown";
import { toast } from "sonner";

import { Raffle } from "@/type/Raffle";
import { Reservation } from "@/type/Reservation";
import { Ticket } from "@/type/Ticket";

import RaffleTicketModal from "@/components/user/raffles/RaffleTickedModal";
import { TicketStatusEnum } from "@/type/Payment";

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

  const rawTicket = reservation.reservationTickets?.[0]?.ticket;

  useEffect(() => {
    if (countdown === "Expirada" || countdown === "00:00") {
      toast.error(`La reserva #${reservation.id} ha expirado 😔`);
    }
  }, [countdown, reservation.id]);

  // ⛔ seguridad
  if (!rawTicket || !raffle) return null;

  /**
   * 🔥 CONVERSIÓN CLAVE
   * rawTicket ≠ Ticket (frontend)
   * aquí se construye el Ticket correcto
   */
  const ticketForModal: Ticket = {
    id_ticket: rawTicket.id_ticket,
    ticket_number: rawTicket.ticket_number,
    status: rawTicket.status,
    raffle: raffle, // ✅ requerido por el tipo Ticket
  };

  return (
    <>
      <Card className="p-8 bg-black text-white border border-gold rounded-2xl shadow-xl hover:scale-[1.02] transition-all">
        <CardHeader>
          <h3 className="font-semibold text-xl text-gold">
            {raffle.title}
          </h3>

          <p className="text-sm text-white/60">
            Ticket #{rawTicket.ticket_number} — {rawTicket.status}
          </p>

          <p className="text-sm text-white/70">
            {raffle.description}
          </p>
        </CardHeader>

        <CardContent>
          <p className="text-white/80">
            ⏳ Expira en:{" "}
            <span className="font-bold text-gold">
              {countdown}
            </span>
          </p>

          <div className="flex mt-6 gap-4">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={canceling === reservation.id}
              onClick={() => onCancel(reservation.id)}
            >
              {canceling === reservation.id
                ? "Cancelando..."
                : "Cancelar"}
            </Button>

            {rawTicket.status === TicketStatusEnum.RESERVED
             && (
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
        tickets={[ticketForModal]}   // ✅ Ticket válido
        raffle={raffle}              // ✅ Raffle completo
        handleAction={async () => {
          await onPay(reservation, raffle);
          setOpen(false);
        }}
      />
    </>
  );
}
