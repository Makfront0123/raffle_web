"use client";

import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import WinnersSection from "@/components/WinnersSection";
import FAQSection from "@/components/FAQSection";
import RaffleGrid from "@/components/RafflesGrid";
import PaginationControls from "@/components/user/reservations/PaginationControls";

import { useLoadingScreen } from "@/hook/useLoadingScreen";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePrizes } from "@/hook/usePrizes";
import { usePagination } from "@/hook/usePagination";

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
