"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { AuthStore } from "@/store/authStore";
import { useRaffles } from "@/hook/useRaffles";

import { RaffleForm } from "@/type/Raffle";
import { EditRaffleDialog } from "@/components/EditRaffleDialog";
import RegenerateTicketsButton from "@/components/RegenerateTicketsButton";
import { DeleteRaffleDialog } from "@/components/DeleteRaffleDialog";

const RafflesAdmin = () => {
  const { raffles, addRaffle, loading, error, deleteRaffle, regenerateTickets, activateRaffle, updateRaffle } = useRaffles();
  const { token } = AuthStore();

  const [form, setForm] = useState<Omit<RaffleForm, "id">>({
    title: "",
    description: "",
    price: "8",
    end_date: "",
    digits: 3,
    status: "active",
    tickets: [],
    prizes: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? value.toString() : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const selectedDate = new Date(form.end_date);
    const minAllowedDate = new Date();
    minAllowedDate.setDate(minAllowedDate.getDate() + 7);

    if (!form.end_date) return alert("Debes seleccionar una fecha de finalización.");
    if (selectedDate < minAllowedDate) return alert("La fecha de la rifa debe ser al menos dentro de 7 días.");

    try {
      await addRaffle(
        {
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          endDate: new Date(form.end_date + "T23:59:59").toISOString(),
          digits: form.digits,
          type: "default",
        } as any,
        token
      );
      setForm({ title: "", description: "", price: "8", end_date: "", digits: 3, status: "active", tickets: [], prizes: [] });
    } catch (err) {
      console.error("Error creando rifa:", err);
    }
  };

  // 📄 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const rafflesPerPage = 5;

  const indexOfLast = currentPage * rafflesPerPage;
  const indexOfFirst = indexOfLast - rafflesPerPage;
  const currentRaffles = raffles.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(raffles.length / rafflesPerPage);

  const today = new Date();
  const minRaffleDate = new Date();
  minRaffleDate.setDate(today.getDate() + 7);

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Administrar Rifas</h1>

      {/* Formulario */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Crear Nueva Rifa</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div className="sm:col-span-2 lg:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="price">Precio</Label>
              <Input type="number" step="0.01" id="price" name="price" value={form.price} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="digits">Cantidad de Dígitos</Label>
              <Input type="number" id="digits" name="digits" value={form.digits} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="end_date">Fecha de Finalización</Label>
              <Input
                type="date"
                id="end_date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                required
                min={minRaffleDate.toISOString().split("T")[0]}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <Button type="submit" className="w-full sm:w-auto">
                Crear Rifa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de rifas */}
      <Card>
        <CardHeader>
          <CardTitle>Rifas Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Cargando rifas...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {raffles.length === 0 ? (
            <p>No hay rifas creadas.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm sm:text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 sm:px-4 py-2 text-left">Título</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Total Números</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Precio</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Dígitos</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Estado</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Fecha Fin</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRaffles.map((r, idx) => {
                      const isEnded = r.status === "ended";
                      return (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="px-3 sm:px-4 py-2">{r.title}</td>
                          <td className="px-3 sm:px-4 py-2">{r.total_numbers}</td>
                          <td className="px-3 sm:px-4 py-2">{r.price}</td>
                          <td className="px-3 sm:px-4 py-2">{r.digits}</td>
                          <td className="px-3 sm:px-4 py-2">{r.status}</td>
                          <td className="px-3 sm:px-4 py-2">{new Date(r.end_date).toLocaleDateString()}</td>
                          <td className="px-3 sm:px-4 py-2 flex flex-wrap gap-2">
                            <DeleteRaffleDialog
                              raffle={r}
                              onConfirm={(raffleId) => deleteRaffle(raffleId)}
                            />


                            {!isEnded && (
                              <>
                                <RegenerateTicketsButton raffleId={r.id} />
                                <EditRaffleDialog
                                  raffle={r}
                                  onSave={async (updatedRaffle) => {
                                    if (!token) return;
                                    try {
                                      await updateRaffle(r.id, {
                                        ...updatedRaffle,
                                        end_date: new Date(updatedRaffle.end_date ?? "").toISOString(),
                                      });
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                />
                                {r.status === "pending" && (
                                  <Button variant="secondary" size="sm" onClick={() => activateRaffle(r.id, token ?? "")}>
                                    Activar
                                  </Button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 📄 PAGINACIÓN */}
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default RafflesAdmin;
