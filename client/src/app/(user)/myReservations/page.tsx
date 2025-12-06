"use client";

import LoadingScreen from "@/components/LoadingScreen";
import PaginationControls from "@/components/user/reservations/PaginationControls";
import ReservationsList from "@/components/user/reservations/ReservationList";
import { useReservationsLogic } from "@/hook/useReservationsLogic";


export default function ReservationsPage() {
  const {
    loading,
    error,
    raffles,
    canceling,
    page,
    totalPages,
    paginatedReservations,
    setPage,
    handleCancel,
    handlePayment,
  } = useReservationsLogic();

  if (loading || raffles.length === 0) return <LoadingScreen />;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-[100vh] md:px-20 px-0 py-16">
      <h1 className="text-3xl font-bold mb-8 text-black">🎟️ Tus Reservas</h1>

      <ReservationsList
        paginatedReservations={paginatedReservations}
        raffles={raffles}
        canceling={canceling}
        onCancel={handleCancel}
        onPay={handlePayment}
      />

      {totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      )}
    </div>
  );
}
