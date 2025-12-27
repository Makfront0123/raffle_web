"use client";
import { AuthStore } from "@/store/authStore";
import { useRaffleStore } from "@/store/raffleStore";
import { Raffle, UpdateRafflePayload } from "@/type/Raffle";
import { useEffect, useState, useCallback } from "react";

export function useRaffles() {
  const { raffles, getRaffles, addRaffle, deleteRaffle, regenerateTickets, activateRaffle, updateRaffle, deactivateRaffle } = useRaffleStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = AuthStore();

  const refreshRaffles = useCallback(async () => {

    setLoading(true);
    try {
      await getRaffles();
    } catch {
      setError("Error cargando rifas");
    } finally {
      setLoading(false);
    }
  }, [getRaffles]);

  useEffect(() => {
    refreshRaffles();
  }, [refreshRaffles]);

  const handleCreateRaffle = useCallback(
    async (raffle: Partial<Raffle>) => {
      if (!token) return;
      await addRaffle(raffle, token);
      await refreshRaffles();
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

        if (typeof data.price !== "undefined") {
          payload.price = data.price;
        }

        if (typeof data.end_date !== "undefined" && data.end_date !== null) {
          if (typeof data.end_date === "string" && data.end_date.length === 10) {
            const iso = new Date(data.end_date + "T23:59:59").toISOString();
            payload.endDate = iso;
          } else if (typeof data.end_date === "string") {

            payload.endDate = data.end_date;
          }
        }


        if (typeof data.title !== "undefined") payload.title = data.title;
        if (typeof data.description !== "undefined") payload.description = data.description;

        console.log("🔍 payload hacia backend:", payload);

        await updateRaffle(id, payload, token);
        await refreshRaffles();
      } catch (err) {
        console.error("Error actualizando rifa:", err);
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

  const handleregenerateTickets = useCallback(
    async (id: number, newDigits: number) => {
      if (!token) return;
      await regenerateTickets(id, newDigits, token);
      await refreshRaffles();
    },
    [regenerateTickets, token, refreshRaffles]
  );

  return {
    raffles,
    loading,
    error,
    addRaffle: handleCreateRaffle,
    deleteRaffle: handleDeleteRaffle,
    updateRaffle: handleUpdateRaffle,
    regenerateTickets: handleregenerateTickets,
    refreshRaffles,
    deactivateRaffle: handleDeactivateRaffle,
    activateRaffle: handleActivateRaffle
  };
}
