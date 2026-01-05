"use client";
import LoadingScreen from "@/components/user/LoadingScreen";

import WinnersSection from "@/components/user/WinnersSection";
import FAQSection from "@/components/user/FAQSection";
import { useLoadingScreen } from "@/hook/useLoadingScreen";
import RaffleGrid from "@/components/user/raffles/RafflesGrid";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePrizes } from "@/hook/usePrizes";
import PaginationControls from "@/components/user/reservations/PaginationControls";
import { usePagination } from "@/hook/usePagination";
import Hero from "@/components/user/Hero";

export default function Home() {
  const loading = useLoadingScreen(300);

  const { filteredRaffles, setExpiredModal } = useFilteredRaffles();
  const { winners } = usePrizes();

  const {
    page,
    totalPages,
    setPage,
    items: paginatedRaffles,
  } = usePagination(filteredRaffles, 3);


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
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      )}

      <WinnersSection winners={winners} />
      <FAQSection />
    </>
  );
}
