"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hook/useDashboardData";
import router from "next/router";

const Dashboard = () => {
  const { stats, lastRaffles, loading } = useDashboardData();

  if (loading) {
    return <p className="p-6 text-gray-500">Cargando datos del dashboard...</p>;
  }

  return (
    <main className="flex-1 p-4 sm:p-6 bg-gray-300 overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

   
      <section className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Últimas Rifas</h2>
          <Button onClick={() => router.push("/rafflesAdmin")}>
            Crear Rifa
          </Button>
        </div>
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full  text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left whitespace-nowrap">Nombre</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Estado</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Creación</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Finalización</th>
              </tr>
            </thead>
            <tbody>
              {lastRaffles.map((raffle, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{raffle.title}</td>
                  <td className="px-4 py-2 capitalize">{raffle.status}</td>
                  <td className="px-4 py-2">
                    {new Date(raffle.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {raffle.end_date
                      ? new Date(raffle.end_date).toLocaleDateString()
                      : "No finalizado"}
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
