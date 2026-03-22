"use client";

import { usePrizeStore } from "@/store/prizeStore";
import { useEffect, useState } from "react";
import { PrizeForm, Prizes } from "@/type/Prizes";
import { handleApiError } from "@/helper/handleApiError";
import { toast } from "sonner";

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
      setError(null);

      try {
        await getPrizes();
      } catch (err) {
        handleApiError(err, "Error cargando premios");
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
      setError(null);

      try {
        if (activeRaffleId === null) {
          await getWinners();
        } else {
          await getWinnersByRaffle(activeRaffleId);
        }
      } catch (err) {
        handleApiError(err, "Error cargando ganadores");
        setError("Error cargando ganadores");
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [activeRaffleId, getWinners, getWinnersByRaffle]);

  const createPrize = async (newPrize: PrizeForm) => {
    try {
      const res = await addPrize({
        name: newPrize.name,
        description: newPrize.description,
        value: newPrize.value,
        type: newPrize.type ?? "product",
        raffleId: Number(newPrize.raffle),
        providerId: Number(newPrize.provider),
      });

      await getPrizes();

      toast.success(res.message || "Premio creado correctamente");

    } catch (err: unknown) {
      handleApiError(err, "Error creando premio");
      setError("Error creando premio");
    }
  };

  const editPrize = async (id: number, updatedPrize: Partial<Prizes>) => {
    try {
      const res = await updatePrize(id, updatedPrize as Prizes);

      await getPrizes();

      toast.success(res.message || "Premio actualizado");

    } catch (err: unknown) {
      handleApiError(err, "Error actualizando premio");
      setError("Error actualizando premio");
    }
  };
  const removePrize = async (id: number) => {
    try {
      const res = await deletePrize(id);

      await getPrizes();

      toast.success(res.message || "Premio eliminado");

    } catch (err: unknown) {
      handleApiError(err, "Error eliminando premio");
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
