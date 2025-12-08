"use client";

import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import WinnersSection from "@/components/WinnersSection";
import FAQSection from "@/components/FAQSection";
import { useLoadingScreen } from "@/hook/useLoadingScreen";
import RaffleGrid from "@/components/RafflesGrid";
import { useState } from "react";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePrizes } from "@/hook/usePrizes";

export default function Home() {
  const loading = useLoadingScreen(300);


  const { filteredRaffles } = useFilteredRaffles();
  const { winners } = usePrizes();


  const [expiredModal, setExpiredModal] = useState({
    open: false,
    raffle: null,
  });

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Hero />

      <RaffleGrid
        raffles={filteredRaffles}
        setShowExpiredModal={(open, raffle) =>
          setExpiredModal({ open, raffle })
        }
      />

      <WinnersSection winners={winners} />
      <FAQSection />
    </>
  );
}
