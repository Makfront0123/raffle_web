"use client";

import { AuthStore } from "@/store/authStore";
import { useRaffleStore } from "@/store/raffleStore";
import { Raffle, UpdateRafflePayload } from "@/type/Raffle";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

export function useRaffles() {
  const {
    raffles: storeRaffles,
    getRaffles,
    addRaffle,
    deleteRaffle,
    regenerateTickets,
    activateRaffle,
    updateRaffle,
    deactivateRaffle,
  } = useRaffleStore();

  const { token } = AuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRaffles = useCallback(async () => {
    setLoading(true);
    try {
      await getRaffles();
    } catch (err) {
      console.error("Error refrescando rifas:", err);
      setError("Error cargando rifas");
    } finally {
      setLoading(false);
    }
  }, [getRaffles, token]);

  useEffect(() => {
    refreshRaffles();
  }, [refreshRaffles]);

  const createRaffle = useCallback(
    async (
      form: {
        title: string;
        description?: string;
        price: number;
        end_date: string;
        digits: number;
      },
      resetForm?: () => void
    ) => {
      if (!token) return;

      try {
        if (!form.title || typeof form.price !== "number") {
          throw new Error("Campos obligatorios incompletos");
        }

        if (!form.end_date) throw new Error("Selecciona una fecha válida");
        const endDate = new Date(form.end_date);
        endDate.setUTCHours(23, 59, 59, 0);
        if (isNaN(endDate.getTime())) throw new Error("Fecha inválida");

        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 7);
        if (endDate < minDate) throw new Error("Debe ser mínimo 7 días después.");
        const tempRaffle: Raffle = {
          id: Date.now(),
          title: form.title,
          description: form.description ?? "",
          price: form.price,
          end_date: endDate.toISOString(),
          digits: form.digits,
          status: "pending",
          tickets: [],
          prizes: [],
          created_at: new Date().toISOString(),
          total_numbers: 0,
        };

        await addRaffle(tempRaffle, token);
        if (resetForm) resetForm();

        await refreshRaffles();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Error creando la rifa");
        console.error(err);
        throw err;
      }
    },
    [addRaffle, token, refreshRaffles]
  );

  const handleDeleteRaffle = useCallback(
    async (id: number) => {
      if (!token) return;
      await deleteRaffle(id, token);
      await refreshRaffles();
    },
    [deleteRaffle, token, refreshRaffles]
  );

  const handleUpdateRaffle = useCallback(
    async (id: number, data: Partial<Raffle>) => {
      if (!token) return;
      try {
        const payload: UpdateRafflePayload = {};
        if (data.price !== undefined) payload.price = data.price;
        if (data.end_date) {
          const endDate = new Date(
            data.end_date.length === 10 ? data.end_date + "T23:59:59" : data.end_date
          );
          if (!isNaN(endDate.getTime())) payload.endDate = endDate.toISOString();
        }
        if (data.title) payload.title = data.title;
        if (data.description) payload.description = data.description;

        await updateRaffle(id, payload, token);
        await refreshRaffles();
      } catch (err) {
        toast.error("No se pudo actualizar la rifa");
        console.error(err);
      }
    },
    [updateRaffle, token, refreshRaffles]
  );

  const handleActivateRaffle = useCallback(
    async (id: number) => {
      if (!token) return;
      await activateRaffle(id, token);
      await refreshRaffles();
    },
    [activateRaffle, token, refreshRaffles]
  );

  const handleDeactivateRaffle = useCallback(
    async (id: number) => {
      if (!token) return;
      await deactivateRaffle(id, token);
      await refreshRaffles();
    },
    [deactivateRaffle, token, refreshRaffles]
  );

  const handleRegenerateTickets = useCallback(
    async (id: number, newDigits: number) => {
      if (!token) return;
      await regenerateTickets(id, newDigits, token);
      await refreshRaffles();
    },
    [regenerateTickets, token, refreshRaffles]
  );

  const filteredRaffles = useMemo(() => {
    return storeRaffles
      .filter(r => r.status.toLowerCase().trim() === "active")
      .sort((a, b) => {
        const aTime = a.end_date ? new Date(a.end_date).getTime() : Infinity;
        const bTime = b.end_date ? new Date(b.end_date).getTime() : Infinity;
        return aTime - bTime;
      });
  }, [storeRaffles]);

  return {
    raffles: storeRaffles,
    filteredRaffles,
    loading,
    error,
    refreshRaffles,
    createRaffle,
    deleteRaffle: handleDeleteRaffle,
    updateRaffle: handleUpdateRaffle,
    regenerateTickets: handleRegenerateTickets,
    deactivateRaffle: handleDeactivateRaffle,
    activateRaffle: handleActivateRaffle,
  };
}