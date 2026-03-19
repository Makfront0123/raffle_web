"use client";

import RaffleInfo from "@/components/user/raffles/RaffleInfo";
import RaffleLegend from "@/components/user/raffles/RaffleLegend";
import RaffleTicketModal from "@/components/user/raffles/RaffleTickedModal";
import RaffleTicketsGrid from "@/components/user/raffles/RaffleTicketsGrid";
import RafflePagination from "@/components/user/raffles/RafflesPagination";
import { useRaffleDetail } from "@/hook/useRaffleDetail";
import { usePayment } from "@/hook/usePayment";
import LoadingScreen from "@/components/user/LoadingScreen";
import { PaymentSuccessModal } from "@/components/user/payment/PaymentSuccessModal";
import { PaymentFailedModal } from "@/components/user/payment/PaymentFailedModal";


export default function RaffleDetailPage() {

  const payment = usePayment({
    onPaymentSuccess: async () => {
      await raffleDetail.refreshRaffle();
      raffleDetail.setSelectedTickets([]);

    },
  });

  const raffleDetail = useRaffleDetail({
    payWithWompiWidget: payment.payWithWompiWidget,
  });


  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 text-white min-h-screen bg-black">
      {payment.verifyingPayment && <LoadingScreen />}
      {raffleDetail.raffle && (
        <RaffleInfo
          raffle={raffleDetail.raffle}
          soldPercentage={raffleDetail.soldPercentage}
        />
      )}


      <RaffleTicketsGrid
        tickets={raffleDetail.currentTickets}
        selectedTickets={raffleDetail.selectedTickets}
        getColor={raffleDetail.getTicketColor}
        handleSelect={raffleDetail.handleTicketSelect}
      />
      <div className="text-sm text-gold mt-3">
        {raffleDetail.selectedTickets.length} / 5 tickets seleccionados
      </div>
      {raffleDetail.selectedTickets.length > 0 && (
        <button
          onClick={() => raffleDetail.setOpen(true)}
          className="mt-4 bg-yellow-500 text-white font-bold px-6 py-2 rounded-md transition"
        >
          Continuar con {raffleDetail.selectedTickets.length} ticket(s)
        </button>
      )}



      <RaffleLegend />

      <RafflePagination
        currentPage={raffleDetail.page}
        totalPages={raffleDetail.totalPages}
        setCurrentPage={raffleDetail.setPage}
      />

      {raffleDetail.raffle && raffleDetail.selectedTickets.length > 0 && (
        <RaffleTicketModal
          open={raffleDetail.open}
          setOpen={raffleDetail.setOpen}
          tickets={raffleDetail.selectedTickets}
          raffle={raffleDetail.raffle}
          handleAction={raffleDetail.handleAction}
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
