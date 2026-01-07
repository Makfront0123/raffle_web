"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hook/useDashboardData";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { usePagination } from "@/hook/usePagination";
import { DollarSign, Ticket, Trophy, Users } from "lucide-react";

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];

const titleToKeyMap: Record<string, "raffles" | "payments" | "prizes" | "users"> = {
  "Rifas activas": "raffles",
  "Pagos recibidos": "payments",
  "Premios": "prizes",
  "Ganadores": "users",
};
const iconMap = {
  raffles: Ticket,
  payments: DollarSign,
  prizes: Trophy,
  users: Users,
};


export default function Dashboard() {
  const router = useRouter();
  const { stats, lastRaffles, revenueData, raffleStatusData, loading } =
    useDashboardData();

  const { items, page, totalPages, nextPage, prevPage } =
    usePagination(lastRaffles, 5);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Cargando dashboard…
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen p-4 sm:p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Resumen general de la plataforma
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const key = titleToKeyMap[stat.title];
          const Icon = key ? iconMap[key] : null;

          return (
            <Card
              key={stat.title}
              className="border-0 shadow-sm hover:shadow-md transition"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                  {Icon && <Icon className="h-6 w-6 text-indigo-600" />}
                </div>

                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}

      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Ingresos recientes</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {revenueData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="Sin ingresos registrados" />
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Rifas por estado</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            {raffleStatusData.length ? (
              <ResponsiveContainer width="85%" height="100%">
                <PieChart>
                  <Pie
                    data={raffleStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {raffleStatusData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="Sin datos de estado" />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Últimas Rifas
          </h2>
          <Button onClick={() => router.push("/rafflesAdmin")}>
            Crear rifa
          </Button>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Creación</th>
                <th className="px-4 py-3 text-left">Finalización</th>
              </tr>
            </thead>
            <tbody>
              {items.map((raffle) => (
                <tr
                  key={raffle.id}
                  onClick={() =>
                    router.push(`/rafflesAdmin/${raffle.id}`)
                  }
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium">
                    {raffle.title}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {raffle.status}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(raffle.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {raffle.end_date
                      ? new Date(raffle.end_date).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-500">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="text-sm text-gray-400 text-center">
      {text}
    </p>
  );
}
