"use client";

import LoadingScreen from "@/components/LoadingScreen";
import { PaymentSuccessModal } from "@/components/PaymentSuccessModal";
import { PaymentFailedModal } from "@/components/user/PaymentFailedModal";
import PaginationControls from "@/components/user/reservations/PaginationControls";
import ReservationsList from "@/components/user/reservations/ReservationList";
import { usePayment } from "@/hook/usePayment";
import { useRaffleDetail } from "@/hook/useRaffleDetail";
import { useReservationsLogic } from "@/hook/useReservationsLogic";
export default function ReservationsPage() {
  const {
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

  const raffleDetail = useRaffleDetail({
    payWithWompiWidget: async () => { },
  });

  const payment = usePayment({
    onPaymentSuccess: raffleDetail.refreshRaffle,
  });

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

      {payment.loading && <LoadingScreen />}

      <PaymentSuccessModal
        open={payment.successModalOpen}
        onClose={() => payment.setSuccessModalOpen(false)}
        raffleName={payment.paymentInfo?.raffleName}
        tickets={payment.paymentInfo?.tickets}
        amount={raffleDetail.raffle?.price ?? 0}
      />

      <PaymentFailedModal
        open={payment.failedModalOpen}
        onClose={() => payment.setFailedModalOpen(false)}
        raffleName={payment.failedPaymentInfo?.raffleName}
        tickets={payment.failedPaymentInfo?.tickets}
        reason={payment.failedPaymentInfo?.reason}
      />


    </div>
  );
}
