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
      ?.filter((r) => {
        if (r.status === "pending") return false;


        const matchesSearch =
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase());


        const matchesPrize =
          filterPrize === "all" ||
          r.prizes?.some((p) => p.type === filterPrize);


        const isEnded = r.status === "ended";

        if (tab === "active" && isEnded) return false;
        if (tab === "ended" && !isEnded) return false;

        return matchesSearch && matchesPrize;
      })
      .sort((a, b) => {
        if (sortBy === "price") return Number(b.price) - Number(a.price);
        if (sortBy === "endingSoon")
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
        if (sortBy === "recent")
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
