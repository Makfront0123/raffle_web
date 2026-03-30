import { useEffect, useState } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { AuthStore } from "@/store/authStore";
import { applyFilters } from "@/app/utils/paymentFilters";
import { toast } from "sonner";
import { handleApiError } from "@/helper/handleApiError";
import { PaymentStatusEnum } from "@/type/Payment";

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
      const res = await verifyPaymentManually(reference);

      if (res.status === PaymentStatusEnum.COMPLETED) {
        toast.success(res.message);
      } else if (res.status === PaymentStatusEnum.CANCELLED) {
        toast.error(res.message);
      } else {
        toast(res.message);
      }
    } catch (err) {
      handleApiError(err, "Error verificando el pago");
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
