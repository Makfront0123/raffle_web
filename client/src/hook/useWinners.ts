import { useEffect, useMemo, useState } from "react";
import { usePrizes } from "@/hook/usePrizes";
import { useRaffles } from "@/hook/useRaffles";

export function useWinners() {
  const { winners, loading, error, setActiveRaffleId } = usePrizes();
  const { raffles } = useRaffles();

  const [filterRaffle, setFilterRaffle] = useState<number | "all">("all");

  useEffect(() => {
    if (filterRaffle === "all") {
      setActiveRaffleId(null);
    } else {
      setActiveRaffleId(filterRaffle);
    }
  }, [filterRaffle, setActiveRaffleId]);

  return {
    winners,
    loading,
    error,
    raffles,
    filterRaffle,
    setFilterRaffle,
  };
}
