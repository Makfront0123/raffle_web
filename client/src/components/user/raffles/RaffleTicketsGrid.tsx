"use client";

interface Props {
  tickets: any[];
  getColor: (status: string) => string;
  handleSelect: (ticket: any) => void;
}

export default function RaffleTicketsGrid({ tickets, getColor, handleSelect }: Props) {
  return (
    <div className="grid md:grid-cols-10 grid-cols-5 gap-2 mb-6">
      {tickets.map((ticket) => (
        <div
          key={ticket.id_ticket}
          data-testid="ticket-item"
          className={`border rounded-md text-center p-2 text-sm cursor-pointer transition-all ${getColor(
            ticket.status
          )}`}
          onClick={() => handleSelect(ticket)}
        >
          {ticket.ticket_number}
        </div>
      ))}
    </div>
  );
}
