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
        // 🔍 Buscar por título o descripción
        const matchesSearch =
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase());

        // 🏆 Filtrar por tipo de premio
        const matchesPrize =
          filterPrize === "all" ||
          r.prizes?.some((p) => p.type === filterPrize);

        // ⏳ Tab activo o finalizado
        const isExpired = new Date(r.end_date) <= new Date();
        if (tab === "active" && isExpired) return false;
        if (tab === "expired" && !isExpired) return false;

        return matchesSearch && matchesPrize;
      })
      .sort((a, b) => {
        if (sortBy === "price") {
          return Number(b.price) - Number(a.price);
        }

        if (sortBy === "endingSoon") {
          return (
            new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
          );
        }

        // 🆕 recientes primero
        if (sortBy === "recent") {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }

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
