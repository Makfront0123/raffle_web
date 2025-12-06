"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  ticket: any;
  raffle: any;
  handleAction: (type: "nequi" | "daviplata" | "reserve") => void;
}

export default function RaffleTicketModal({ open, setOpen, ticket, raffle, handleAction }: Props) {
  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ticket #{ticket.ticket_number}</DialogTitle>
          <p className="text-sm text-gray-500">Precio: ${raffle.price}</p>
        </DialogHeader>

        <DialogDescription>Selecciona cuántos números deseas comprar</DialogDescription>


        <div className="flex flex-col gap-2 mt-4">
          <Button onClick={() => handleAction("nequi")} className="bg-pink-500 hover:bg-pink-600 text-white">
            Pagar con Nequi
          </Button>
          <Button onClick={() => handleAction("daviplata")} className="bg-purple-500 hover:bg-purple-600 text-white">
            Pagar con Daviplata
          </Button>
          <Button onClick={() => handleAction("reserve")} variant="outline">
            Reservar Ticket
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
