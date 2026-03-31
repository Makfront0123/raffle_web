"use client";

import { TicketStatusEnum } from "@/type/Payment";
import { Ticket } from "@/type/Ticket";

interface Props {
  tickets: Ticket[];
  selectedTickets: Ticket[];
  getColor: (status: TicketStatusEnum) => string;
  handleSelect: (ticket: Ticket) => void;
}
export default function RaffleTicketsGrid({
  tickets,
  getColor,
  handleSelect,
  selectedTickets
}: Props) {
  return (
    <div className="grid md:grid-cols-10 grid-cols-5 gap-2 mb-6">
      {tickets.map((ticket) => {
        const isSelected = selectedTickets.some(
          t => t.id_ticket === ticket.id_ticket
        );

        const isDisabled = ticket.status !== "available";

        return (
          <div
            key={ticket.id_ticket}
            data-testid="ticket-item"
            className={`
              border rounded-md text-center p-2 text-sm transition-all
              ${getColor(ticket.status)}
              ${isSelected ? "ring-2 ring-gold scale-105" : ""}
              ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
            `}
            onClick={() => {
              if (isDisabled) return;
              handleSelect(ticket);
            }}
          >
            {ticket.ticket_number}
          </div>
        );
      })}
    </div>
  );
}