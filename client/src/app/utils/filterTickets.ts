import { Ticket } from "@/type/Ticket";

export function filterTickets(
  tickets: Ticket[],
  search: string,
  filterRaffle: "all" | number
) {
  return tickets.filter((ticket) => {
    const matchesRaffle =
      filterRaffle === "all" || ticket.raffle.id === filterRaffle;

    const matchesSearch = ticket.raffle.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesRaffle && matchesSearch;
  });
}
