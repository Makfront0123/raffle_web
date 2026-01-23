"use client";

import LoadingScreen from "@/components/user/LoadingScreen";
import WinnersSection from "@/components/user/WinnersSection";
import FAQSection from "@/components/user/FAQSection";
import { useLoadingScreen } from "@/hook/useLoadingScreen";
import RaffleGrid from "@/components/user/raffles/RafflesGrid";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import PaginationControls from "@/components/user/reservations/PaginationControls";
import { usePagination } from "@/hook/usePagination";
import Hero from "@/components/user/Hero";
import { useHomeWinners } from "@/hook/useHomeWinners";
import RaffleExpiredModal from "@/components/user/raffles/RaffleExpiredModal";

export default function Home() {
  const loading = useLoadingScreen(300);


  const {
    filteredRaffles,
    showExpiredModal,
    setShowExpiredModal,
  } = useFilteredRaffles();

  const {
    page: rafflePage,
    totalPages: raffleTotalPages,
    setPage: setRafflePage,
    items: paginatedRaffles,
  } = usePagination(filteredRaffles, 3);

  const {
    winners,
    raffles,
    raffleId,
    setRaffleId,
    page,
    setPage,
    totalPages,
  } = useHomeWinners(2);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Hero />

      <RaffleGrid
        raffles={paginatedRaffles}
        setShowExpiredModal={setShowExpiredModal}
      />

      {raffleTotalPages > 1 && (
        <PaginationControls
          page={rafflePage}
          totalPages={raffleTotalPages}
          onChange={setRafflePage}
        />
      )}

      <WinnersSection
        winners={winners}
        raffles={raffles}
        raffleId={raffleId}
        onRaffleChange={setRaffleId}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <FAQSection />

      <RaffleExpiredModal
        showExpiredModal={showExpiredModal}
        setShowExpiredModal={setShowExpiredModal}
        winners={winners}
        loadingWinner={false}
      />

    </>
  );
}
