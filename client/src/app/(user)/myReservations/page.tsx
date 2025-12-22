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
    handleAction,
  } = useReservationsLogic();

  if (loading || raffles.length === 0) return <LoadingScreen />;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="flex-1 p-6 bg-white min-h-[30vh] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Tus Reservas</h1>

      <ReservationsList
        paginatedReservations={paginatedReservations}
        raffles={raffles}
        canceling={canceling}
        onCancel={handleCancel}
        onPay={handleAction}
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
