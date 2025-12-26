"use client";
import { Input } from "@/components/ui/input";
import { Ticket } from "@/type/Ticket";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Raffle } from "@/type/Raffle";
import { Payment } from "@/type/Payment";

interface Props {
  search: string;
  filterRaffle: "all" | number;
  page: number;
  totalPages: number;
  currentPayments: Payment[];
  uniqueRaffles: any[];

  onSearch: (v: string) => void;
  onFilter: (v: "all" | number) => void;
  onPageChange: (p: number) => void;
}

export default function MyTicketsView({
  search,
  filterRaffle,
  page,
  totalPages,
  currentPayments,
  uniqueRaffles,
  onSearch,
  onFilter,
  onPageChange,
}: Props) {



  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Mis Tickets</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Buscar rifa..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full md:w-64"
        />

        <Select
          value={filterRaffle === "all" ? "all" : filterRaffle.toString()}
          onValueChange={(v) => onFilter(v === "all" ? "all" : Number(v))}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrar por rifa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las rifas</SelectItem>
            {uniqueRaffles.length > 0 &&
              uniqueRaffles.map((r: Raffle) => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  {r.title}
                </SelectItem>
              ))
            }

          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Rifa</th>
              <th className="px-4 py-2">Número</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length === 0 ? (
              <tr>
                <td colSpan={5}>No hay resultados</td>
              </tr>
            ) : (
              currentPayments.map(payment => (
                <tr key={payment.id} className="border-t align-top">
                  <td className="px-4 py-2">{payment.raffle.title}</td>

                  {/* Agrupamos los números de ticket */}
                  <td className="px-4 py-2">
                    {payment.details.map(d => d.ticket.ticket_number).join(", ")}
                  </td>

                  <td className="px-4 py-2">${payment.total_amount}</td>
                  <td className="px-4 py-2">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="capitalize">{payment.status}</td>
                </tr>
              ))
            )}
          </tbody>


        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
