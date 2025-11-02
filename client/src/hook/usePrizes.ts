"use client";

import { usePrizeStore } from "@/store/prizeStore";
import { AuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { PrizeForm, Prizes } from "@/type/Prizes";

export function usePrizes() {
  const { prizes, winners, getPrizes, addPrize, updatePrize, getWinners } = usePrizeStore();
  const { token } = AuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRaffle, setFilterRaffle] = useState<number | "all">("all");
  const [filteredWinners, setFilteredWinners] = useState<typeof winners>([]);
  const [activeRaffleId, setActiveRaffleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (!token) return;
        setLoading(true);
        await getPrizes(token);
        await getWinners("all", token);
      } catch (err) {
        console.error(err);
        setError("Error cargando premios");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [getPrizes, getWinners, token]);

  useEffect(() => {
    if (filterRaffle === "all") {
      setFilteredWinners(winners);
    } else {
      setFilteredWinners(winners.filter(w => w.raffle_id === filterRaffle));
    }
  }, [filterRaffle, winners]);

  useEffect(() => {
    const fetchForRaffle = async () => {
      if (!token || !activeRaffleId) return;
      try {
        setLoading(true);
        await getWinners(activeRaffleId, token);
        setFilterRaffle(activeRaffleId);
      } catch (err) {
        console.error(err);
        setError("Error cargando ganadores por rifa");
      } finally {
        setLoading(false);
      }
    };
    fetchForRaffle();
  }, [activeRaffleId, getWinners, token]);

  const createPrize = async (newPrize: PrizeForm) => {
    try {
      if (!token) throw new Error("No hay token disponible");
      const payload = {
        name: newPrize.name,
        description: newPrize.description,
        value: newPrize.value,
        type: newPrize.type ?? "product",
        raffleId: Number(newPrize.raffle),
        providerId: Number(newPrize.provider),
      };
      await addPrize(payload, token);
    } catch (err) {
      console.error(err);
      setError("Error creando premio");
    }
  };

  const editPrize = async (id: number, updatedPrize: Prizes) => {
    try {
      if (!token) throw new Error("No hay token disponible");
      await updatePrize(id, updatedPrize, token);
    } catch (err) {
      console.error(err);
      setError("Error actualizando premio");
    }
  };

  return {
    prizes,
    winners: filteredWinners,
    loading,
    error,
    filterRaffle,
    setFilterRaffle,
    setActiveRaffleId,
    createPrize,
    editPrize,
  };
}
