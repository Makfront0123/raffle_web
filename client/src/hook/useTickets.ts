import { useEffect, useState } from "react";
import { AuthStore } from "@/store/authStore";
import { useTicketStore } from "@/store/ticketStore";
import { usePaymentStore } from "@/store/paymentStore";
import { Payment } from "@/type/Payment";

export function usePayments() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = AuthStore();
  const { setTickets } = useTicketStore();
  const { getPaymentsUser } = usePaymentStore();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const payments: Payment[] = await getPaymentsUser(token ?? "");
      console.log("Payments obtenidos:", payments);
 
      setTickets(payments as any);
    } catch (err) {
      setError("Error cargando pagos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);

  return { payments: useTicketStore().tickets, loading, error, fetchPayments };
}
