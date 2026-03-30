"use client";

import LoadingScreen from "@/components/user/LoadingScreen";
import { PaymentSuccessModalTwilio } from "@/components/user/payment/PaymentSuccessModalTwilio";
import { PaymentFailedModal } from "@/components/user/payment/PaymentFailedModal";
import PaginationControls from "@/components/user/reservations/PaginationControls";
import ReservationsList from "@/components/user/reservations/ReservationList";
import { usePayment } from "@/hook/usePayment";
import { useReservationsLogic } from "@/hook/useReservationsLogic";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Raffle } from "@/type/Raffle";
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
    filterRaffle,
    setFilterRaffle,
    uniqueRaffles,
  } = useReservationsLogic({
    payWithWompiWidget: payment.payWithWompiWidget,
  });

  if (error) return <div className="p-10 text-yellow-500">{error}</div>;
  

  return (
    <div className="flex-1 p-6 bg-white min-h-[30vh] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Tus Reservas</h1>
      <div className="mb-6">
        <Select
          value={filterRaffle === "all" ? "all" : filterRaffle.toString()}
          onValueChange={(v) => {
            setFilterRaffle(v === "all" ? "all" : Number(v));
            setPage(1); 
          }}
        >
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Filtrar por rifa" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Todas las rifas</SelectItem>

            {uniqueRaffles.map((r: Raffle) => (
              <SelectItem key={r.id} value={r.id.toString()}>
                {r.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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

      <PaymentSuccessModalTwilio
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