import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { AuthStore } from "@/store/authStore";
import { useTicketStore } from "@/store/ticketStore";
import { useRaffleDetail } from "./useRaffleDetail";

export function useTickets() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = AuthStore();
  const { tickets, getTickets } = useTicketStore();
   


  // 🔹 función fetchTickets que se puede usar dentro y fuera del useEffect
  const fetchTickets = async () => {

    try {
      setLoading(true);
      await getTickets(token ?? "");
    } catch (err) {
      setError("Error cargando tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  return { tickets, loading, error, fetchTickets };
}
