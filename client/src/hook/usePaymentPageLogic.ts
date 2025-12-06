import { useState } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { applyFilters } from "@/app/utils/paymentFilters";
 

export function usePaymentsPageLogic() {
  const [statusFilter, setStatusFilter] =
    useState<"all" | "completed" | "pending">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { payments, loading, completePayment } = usePaymentStore();

  // obtener token desde AuthStore (el correcto)
  const token = AuthStore.getState().token;

  const filteredPayments = applyFilters({
    payments,
    status: statusFilter,
    from: dateFrom,
    to: dateTo,
  });

  return {
    loading,
    completePayment,
    token,
    filteredPayments,

    // Pagination
    currentPage,
    setCurrentPage,

    // Filters
    statusFilter,
    setStatusFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
  };
}
