import { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { applyFilters } from "@/app/utils/paymentFilters";

export function usePaymentsPageLogic() {
  const [statusFilter, setStatusFilter] =
    useState<"all" | "completed" | "pending">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { payments, loading, completePayment, getPayments } =
    usePaymentStore();

  const { user } = AuthStore();

  useEffect(() => {
    if (user) getPayments();
  }, [user, getPayments]);

  const filteredPayments = applyFilters({
    payments,
    status: statusFilter,
    from: dateFrom,
    to: dateTo,
  });

  return {
    loading,
    completePayment,
    filteredPayments,
    currentPage,
    setCurrentPage,
    statusFilter,
    setStatusFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo
  };
}
