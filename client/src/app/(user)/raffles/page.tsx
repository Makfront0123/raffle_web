"use client";
import RaffleCard from "@/components/user/raffles/RaffleCard";
import LoadingScreen from "@/components/user/LoadingScreen";
import { usePrizes } from "@/hook/usePrizes";
import RaffleExpiredModal from "@/components/user/raffles/RaffleExpiredModal";
import RaffleFilters from "@/components/user/raffles/RafflesFilters";
import RafflePagination from "@/components/user/raffles/RafflesPagination";
import { Raffle } from "@/type/Raffle";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePagination } from "@/hook/usePagination";



export default function Raffles() {
  const {
    filteredRaffles,
    loading,
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

  const { winners, loading: loadingWinner } = usePrizes();


  const {
    page: currentPage,
    totalPages,
    items: paginatedRaffles,
    setPage: setCurrentPage,
  } = usePagination(filteredRaffles, 3);


  return (
    <div className="w-full min-h-screen px-6 py-16 bg-gradient-to-t from-yellow-500 text-white z-80">

      {loading && <LoadingScreen />}


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
              No se encontraron rifas
            </p>
          ) : (
            paginatedRaffles.map((raffle: Raffle) => (
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
        winners={winners}
        loadingWinner={loadingWinner}
      />


    </div>
  );
}
