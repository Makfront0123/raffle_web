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

  // Cargar premios y ganadores al inicio
  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        if (!token) return;
        setLoading(true);
        await getPrizes(token);
        await getWinners("all", token); // ✅ Type correcto

      } catch (err) {
        console.error(err);
        setError("Error cargando premios");
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, [getPrizes, getWinners, token]);

  // Filtrar ganadores cuando cambie filterRaffle o winners
  useEffect(() => {
    if (filterRaffle === "all") {
      setFilteredWinners(winners);
    } else {
      setFilteredWinners(winners.filter(w => w.raffle_id === filterRaffle));
    }
  }, [filterRaffle, winners]);

  const fetchWinnersByRaffle = async (raffleId: number | "all") => {
    try {
      if (!token) return;
      setLoading(true);
      await getWinners(raffleId, token); // "all" o número
      setFilterRaffle(raffleId);
    } catch (err) {
      console.error(err);
      setError("Error cargando ganadores");
    } finally {
      setLoading(false);
    }
  };


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
    fetchWinnersByRaffle,
    createPrize,
    editPrize,
  };
}
