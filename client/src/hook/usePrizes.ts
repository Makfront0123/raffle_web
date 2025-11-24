"use client";

import { usePrizeStore } from "@/store/prizeStore";
import { AuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { PrizeForm, Prizes } from "@/type/Prizes";
import { Winner } from "@/type/Winner";

export function usePrizes() {
  const { prizes = [], winners = [], getPrizes, addPrize, updatePrize, getWinners, deletePrize } = usePrizeStore();
  const { token } = AuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRaffle, setFilterRaffle] = useState<number | "all">("all");
  const [filteredWinners, setFilteredWinners] = useState<Winner[]>([]);
  const [activeRaffleId, setActiveRaffleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        await getPrizes(token);
        await getWinners("all", token);
      } catch (err) {
        console.error(err);
        setError("Error cargando premios");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getPrizes, getWinners, token]);

  useEffect(() => {
    if (filterRaffle === "all") {
      setFilteredWinners(winners || []);
    } else {
      setFilteredWinners(winners?.filter((w) => w.raffle_id === filterRaffle) || []);
    }
  }, [filterRaffle, winners]);

  useEffect(() => {
    const fetchWinnersForRaffle = async () => {
      if (!token) return;
      setLoading(true);
      try {
        if (activeRaffleId) {
          await getWinners(activeRaffleId, token);
        } else {
          await getWinners("all", token);
        }
        setFilterRaffle(activeRaffleId ?? "all");
      } catch (err) {
        console.error(err);
        setError("Error cargando ganadores por rifa");
      } finally {
        setLoading(false);
      }
    };
    fetchWinnersForRaffle();
  }, [activeRaffleId, getWinners, token]);


  const createPrize = async (newPrize: PrizeForm) => {
    if (!token) return setError("No hay token disponible");
    try {
      await addPrize(
        {
          name: newPrize.name,
          description: newPrize.description,
          value: newPrize.value,
          type: newPrize.type ?? "product",
          raffleId: Number(newPrize.raffle),
          providerId: Number(newPrize.provider),
        },
        token
      );
      await getPrizes(token);
    } catch (err) {
      console.error(err);
      setError("Error creando premio");
    }
  };


  const editPrize = async (id: number, updatedPrize: Prizes) => {
    if (!token) return setError("No hay token disponible");
    try {
      await updatePrize(id, updatedPrize, token);
      await getPrizes(token);
    } catch (err) {
      console.error(err);
      setError("Error actualizando premio");
    }
  };

  
  const handleDeletePrize = async (id: number) => {
    if (!token) return setError("No hay token disponible");
    try {
      await deletePrize(id, token);
      await getPrizes(token);
    } catch (err) {
      console.error(err);
      setError("Error eliminando premio");
    }
  };

  return {
    prizes: prizes || [],
    winners: filteredWinners,
    loading,
    error,
    filterRaffle,
    setFilterRaffle,
    setActiveRaffleId,
    createPrize,
    editPrize,
    deletePrize: handleDeletePrize,
    updatePrize,
  };
}
