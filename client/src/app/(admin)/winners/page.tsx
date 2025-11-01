"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePrizes } from "@/hook/usePrizes";
import { useRaffles } from "@/hook/useRaffles";

const WinnersPage = () => {
  const { winners, loading, error, filterRaffle, fetchWinnersByRaffle } = usePrizes();
  const { raffles } = useRaffles();

  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Ganadores</h1>

      {/* Filtro por rifa */}
      <div className="mb-4 w-64">
        <Label>Filtrar por Rifa</Label>
        <Select
          value={filterRaffle.toString()}
          onValueChange={(val) => fetchWinnersByRaffle(val === "all" ? "all" : Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una rifa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las rifas</SelectItem>
            {raffles?.map((r) => (
              <SelectItem key={r.id} value={r.id.toString()}>
                {r.title}
              </SelectItem>
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
          {loading ? (
            <p>Cargando ganadores...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : winners.length === 0 ? (
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
                    <th className="px-4 py-2 text-left">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map((w, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{w.raffle_title}</td>
                      <td className="px-4 py-2">{w.winner_user}</td>
                      <td className="px-4 py-2">{w.prize_name}</td>
                      <td className="px-4 py-2">{w.winner_ticket}</td>
                      <td className="px-4 py-2">${w.value}</td>
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
