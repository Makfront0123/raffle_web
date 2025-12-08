"use client";

import { usePrizeStore } from "@/store/prizeStore";
import { AuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { PrizeForm, Prizes } from "@/type/Prizes";
import { Winner } from "@/type/Winner";

export function usePrizes() {
  const { token } = AuthStore();

  const {
    prizes = [],
    winners = [],
    winner = null,
    getPrizes,
    getWinners,
    getWinner,
    addPrize,
    updatePrize,
    deletePrize,
  } = usePrizeStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRaffle, setFilterRaffle] = useState<number | "all">("all");
  const [filteredWinners, setFilteredWinners] = useState<Winner[]>([]);
  const [activeRaffleId, setActiveRaffleId] = useState<number | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getPrizes();
        await getPrizes();
        await getWinners();

      } catch (err) {
        console.error(err);
        setError("Error cargando premios o ganadores");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getPrizes, getWinners, getWinner, token]);


  useEffect(() => {
    if (filterRaffle === "all") {
      setFilteredWinners(winners);
    } else {
      setFilteredWinners(winners.filter((w) => w.raffle_id === filterRaffle));
    }
  }, [filterRaffle, winners]);

  useEffect(() => {
    if (activeRaffleId === null) return;

    const fetchWinnersForRaffle = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const id = activeRaffleId ?? "all";
        await getWinners();
        await getWinner(id);
        setFilterRaffle(id);
      } catch (err) {
        console.error(err);
        setError("Error cargando ganadores por rifa");
      } finally {
        setLoading(false);
      }
    };

    fetchWinnersForRaffle();
  }, [activeRaffleId, getWinners, getWinner, token]);



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
      await getPrizes();
    } catch {
      setError("Error creando premio");
    }
  };


  const editPrize = async (id: number, updatedPrize: Prizes) => {
    if (!token) return setError("No hay token disponible");
    try {
      await updatePrize(id, updatedPrize, token);
      await getPrizes();
    } catch {
      setError("Error actualizando premio");
    }
  };

  const handleDeletePrize = async (id: number) => {
    if (!token) return setError("No hay token disponible");
    try {
      await deletePrize(id, token);
      await getPrizes();
    } catch {
      setError("Error eliminando premio");
    }
  };

  return {

    prizes,
    winners: filteredWinners,
    winner,
    loading,
    error,
    filterRaffle,
    setFilterRaffle,
    setActiveRaffleId,
    createPrize,
    editPrize,
    deletePrize: handleDeletePrize,
  };
}
