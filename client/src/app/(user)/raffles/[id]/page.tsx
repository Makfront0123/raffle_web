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
  const {
    raffle,
    page,
    setPage,
    totalPages,
    currentTickets,
    selectedTicket,
    setOpen,
    open,
    getTicketColor,
    handleTicketSelect,
    handleAction,
    soldPercentage,
  } = useRaffleDetail();
  const {
    successModalOpen,
    setSuccessModalOpen,
    paymentInfo,
    loading
  } = usePayment();

  console.log('successModalOpen', successModalOpen);

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 text-white 
      bg-gradient-to-b from-black via-[#111] to-black 
      min-h-screen"
    >
      <RaffleInfo raffle={raffle} soldPercentage={soldPercentage} />

      <RaffleTicketsGrid
        tickets={currentTickets}
        getColor={getTicketColor}
        handleSelect={handleTicketSelect}
      />

      <RaffleLegend />

      <RafflePagination
        currentPage={page}
        totalPages={totalPages}
        setCurrentPage={setPage}
      />

      {selectedTicket && (
        <RaffleTicketModal
          open={open}
          setOpen={setOpen}
          ticket={selectedTicket}
          raffle={raffle}
          handleAction={handleAction}
        />
      )}
      {loading && <LoadingScreen />}

      <PaymentSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        raffleName={paymentInfo?.raffleName}
        ticketNumber={paymentInfo?.ticketNumber}
      />


    </div>
  );
}