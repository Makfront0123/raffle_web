"use client";

import RaffleCard from "@/components/RaffleCard";

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

  const { winner,setActiveRaffleId,loading: loadingWinner } = usePrizes();


  const [currentPage, setCurrentPage] = useState(1);
  const rafflesPerPage = 3;

  const totalPages = Math.ceil(filteredRaffles.length / rafflesPerPage);
  const paginatedRaffles = filteredRaffles.slice(
    (currentPage - 1) * rafflesPerPage,
    currentPage * rafflesPerPage
  );

  useEffect(() => {
    if (showExpiredModal?.id) setActiveRaffleId(showExpiredModal.id);
  }, [showExpiredModal]);

  return (
    <div className="w-full min-h-screen px-6 py-16 bg-gradient-to-b from-black via-yellow-500 to-black text-white">

      {loading && <LoadingScreen />}
      {error && <div className="text-red-500">{error}</div>}
 
      <h1 className="text-center text-4xl font-extrabold mb-12 text-gold drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]">
        🎟️ Rifas Premium
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
 
      <div className="w-full flex justify-center mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-10">
          {paginatedRaffles.length === 0 ? (
            <p className="text-center col-span-full text-gray-400">
              No se encontraron rifas 😢
            </p>
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
      </div>

      <RaffleExpiredModal
        showExpiredModal={showExpiredModal}
        setShowExpiredModal={setShowExpiredModal}
        winner={winner}
        loadingWinner={loadingWinner}
      />

    </div>
  );
}
