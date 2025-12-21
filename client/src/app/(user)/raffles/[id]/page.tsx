"use client";

import RaffleInfo from "@/components/RaffleInfo";
import RaffleLegend from "@/components/user/raffles/RaffleLegend";
import RaffleTicketModal from "@/components/user/raffles/RaffleTickedModal";
import RaffleTicketsGrid from "@/components/user/raffles/RaffleTicketsGrid";
import RafflePagination from "@/components/user/raffles/RafflesPagination";
import { useRaffleDetail } from "@/hook/useRaffleDetail";

export default function RaffleDetailPage() {
  const {
    token,
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

  if (!token)
    return (
      <div className="p-10 text-gold text-center bg-black min-h-screen">
        No tienes acceso a esta página
      </div>
    );

  if (!raffle)
    return (
      <div className="flex justify-center items-center h-screen text-gold bg-black">
        <p>Cargando rifa...</p>
      </div>
    );

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

      <RaffleTicketModal
        open={open}
        setOpen={setOpen}
        ticket={selectedTicket}
        raffle={raffle}
        handleAction={handleAction}
      />
    </div>
  );
}