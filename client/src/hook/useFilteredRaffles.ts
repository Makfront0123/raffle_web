"use client";
import { useMemo, useState } from "react";
import { useRaffles } from "@/hook/useRaffles";
import { Raffle } from "@/type/Raffle";

export function useFilteredRaffles() {
  const { raffles, loading, error } = useRaffles();

  const [search, setSearch] = useState("");
  const [filterPrize, setFilterPrize] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [tab, setTab] = useState("active");
  const [showExpiredModal, setShowExpiredModal] = useState<Raffle | null>(null);

 
  const filteredRaffles = useMemo(() => {
    return raffles
      .filter((r) => {
        const matchesSearch =
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase());

        const hasPrizeType =
          filterPrize === "all" ||
          r.prizes?.some((p) => p.name.toLowerCase().includes(filterPrize));

        const isExpired = new Date(r.end_date) <= new Date();

        if (tab === "active" && isExpired) return false;
        if (tab === "expired" && !isExpired) return false;

        return matchesSearch && hasPrizeType;
      })
      .sort((a, b) => {
        if (sortBy === "price") return Number(b.price) - Number(a.price);
        if (sortBy === "endingSoon")
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
        return 0;
      });
  }, [raffles, search, filterPrize, sortBy, tab]);

  return {
    raffles,
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
  };
}
