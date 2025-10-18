"use client";

import React, { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Payment {
  raffle: string;
  user: string;
  amount: number;
  status: "Pendiente" | "Pagado";
  date: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([
    { raffle: "Rifa Navidad", user: "Juan Pérez", amount: 50, status: "Pagado", date: "2025-10-10" },
    { raffle: "Rifa Año Nuevo", user: "María López", amount: 100, status: "Pendiente", date: "2025-10-12" },
    { raffle: "Rifa Cumpleaños", user: "Carlos Gómez", amount: 75, status: "Pagado", date: "2025-10-14" },
  ]);

  const markAsPaid = (index: number) => {
    const updated = [...payments];
    updated[index].status = "Pagado";
    setPayments(updated);
  };

  return (


    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Pagos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Pagos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p>No hay pagos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200">
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
                  {payments.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{p.raffle}</td>
                      <td className="px-4 py-2">{p.user}</td>
                      <td className="px-4 py-2">${p.amount}</td>
                      <td className="px-4 py-2">{p.status}</td>
                      <td className="px-4 py-2">{p.date}</td>
                      <td className="px-4 py-2">
                        {p.status === "Pendiente" && (
                          <Button size="sm" onClick={() => markAsPaid(idx)}>
                            Marcar como Pagado
                          </Button>
                        )}
                      </td>
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

export default PaymentsPage;
