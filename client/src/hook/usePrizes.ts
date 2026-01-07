"use client";

import { usePrizeStore } from "@/store/prizeStore";
import { useEffect, useState } from "react";
import { PrizeForm, Prizes } from "@/type/Prizes";

export function usePrizes() {
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
      );
      await getPrizes();
    } catch {
      setError("Error creando premio");
    }
  };

  const editPrize = async (id: number, updatedPrize: Partial<Prizes>) => {
    try {
      await updatePrize(id, updatedPrize as Prizes);
      await getPrizes();
    } catch {
      setError("Error actualizando premio");
    }
  };

  const removePrize = async (id: number) => {
    try {
      await deletePrize(id);
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
