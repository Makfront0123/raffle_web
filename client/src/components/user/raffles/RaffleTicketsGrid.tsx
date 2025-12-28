"use client";

import { Ticket } from "@/type/Ticket";

interface Props {
  tickets: Ticket[];
  selectedTickets: Ticket[];
  getColor: (status: string) => string;
  handleSelect: (ticket: Ticket) => void;
}

export default function RaffleTicketsGrid({ tickets, getColor, handleSelect, selectedTickets }: Props) {
  return (
    <div className="grid md:grid-cols-10 grid-cols-5 gap-2 mb-6">
      {tickets.map((ticket) => {
        const isSelected = selectedTickets.some(
          t => t.id_ticket === ticket.id_ticket
        );

        return (
          <div
            key={ticket.id_ticket}
            data-testid="ticket-item"
            className={`
        border rounded-md text-center p-2 text-sm cursor-pointer transition-all
        ${getColor(ticket.status)}
        ${isSelected ? "ring-2 ring-gold scale-105" : ""}
      `}
            onClick={() => handleSelect(ticket)}
          >
            {ticket.ticket_number}
          </div>
        );
      })}

    </div>
  );
}
