"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Payment } from "@/type/Payment";
import { usePayment } from "@/hook/usePayment";
import { AuthStore } from "@/store/authStore";

const ITEMS_PER_PAGE = 5;

export default function PaymentsPage() {
  const { payments, loading, completePayment } = usePayment();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const { token } = AuthStore();

  // ✅ Filtrar pagos
  const filteredPayments = useMemo(() => {
    return payments.filter((p: Payment) => {
      // Filtro por estado
      const statusMatch =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
          ? p.status === "completed"
          : p.status !== "completed";

      // Filtro por fecha
      const paymentDate = new Date(p.created_at);
      const fromValid = dateFrom ? paymentDate >= new Date(dateFrom) : true;
      const toValid = dateTo ? paymentDate <= new Date(dateTo) : true;

      return statusMatch && fromValid && toValid;
    });
  }, [payments, statusFilter, dateFrom, dateTo]);

  // 🧮 Paginación
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredPayments.slice(start, end);
  }, [filteredPayments, currentPage]);

  // ✅ Completar pago
  const handleComplete = async (id: number) => {
    try {
      await completePayment(id, token ?? "");
      toast.success("✅ Pago marcado como completado");
    } catch {
      toast.error("❌ Error al completar el pago");
    }
  };

  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Pagos</h1>

      {/* 🧭 Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <Select
            value={statusFilter}
            onValueChange={(v: "all" | "completed" | "pending") => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Pagados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Desde</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hasta</label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Cargando pagos...</p>
          ) : filteredPayments.length === 0 ? (
            <p>No hay pagos que coincidan con los filtros.</p>
          ) : (
            <>
              {/* 🧾 Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Rifa</th>
                      <th className="px-4 py-2 text-left">Usuario</th>
                      <th className="px-4 py-2 text-left">Monto</th>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">Fecha</th>
                      <th className="px-4 py-2 text-left">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map((p: Payment) => (
                      <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                        <td className="px-4 py-2">{p.raffle.title}</td>
                        <td className="px-4 py-2">{p.user.name}</td>
                        <td className="px-4 py-2">${p.total_amount}</td>
                        <td
                          className={`px-4 py-2 font-semibold ${
                            p.status === "completed" ? "text-green-600" : "text-orange-500"
                          }`}
                        >
                          {p.status === "completed" ? "Pagado" : "Pendiente"}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {p.status !== "completed" && (
                            <Button size="sm" onClick={() => handleComplete(p.id)}>
                              Marcar como Pagado
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 📄 Paginador */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                          }
                          className={
                            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
