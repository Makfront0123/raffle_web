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

const COLORS = ["#4F46E5", "#10B981", "#F59E0B"];

const Dashboard = () => {
  const router = useRouter();
  const { stats, lastRaffles, revenueData, raffleStatusData, loading } = useDashboardData();
  console.log(stats)

  if (loading) {
    return <p className="p-6 text-gray-500">Cargando datos del dashboard...</p>;
  }

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Ingresos recientes</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Rifas por estado</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="80%" height="100%">
              <PieChart>
                <Pie
                  data={raffleStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {raffleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <section className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Últimas Rifas</h2>
          <Button onClick={() => router.push("/rafflesAdmin")}>Crear Rifa</Button>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Creación</th>
                <th className="px-4 py-2 text-left">Finalización</th>
              </tr>
            </thead>
            <tbody>
              {lastRaffles.map((raffle, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/rafflesAdmin/${raffle.id}`)}
                >
                  <td className="px-4 py-2 font-medium text-gray-900">{raffle.title}</td>
                  <td className="px-4 py-2 capitalize">{raffle.status}</td>
                  <td className="px-4 py-2">{new Date(raffle.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    {raffle.end_date ? new Date(raffle.end_date).toLocaleDateString() : "No finalizado"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;