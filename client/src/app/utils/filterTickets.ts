import { Ticket } from "@/type/Ticket";

export function filterTickets(
  tickets: Ticket[],
  search: string,
  filterRaffle: "all" | number,
  onlyCompleted: boolean = false
) {
  return tickets.filter(ticket => {
    if (!ticket.raffle) return false;

    const matchesRaffle =
      filterRaffle === "all" || ticket.raffle.id === filterRaffle;

    const matchesSearch = ticket.raffle.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = onlyCompleted ? ticket.status === "completed" : true;

    return matchesRaffle && matchesSearch && matchesStatus;
  });
}
