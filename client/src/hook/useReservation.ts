import { useEffect, useState } from "react";
import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";

export function useReservation() {
  const { reservations, getReservations, setReservations } = useReservationStore();
  const { token } = AuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let syncInterval: NodeJS.Timeout;
    let localInterval: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const now = new Date().getTime();
        await getReservations(token);
        useReservationStore.setState((state) => ({
          reservations: state.reservations.filter(
            (r) => new Date(r.expires_at).getTime() > now
          ),
        }));

        setLoading(false);
      } catch (err) {
        setError("Error cargando reservas");
        setLoading(false);
      }
    };

 
    fetchData();

    
    localInterval = setInterval(() => {
      const now = new Date().getTime();
      useReservationStore.setState((state) => ({
        reservations: state.reservations.filter(
          (r) => new Date(r.expires_at).getTime() > now
        ),
      }));
    }, 1000);

   
    syncInterval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(syncInterval);
      clearInterval(localInterval);
    };
  }, [token]);  

  return { reservations, loading, error };
}
