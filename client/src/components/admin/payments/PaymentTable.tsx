"use client";

import { Payment, PaymentStatusEnum } from "@/type/Payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PaymentsTableProps = {
  payments: Payment[];
  onVerify: (reference: string) => void;
};

export default function PaymentsTable({ payments, onVerify }: PaymentsTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-700">ID</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Rifa</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Valor</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Usuario</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Estado</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Fecha</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Acción</th>
          </tr>
        </thead>

        <tbody>
          {payments.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                No hay pagos para mostrar.
              </td>
            </tr>
          )}

          {payments.map((p) => {
            const formattedDate = new Date(p.created_at).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{p.id}</td>
                <td className="px-6 py-4">{p.raffle.title}</td>
                <td className="px-6 py-4">${p.total_amount}</td>
                <td className="px-6 py-4">{p?.user?.name}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      p.status === PaymentStatusEnum.COMPLETED
                        ? "default"
                        : p.status === PaymentStatusEnum.EXPIRED
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {p.status === PaymentStatusEnum.COMPLETED
                      ? "Completado"
                      : p.status === PaymentStatusEnum.EXPIRED
                        ? "Expirado"
                        : "Pendiente"}
                  </Badge>
                </td>
                <td className="px-6 py-4">{formattedDate}</td>
                <td className="px-6 py-4">
                  {p.status === PaymentStatusEnum.PENDING ? (
                    <Button onClick={() => onVerify(p.reference)}>Verificar Pago</Button>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
