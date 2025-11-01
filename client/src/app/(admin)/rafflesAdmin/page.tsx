"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRaffles } from "@/hook/useRaffles";
import { AuthStore } from "@/store/authStore";
import { Raffle, RaffleForm } from "@/type/Raffle";
import RegenerateTicketsButton from "@/components/RegenerateTicketsButton";

const RafflesAdmin = () => {
  const { raffles, addRaffle, loading, error, deleteRaffle, regenerateTickets, activateRaffle } = useRaffles();
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

    setForm({
      ...form,
      [name]: type === "number" ? value.toString() : value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const selectedDate = new Date(form.end_date);
    const minAllowedDate = new Date();
    minAllowedDate.setDate(minAllowedDate.getDate() + 7);

    if (!form.end_date) {
      alert("Debes seleccionar una fecha de finalización.");
      return;
    }

    if (selectedDate < minAllowedDate) {
      alert("La fecha de la rifa debe ser al menos dentro de 7 días.");
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        endDate: new Date(form.end_date + "T23:59:59").toISOString(),
        digits: form.digits,
        type: "default",
      };

      await addRaffle(payload as any, token);

      setForm({
        title: "",
        description: "",
        price: "8",
        end_date: "",
        digits: 3,
        status: "active",
        tickets: [],
        prizes: [],
      });
    } catch (err) {
      console.error("Error creando rifa:", err);
    }
  };


  const today = new Date();
  const minRaffleDate = new Date();
  minRaffleDate.setDate(today.getDate() + 7); // mínimo una semana después


  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Administrar Rifas</h1>

      {/* Formulario */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Crear Nueva Rifa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
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
                min={minRaffleDate.toISOString().split("T")[0]} // 👈 bloquea fechas previas
              />
            </div>

            <Button type="submit">Crear Rifa</Button>
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
            <table className="w-full table-auto border border-gray-200  ">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Título</th>
                  <th className="px-4 py-2 text-left">Total Números</th>
                  <th className="px-4 py-2 text-left">Precio</th>
                  <th className="px-4 py-2 text-left">Dígitos</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Fecha Fin</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {raffles.map((r, idx) => {
                  const isEnded = r.status === "ended";

                  return (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{r.title}</td>
                      <td className="px-4 py-2">{r.total_numbers}</td>
                      <td className="px-4 py-2">{r.price}</td>
                      <td className="px-4 py-2">{r.digits}</td>
                      <td className="px-4 py-2">{r.status}</td>
                      <td className="px-4 py-2">{new Date(r.end_date).toLocaleDateString()}</td>

                      <td className="px-4 py-2 flex flex-wrap gap-2">
                        {/* Botón Eliminar siempre permitido */}
                        <Button
                          variant="destructive"
                          onClick={() => deleteRaffle(r.id, token ?? '')}
                        >
                          Eliminar
                        </Button>

                        {/* Solo disponible si la rifa NO está terminada */}
                        {!isEnded && (
                          <>
                            <RegenerateTicketsButton raffleId={r.id} />

                            <Button
                              variant="secondary"
                              onClick={() => {
                                // TODO: implement editRaffle(r)
                              }}
                            >
                              Editar
                            </Button>
                            {
                              r.status === "pending" && <Button
                                variant="destructive"
                                onClick={() => activateRaffle(r.id, token ?? '')}

                              >
                                Activar
                              </Button>
                            }
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default RafflesAdmin;
