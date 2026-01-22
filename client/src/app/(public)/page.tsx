"use client";

import LoadingScreen from "@/components/user/LoadingScreen";
import WinnersSection from "@/components/user/WinnersSection";
import FAQSection from "@/components/user/FAQSection";
import { useLoadingScreen } from "@/hook/useLoadingScreen";
import RaffleGrid from "@/components/user/raffles/RafflesGrid";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePrizes } from "@/hook/usePrizes";
import { usePagination } from "@/hook/usePagination";
import Hero from "@/components/user/Hero";
import { useHomeWinners } from "@/hook/useHomeWinners";

export default function Home() {
  const loading = useLoadingScreen(300);
 

  const { filteredRaffles, setExpiredModal } = useFilteredRaffles();
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
        setShowExpiredModal={(open, raffle) =>
          setExpiredModal({ open, raffle: raffle ?? null })
        }
      />

      {totalPages > 1 && (
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
    </>
  );
}
