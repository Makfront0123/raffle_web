"use client";

import { usePrizeStore } from "@/store/prizeStore";
import { AuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { PrizeForm, Prizes } from "@/type/Prizes";

export function usePrizes() {
  const { token } = AuthStore();

  const {
    prizes = [],
    winners = [],
    getPrizes,
    getWinners,
    getWinnersByRaffle,
    addPrize,
    updatePrize,
    deletePrize,
  } = usePrizeStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRaffleId, setActiveRaffleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrizes = async () => {
      setLoading(true);
      try {
        await getPrizes();
      } catch {
        setError("Error cargando premios");
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, [getPrizes]);

  useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true);
      try {
        if (activeRaffleId === null) {
          await getWinners();
        } else {
          await getWinnersByRaffle(activeRaffleId);
        }
      } catch {
        setError("Error cargando ganadores");
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [activeRaffleId, getWinners, getWinnersByRaffle]);

  const createPrize = async (newPrize: PrizeForm) => {
    if (!token) return setError("No hay token");
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

  const editPrize = async (id: number, updatedPrize: Partial<Prizes>) => {
    if (!token) return setError("No hay token");
    try {
      await updatePrize(id, updatedPrize as Prizes, token);
      await getPrizes();
    } catch {
      setError("Error actualizando premio");
    }
  };

  const removePrize = async (id: number) => {
    if (!token) return setError("No hay token");
    try {
      await deletePrize(id, token);
      await getPrizes();
    } catch {
      setError("Error eliminando premio");
    }
  };

  return {
    prizes,
    winners,
    loading,
    error,
    setActiveRaffleId,
    createPrize,
    editPrize,
    deletePrize: removePrize,
  };
}
