"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/type/Ticket";
import { Raffle } from "@/type/Raffle";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  ticket: Ticket;
  raffle: Raffle;
  handleAction: (type: "pay" | "reserved") => void;
}

export default function RaffleTicketModal({ open, setOpen, ticket, raffle, handleAction }: Props) {
  if (!ticket) return null;
  const canReserve = ticket.status === "available";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#0B0B0B] border border-gold/40 text-white">
        <DialogHeader>
          <DialogTitle className="text-gold text-xl">
            Ticket #{ticket.ticket_number}
          </DialogTitle>
          <p className="text-sm text-white/60">Precio: ${raffle.price}</p>
        </DialogHeader>

        <p className="text-white/80 text-sm mt-2">
          Selecciona tu método de pago:
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => handleAction("pay")}
            className="bg-gold text-white font-bold hover:bg-gold/80"
          >
            Pagar
          </Button>

          {canReserve && (
            <Button
              onClick={() => handleAction("reserved")}
              variant="outline"
              className="border-gold text-yellow-500"
            >
              Reservar Ticket
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


/*
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/type/Ticket";
import { Raffle } from "@/type/Raffle";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  ticket: Ticket;
  raffle: Raffle;
  handleAction: (type: "pay" | "reserved") => void;
}

export default function RaffleTicketModal({ open, setOpen, ticket, raffle, handleAction }: Props) {
  if (!ticket) return null;
  const canReserve = ticket.status === "available";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#0B0B0B] border border-gold/40 text-white">
        <DialogHeader>
          <DialogTitle className="text-gold text-xl">
            Ticket #{ticket.ticket_number}
          </DialogTitle>
          <p className="text-sm text-white/60">Precio: ${raffle.price}</p>
        </DialogHeader>

        <p className="text-white/80 text-sm mt-2">
          Selecciona tu método de pago:
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => handleAction("pay")}
            className="bg-gold text-white font-bold hover:bg-gold/80"
          >
            Pagar
          </Button>

          {canReserve && (
            <Button
              onClick={() => handleAction("reserved")}
              variant="outline"
              className="border-gold text-yellow-500"
            >
              Reservar Ticket
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
*/