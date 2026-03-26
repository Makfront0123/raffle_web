import { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { applyFilters } from "@/app/utils/paymentFilters";
import { toast } from "sonner";

export function usePaymentsPageLogic() {
  const [statusFilter, setStatusFilter] =
    useState<"all" | "completed" | "pending" | "expired">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { payments, loading, completePayment, getPayments, verifyPaymentManually } =
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

  const handleVerifyPayment = async (reference: string) => {
    try {
      const updatedPayment = await verifyPaymentManually(reference);
      if (updatedPayment.status === "completed") {
        toast.success("Pago verificado correctamente");
      } else if (updatedPayment.status === "expired") {
        toast.error("El pago ha expirado");
      } else {
        toast("Pago actualizado");
      }
    } catch (err) {
      toast.error("Error verificando el pago");
    }
  };


  return {
    loading,
    completePayment,
    verifyPaymentManually: handleVerifyPayment,
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
