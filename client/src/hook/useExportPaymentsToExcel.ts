"use client";

import * as XLSX from "xlsx";
import { Payment } from "@/type/Payment";
export function useExportPaymentsToExcel() {
    const exportPayments = (payments: Payment[]) => {
        if (!payments || payments.length === 0) {
            throw new Error("No hay pagos para exportar");
        }

        const data = payments.map((p: Payment) => ({
            ID: p.id,
            Usuario: p.user?.email ?? "—",
            Rifa: p.raffle.title,
            Valor: p.total_amount,
            Estado: p.status,
            Reference: p.reference,
            Tickets: p.details?.map(d => d.ticket.ticket_number).join(", ") ?? "—",
            Fecha: new Date(p.created_at).toLocaleDateString("es-CO"),
            TransactionID: p.transaction_id ?? "—",
            Cancelado: p.cancelled_at ? new Date(p.cancelled_at).toLocaleDateString("es-CO") : "—",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");
        XLSX.writeFile(workbook, "payments.xlsx");
    };

    return { exportPayments };
}