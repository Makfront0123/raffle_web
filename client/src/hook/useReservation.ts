import { useEffect, useState } from "react";
import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";
import { Reservation } from "@/type/Reservation";
export function useReservation() {
  const { reservations, setReservations, getAllReservationsByUser } = useReservationStore();
  const token = AuthStore((state) => state.token); // suscripción correcta

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return; // solo ejecuta cuando token existe

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        await getAllReservationsByUser(token);

        if (!isMounted) return;

        const now = Date.now();
        setReservations((prev) => prev.filter((r) => new Date(r.expires_at).getTime() > now));
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError("Error cargando reservas");
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      const now = Date.now();
      setReservations((prev) => prev.filter((r) => new Date(r.expires_at).getTime() > now));
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token, setReservations]); // el efecto se disparará cuando token cambie

  return { reservations, loading, error };
}
