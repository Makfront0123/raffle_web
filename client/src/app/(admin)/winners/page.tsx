"use client";

import React, { useState } from "react";
 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Winner {
  raffle: string;
  user: string;
  prize: string;
  ticket_number: string;
  date: string;
}

const WinnersPage = () => {
  // Datos de ejemplo
  const [winners, setWinners] = useState<Winner[]>([
    { raffle: "Rifa Navidad", user: "Juan Pérez", prize: "TV 50 pulgadas", ticket_number: "A123", date: "2025-10-10" },
    { raffle: "Rifa Año Nuevo", user: "María López", prize: "Laptop", ticket_number: "B456", date: "2025-10-12" },
  ]);

  const raffles = ["Todas las rifas", "Rifa Navidad", "Rifa Año Nuevo"];
  const [filterRaffle, setFilterRaffle] = useState("Todas las rifas");

  const filteredWinners = filterRaffle === "Todas las rifas" ? winners : winners.filter(w => w.raffle === filterRaffle);

  return (
 
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Ganadores</h1>

        {/* Filtro por rifa */}
        <div className="mb-4 w-64">
          <Label>Filtrar por Rifa</Label>
          <Select value={filterRaffle} onValueChange={setFilterRaffle}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una rifa" />
            </SelectTrigger>
            <SelectContent>
              {raffles.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista de ganadores */}
        <Card>
          <CardHeader>
            <CardTitle>Ganadores Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredWinners.length === 0 ? (
              <p>No hay ganadores registrados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Rifa</th>
                      <th className="px-4 py-2 text-left">Usuario</th>
                      <th className="px-4 py-2 text-left">Premio</th>
                      <th className="px-4 py-2 text-left">Ticket</th>
                      <th className="px-4 py-2 text-left">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWinners.map((w, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{w.raffle}</td>
                        <td className="px-4 py-2">{w.user}</td>
                        <td className="px-4 py-2">{w.prize}</td>
                        <td className="px-4 py-2">{w.ticket_number}</td>
                        <td className="px-4 py-2">{w.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
 
  );
};

export default WinnersPage;
