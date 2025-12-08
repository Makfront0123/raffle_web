"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCountdown } from "@/hook/useCountdown";
import { toast } from "sonner";
import { Raffle } from "@/type/Raffle";
import { Reservation } from "@/type/Reservation";

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
  onPay: (method: "nequi" | "daviplata", raffleId: number, ticketId: number) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const countdown = useCountdown(reservation.expires_at);
  const ticket = reservation.reservationTickets?.[0]?.ticket;

  useEffect(() => {
    if (countdown === "Expirada" || countdown === "00:00") {
      toast.error(`La reserva #${reservation.id} ha expirado 😔`);
    }
  }, [countdown, reservation.id]);

  if (!ticket) return null;

  return (
    <>
      <Card className="
        p-8 bg-yellow-400/40 
        text-white border border-gold 
        backdrop-blur-sm shadow-xl rounded-2xl
        transition-all hover:scale-[1.02]
      ">
        <CardHeader>
          <h3 className="font-semibold text-xl text-gold">
            {raffle?.title}
          </h3>
          <p className="text-sm text-white/60">
            Ticket #{ticket.ticket_number} — {ticket.status}
          </p>
          <p className="text-sm text-white/70">
            {raffle?.description}
          </p>
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
                className="bg-gold text-black hover:bg-gold/80"
                onClick={() => setOpen(true)}
              >
                Comprar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-purple-900/90 text-white border border-gold">
          <DialogHeader>
            <DialogTitle className="text-gold">
              Ticket #{ticket.ticket_number}
            </DialogTitle>
            <p className="text-sm text-white/70">
              Precio: ${raffle?.price}
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => onPay("nequi", raffle!.id, ticket.id_ticket)}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Nequi
            </Button>

            <Button
              onClick={() => onPay("daviplata", raffle!.id, ticket.id_ticket)}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Daviplata
            </Button>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
