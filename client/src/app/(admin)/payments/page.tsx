"use client";

import PaymentsFilters from "@/components/admin/payments/PaymentFilters";
import PaymentsPagination from "@/components/admin/payments/PaymentPagination";
import PaymentsTable from "@/components/admin/payments/PaymentTable";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePaymentsPageLogic } from "@/hook/usePaymentPageLogic";
import { toast } from "sonner";

export default function PaymentsPage() {
  const {
    loading,
    completePayment,
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

  const handleComplete = async (id: number) => {
    try {
      await completePayment(id);
      toast.success("Pago completado");
    } catch {
      toast.error("Error al completar el pago");
    }
  };

  if (loading) return <LoadingScreen />;

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

      <Card>
        <CardHeader>
          <CardTitle>Pagos Recientes</CardTitle>
        </CardHeader>

        <CardContent>
          <PaymentsTable
            payments={paginatedPayments}
            onComplete={handleComplete}
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
