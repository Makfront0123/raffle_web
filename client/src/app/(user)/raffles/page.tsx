"use client";

import { RaffleCard } from "@/components/RaffleCard";
import LoadingScreen from "@/components/LoadingScreen";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePrizes } from "@/hook/usePrizes";
import RaffleExpiredModal from "@/components/user/raffles/RaffleExpiredModal";
import { useState, useEffect } from "react";
import RaffleFilters from "@/components/user/raffles/RafflesFilters";
import RafflePagination from "@/components/user/raffles/RafflesPagination";
export default function Raffles() {
  const {
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
  } = useFilteredRaffles();

  const { winners, loading: loadingWinners, setActiveRaffleId } = usePrizes();

  const [currentPage, setCurrentPage] = useState(1);
  const rafflesPerPage = 6;

  const totalPages = Math.ceil(filteredRaffles.length / rafflesPerPage);
  const paginatedRaffles = filteredRaffles.slice(
    (currentPage - 1) * rafflesPerPage,
    currentPage * rafflesPerPage
  );

  useEffect(() => {
    if (showExpiredModal?.id) setActiveRaffleId(showExpiredModal.id);
  }, [showExpiredModal]);

  return (
    <div className="w-full min-h-[120vh] px-10 py-10 flex flex-col md:items-start items-center">
      {loading && <LoadingScreen />}
      {error && <div className="text-red-500">{error}</div>}

      <h1 className="text-3xl font-bold mb-8 text-black">
        🎟️ Explora nuestras rifas
      </h1>

      <RaffleFilters
        search={search}
        setSearch={setSearch}
        filterPrize={filterPrize}
        setFilterPrize={setFilterPrize}
        sortBy={sortBy}
        setSortBy={setSortBy}
        tab={tab}
        setTab={setTab}
      />

      <RafflePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <div className="flex flex-wrap gap-10 mt-10">
        {paginatedRaffles.length === 0 ? (
          <p>No se encontraron rifas 😢</p>
        ) : (
          paginatedRaffles.map((raffle) => (
            <RaffleCard
              key={raffle.id}
              raffle={raffle}
              setShowExpiredModal={setShowExpiredModal}
            />
          ))
        )}
      </div>

      <RaffleExpiredModal
        showExpiredModal={showExpiredModal}
        setShowExpiredModal={setShowExpiredModal}
        winners={winners}
        loadingWinners={loadingWinners}
      />
    </div>
  );
}
