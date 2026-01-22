"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/type/Ticket";
import { Raffle } from "@/type/Raffle";
import { TicketStatusEnum } from "@/type/Payment";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  tickets: Ticket[];
  raffle: Raffle;
  handleAction: (type: "pay" | "reserved") => void;
}


export default function RaffleTicketModal({ open, setOpen, tickets, raffle, handleAction }: Props) {
  if (!tickets || tickets.length === 0) return null;

  const totalAmount = raffle.price * tickets.length;
  const canReserve = tickets.every(t => t.status === TicketStatusEnum.AVAILABLE);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#0B0B0B] border border-gold/40 text-white">
        <DialogHeader>
          <DialogTitle className="text-gold text-xl">
            {tickets.length === 1
              ? `Ticket #${tickets[0].ticket_number}`
              : `${tickets.length} tickets seleccionados`}
          </DialogTitle>
          <DialogDescription className="text-white/60 mt-2">
            Total a pagar: ${totalAmount.toLocaleString()}
          </DialogDescription>


        </DialogHeader>

        <p className="text-white/80 text-sm mt-2">
          Selecciona tu método de pago:
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => handleAction("pay")}
            className="text-white font-bold  "
          >
            Pagar {tickets.length > 1 && `(${tickets.length})`}
          </Button>

          {canReserve && (
            <Button
              onClick={() => handleAction("reserved")}
              variant="outline"
              className="border-gold text-yellow-500"
            >
              Reservar tickets
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