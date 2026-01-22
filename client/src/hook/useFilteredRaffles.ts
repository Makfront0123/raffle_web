import { useState, useMemo, useEffect } from "react";
import { useRaffles } from "@/hook/useRaffles";
import { usePrizes } from "@/hook/usePrizes";
import { Raffle } from "@/type/Raffle";

export function useFilteredRaffles() {
  const [expiredModal, setExpiredModal] = useState<{
    open: boolean;
    raffle: Raffle | null;
  }>({
    open: false,
    raffle: null,
  });

  const { raffles, loading, error } = useRaffles();

  const { winners, setActiveRaffleId, loading: loadingWinner } = usePrizes();

  const [search, setSearch] = useState("");
  const [filterPrize, setFilterPrize] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [tab, setTab] = useState<"active" | "ended" | "all">("active");
  const [showExpiredModal, setShowExpiredModal] = useState<Raffle | null>(null);

  const filteredRaffles = useMemo(() => {
    return raffles?.filter(r => {
      const status = r.status?.toLowerCase().trim();
      if (status === "pending") return false;

      const matchesSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());

      const matchesPrize =
        filterPrize === "all" || r.prizes?.some(p => p.type === filterPrize);

      const isEnded = status === "ended";

      if (tab === "active" && isEnded) return false;
      if (tab === "ended" && !isEnded) return false;

      return matchesSearch && matchesPrize;
    }).sort((a, b) => {
      if (sortBy === "price") return Number(b.price) - Number(a.price);
      if (sortBy === "endingSoon") return new Date(a.end_date ?? Infinity).getTime() - new Date(b.end_date ?? Infinity).getTime();
      if (sortBy === "recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });
  }, [raffles, search, filterPrize, sortBy, tab]);

  useEffect(() => {
    if (showExpiredModal?.id) setActiveRaffleId(showExpiredModal.id);
  }, [showExpiredModal, setActiveRaffleId]);

  return {
    filteredRaffles,
    loading,
    error,
    search,
    setSearch,
    filterPrize,
    setFilterPrize,
    sortBy,
    setSortBy,
    tab,
    setTab,
    showExpiredModal,
    setShowExpiredModal,
    winners,
    loadingWinner,
    expiredModal,
    setExpiredModal,
  };
}