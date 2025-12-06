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
      <Card className="p-10 bg-purple-800 text-white border border-gray-700">
        <CardHeader>
          <h3 className="font-semibold text-lg">{raffle?.title}</h3>
          <p className="text-sm text-gray-400">
            Ticket #{ticket.ticket_number} — {ticket.status}
          </p>
          <p className="text-sm text-gray-400">
            {raffle?.description}
          </p>
        </CardHeader>

        <CardContent>
          <p>
            ⏳ Expira en: <span className="font-semibold">{countdown}</span>
          </p>

          <div className="flex mt-5">
            <Button
              className="bg-red-500 hover:bg-red-600"
              disabled={canceling === reservation.id}
              onClick={() => onCancel(reservation.id)}
            >
              {canceling === reservation.id ? "Cancelando..." : "Cancelar"}
            </Button>

            {ticket.status === "reserved" && (
              <Button
                className="bg-green-500 hover:bg-green-600 ml-8"
                onClick={() => setOpen(true)}
              >
                Comprar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket #{ticket.ticket_number}</DialogTitle>
            <p className="text-sm text-gray-500">Precio: ${raffle?.price}</p>
          </DialogHeader>

          <div className="flex flex-col gap-2 mt-4">
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
