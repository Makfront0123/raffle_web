"use client";

import { filterTickets } from "@/app/utils/filterTickets";
import { paginate } from "@/app/utils/paginate";
import MyTicketsView from "@/components/user/tickets/MyTicketsView";
import { useTickets } from "@/hook/useTickets";
import { useState } from "react";



export default function MyTickets() {
  const { tickets, loading } = useTickets();

  const [search, setSearch] = useState("");
  const [filterRaffle, setFilterRaffle] = useState<"all" | number>("all");
  const [page, setPage] = useState(1);

  if (loading) return <div>Cargando tickets...</div>;

  const uniqueRaffles = Array.from(
    new Map(tickets.map((t) => [t.raffle.id, t.raffle])).values()
  );

  const filtered = filterTickets(tickets, search, filterRaffle);
  const { totalPages, currentItems } = paginate(filtered, page, 10);

  return (
    <MyTicketsView
      search={search}
      filterRaffle={filterRaffle}
      page={page}
      totalPages={totalPages}
      currentTickets={currentItems}
      uniqueRaffles={uniqueRaffles}
      onSearch={(v) => {
        setSearch(v);
        setPage(1);
      }}
      onFilter={(v) => {
        setFilterRaffle(v);
        setPage(1);
      }}
      onPageChange={(p) => setPage(p)}
    />
  );
}
