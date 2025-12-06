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
        return <div className="p-10 text-black">No tienes acceso a esta página</div>;

    if (!raffle)
        return (
            <div className="flex justify-center items-center h-screen text-black">
                <p>Cargando rifa...</p>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto p-10">

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
