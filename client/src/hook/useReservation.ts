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

  // 👇 Devolvemos fetchReservations también
  return { reservations, loading, error, fetchReservations };
}


/**+
 * import { useEffect, useState } from "react";
import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";
import { Reservation } from "@/type/Reservation";
export function useReservation() {
  const { reservations, setReservations, getAllReservationsByUser } = useReservationStore();
  const token = AuthStore((state) => state.token); // suscripción correcta

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook optimizado
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        await getAllReservationsByUser(token); // esto llena el store
        if (!isMounted) return;
      } catch (err) {
        if (!isMounted) return;
        setError("Error cargando reservas");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [token, getAllReservationsByUser]);


  return { reservations, loading, error };
}

 * 
 */