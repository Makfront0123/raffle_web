"use client";

import LoadingScreen from "@/components/user/LoadingScreen";
import { PaymentSuccessModal } from "@/components/user/payment/PaymentSuccessModal";
import { PaymentFailedModal } from "@/components/user/payment/PaymentFailedModal";
import PaginationControls from "@/components/user/reservations/PaginationControls";
import ReservationsList from "@/components/user/reservations/ReservationList";
import { usePayment } from "@/hook/usePayment";
import { useReservationsLogic } from "@/hook/useReservationsLogic";
export default function ReservationsPage() {
  const payment = usePayment({
    onPaymentSuccess: async () => {
      return;
    },
  });

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
  } = useReservationsLogic({
    payWithWompiWidget: payment.payWithWompiWidget,
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
        raffleId={payment.paymentInfo?.raffle.id ?? 0}
        tickets={payment.paymentInfo?.tickets}
        amount={payment.paymentInfo?.amount ?? 0}
        reference={payment.paymentInfo?.reference ?? ''}
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