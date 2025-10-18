"use client";

import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";


const Dashboard = () => {
  // Datos de ejemplo
  const stats = [
    { title: "Rifas activas", value: 12 },
    { title: "Pagos recibidos", value: "$1,250" },
    { title: "Premios", value: 8 },
    { title: "Ganadores", value: 3 },
  ];

  const lastRaffles = [
    { name: "Rifa Navidad", status: "Activa", date: "2025-10-15" },
    { name: "Rifa Año Nuevo", status: "Finalizada", date: "2025-01-01" },
    { name: "Rifa Cumpleaños", status: "Activa", date: "2025-10-20" },
  ];

  return (


    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white">
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Últimas rifas */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Últimas Rifas</h2>
          <Button>Create Prize</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {lastRaffles.map((raffle, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{raffle.name}</td>
                  <td className="px-4 py-2">{raffle.status}</td>
                  <td className="px-4 py-2">{raffle.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>

  );
};

export default Dashboard;
