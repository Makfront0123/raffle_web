import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

export function useReservation() {
  const reservations = useReservationStore((state) => state.reservations);
  const getAllReservationsByUser = useReservationStore((state) => state.getAllReservationsByUser);
  const token = AuthStore((state) => state.token);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await getAllReservationsByUser(token);
      setError(null);
    } catch (err) {
      setError("Error cargando reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [token, getAllReservationsByUser]);

  return { reservations, loading, error, fetchReservations };
}
