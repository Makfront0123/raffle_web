"use client";

import RaffleInfo from "@/components/RaffleInfo";
import RaffleLegend from "@/components/user/raffles/RaffleLegend";
import RaffleTicketModal from "@/components/user/raffles/RaffleTickedModal";
import RaffleTicketsGrid from "@/components/user/raffles/RaffleTicketsGrid";
import RafflePagination from "@/components/user/raffles/RafflesPagination";
import { useRaffleDetail } from "@/hook/useRaffleDetail";
import { PaymentSuccessModal } from "@/components/PaymentSuccessModal";
import { usePayment } from "@/hook/usePayment";
import LoadingScreen from "@/components/LoadingScreen";

export default function RaffleDetailPage() {
  const raffleDetail = useRaffleDetail({
    payWithWompiWidget: async () => { },
  });

  const payment = usePayment({
    onPaymentSuccess: raffleDetail.refreshRaffle,
  });

  raffleDetail.handleAction = async (action: any) => {
    if (!raffleDetail.selectedTicket || !raffleDetail.raffle) return;

    if (action === "reserve") {
      return raffleDetail.handleAction(action);
    }

    await payment.payWithWompiWidget({
      ticket: raffleDetail.selectedTicket,
      raffle: raffleDetail.raffle,
      method: action,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 text-white min-h-screen bg-black">
      <RaffleInfo
        raffle={raffleDetail.raffle}
        soldPercentage={raffleDetail.soldPercentage}
      />

      <RaffleTicketsGrid
        tickets={raffleDetail.currentTickets}
        getColor={raffleDetail.getTicketColor}
        handleSelect={raffleDetail.handleTicketSelect}
      />

      <RaffleLegend />

      <RafflePagination
        currentPage={raffleDetail.page}
        totalPages={raffleDetail.totalPages}
        setCurrentPage={raffleDetail.setPage}
      />

      {raffleDetail.selectedTicket && (
        <RaffleTicketModal
          open={raffleDetail.open}
          setOpen={raffleDetail.setOpen}
          ticket={raffleDetail.selectedTicket}
          raffle={raffleDetail.raffle}
          handleAction={raffleDetail.handleAction}
        />
      )}

      {payment.loading && <LoadingScreen />}

      <PaymentSuccessModal
        open={payment.successModalOpen}
        onClose={() => payment.setSuccessModalOpen(false)}
        raffleName={payment.paymentInfo?.raffleName}
        ticketNumber={payment.paymentInfo?.ticketNumber}
        amount={raffleDetail.raffle?.price ?? 0}

      />

    </div>
  );
}
