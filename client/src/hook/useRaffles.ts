"use client";
import { AuthStore } from "@/store/authStore";
import { useRaffleStore } from "@/store/raffleStore";
import { useEffect, useState, useCallback } from "react";

export function useRaffles() {
  const { raffles, getRaffles, addRaffle, deleteRaffle, regenerateTickets, activateRaffle, updateRaffle } = useRaffleStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = AuthStore();

  const refreshRaffles = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      await getRaffles(token);
    } catch {
      setError("Error cargando rifas");
    } finally {
      setLoading(false);
    }
  }, [getRaffles, token]);

  useEffect(() => {
    refreshRaffles();
  }, [refreshRaffles]);

  const handleDeleteRaffle = useCallback(
    async (id: number) => {
      if (!token) return;
      await deleteRaffle(id, token);
      await refreshRaffles();
    },
    [deleteRaffle, token, refreshRaffles]
  );

  const handleUpdateRaffle = useCallback(
    async (id: number, data: any) => {
      if (!token) return;
      await updateRaffle(id, data, token);
      await refreshRaffles();
    },
    [updateRaffle, token, refreshRaffles]
  );

  return {
    raffles,
    loading,
    error,
    addRaffle,
    deleteRaffle: handleDeleteRaffle,
    updateRaffle: handleUpdateRaffle,
    regenerateTickets,
    activateRaffle,
    refreshRaffles,
  };
}
