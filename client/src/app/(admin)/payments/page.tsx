"use client";

import PaymentsFilters from "@/components/admin/payments/PaymentFilters";
import PaymentsPagination from "@/components/admin/payments/PaymentPagination";
import PaymentsTable from "@/components/admin/payments/PaymentTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useExportPaymentsToExcel } from "@/hook/useExportPaymentsToExcel";
import { usePaymentsPageLogic } from "@/hook/usePaymentPageLogic";
import { toast } from "sonner";

export default function PaymentsPage() {
  const {
    verifyPaymentManually,
    currentPage,
    setCurrentPage,
    filteredPayments,
    statusFilter,
    setStatusFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
  } = usePaymentsPageLogic();

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPayments = filteredPayments.slice(start, start + ITEMS_PER_PAGE);
  const { exportPayments } = useExportPaymentsToExcel();

  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Pagos</h1>

      <PaymentsFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pagos Recientes</CardTitle>
            <Button
              variant="outline" className="max-w-[25vh] flex items-start justify-start"
              onClick={() => exportPayments(filteredPayments)}
            >
              Exportar a Excel
            </Button>
          </div>

        </CardHeader>

        <CardContent>
          <PaymentsTable
            payments={paginatedPayments}
            onVerify={verifyPaymentManually}
          />

          <PaymentsPagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </CardContent>
      </Card>
    </main>
  );
}
