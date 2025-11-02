"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ITEMS_PER_PAGE = 5; // número de premios por página

export function PrizesTable({ prizes }: { prizes: any[] }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(prizes.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const visiblePrizes = prizes.slice(start, end);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Premios Existentes</CardTitle>
      </CardHeader>
      <CardContent>
        {prizes.length === 0 ? (
          <p>No hay premios registrados.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Descripción</th>
                    <th className="px-4 py-2 text-left">Valor</th>
                    <th className="px-4 py-2 text-left">Rifa</th>
                    <th className="px-4 py-2 text-left">Proveedor</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePrizes.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.description}</td>
                      <td className="px-4 py-2">${p.value}</td>
                      <td className="px-4 py-2">{p.raffle?.title ?? "Sin rifa"}</td>
                      <td className="px-4 py-2">{p.provider?.name ?? "Sin proveedor"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginador */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <p>
                Página {page} de {totalPages}
              </p>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
