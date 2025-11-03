"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTickets } from "@/hook/useTickets";
import { Ticket } from "@/type/Ticket";

export default function MyTickets() {
  const { tickets, loading } = useTickets();

  const [search, setSearch] = useState("");
  const [filterRaffle, setFilterRaffle] = useState<"all" | number>("all");
  const [page, setPage] = useState(1);
  const perPage = 10;  

  
  const uniqueRaffles = Array.from(
    new Map(tickets?.map(t => [t.raffle.id, t.raffle])).values()
  );
 
  const filteredTickets = tickets?.filter(ticket => {
    const matchesRaffle = filterRaffle === "all" || ticket.raffle.id === filterRaffle;
    const matchesSearch = ticket.raffle.title.toLowerCase().includes(search.toLowerCase());
    return matchesRaffle && matchesSearch;
  }) || [];

 
  const totalPages = Math.ceil(filteredTickets.length / perPage);
  const start = (page - 1) * perPage;
  const currentTickets = filteredTickets.slice(start, start + perPage);

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-gray-500 text-lg">
        Cargando tickets...
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Mis Tickets</h1>
 
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          placeholder="Buscar rifa..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} // reset page
          className="w-full md:w-64"
        />

        <Select
          onValueChange={(val) => { setFilterRaffle(val === "all" ? "all" : Number(val)); setPage(1); }}
          value={filterRaffle === "all" ? "all" : filterRaffle.toString()}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrar por rifa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las rifas</SelectItem>
            {uniqueRaffles.map(r => (
              <SelectItem key={r.id} value={r.id.toString()}>
                {r.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

 
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Rifa</th>
              <th className="px-4 py-2 text-left">Número de Ticket</th>
              <th className="px-4 py-2 text-left">Precio</th>
              <th className="px-4 py-2 text-left">Fecha de Compra</th>
              <th className="px-4 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No se encontraron tickets.
                </td>
              </tr>
            ) : (
              currentTickets.map(ticket => (
                <tr key={ticket.id_ticket} className="border-t">
                  <td className="px-4 py-2">{ticket.raffle?.title}</td>
                  <td className="px-4 py-2">{ticket.ticket_number}</td>
                  <td className="px-4 py-2">${ticket.payment?.total_amount}</td>
                  <td className="px-4 py-2">
                    {new Date(ticket.purchased_at || ticket.payment?.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 capitalize">{ticket.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

 
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
