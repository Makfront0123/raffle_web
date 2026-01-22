import { useEffect, useMemo, useState } from "react";
import { usePrizes } from "@/hook/usePrizes";

export function useHomeWinners(itemsPerPage = 2) {
  const { winners, loading } = usePrizes();

  const [raffleId, setRaffleId] = useState<number | "all">("all");
  const [page, setPage] = useState(1);

  const raffles = useMemo(() => {
    const map = new Map<number, string>();
    winners.forEach(w => {
      map.set(w.raffle_id, w.raffle_title);
    });
    return Array.from(map.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [winners]);
  const filteredWinners = useMemo(() => {
    return raffleId === "all"
      ? winners
      : winners.filter(w => w.raffle_id === raffleId);
  }, [winners, raffleId]);

  useEffect(() => {
    setPage(1);
  }, [raffleId]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredWinners.length / itemsPerPage)
  );

  const paginatedWinners = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredWinners.slice(start, start + itemsPerPage);
  }, [filteredWinners, page, itemsPerPage]);

  return {
    loading,
    raffles,
    winners: paginatedWinners,
    raffleId,
    setRaffleId,
    page,
    setPage,
    totalPages,
  };
}
