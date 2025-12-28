"use client";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import WinnersSection from "@/components/WinnersSection";
import FAQSection from "@/components/FAQSection";
import { useLoadingScreen } from "@/hook/useLoadingScreen";
import RaffleGrid from "@/components/RafflesGrid";
import { useFilteredRaffles } from "@/hook/useFilteredRaffles";
import { usePrizes } from "@/hook/usePrizes";
import PaginationControls from "@/components/user/reservations/PaginationControls";
import { usePagination } from "@/hook/usePagination";
import AdminSplashScreen from "@/components/admin/adminSplashScreen";
import { useAuth } from "@/hook/useAuth";
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


  const { user, showAdminSplash } = useAuth();

  if (loading) return <LoadingScreen />;

  console.log(user);

  if (showAdminSplash && user?.role === "admin") {
    return <AdminSplashScreen name={user.name} />;
  }

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
