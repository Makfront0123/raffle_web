"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
        return <div className="p-10 text-white">No tienes acceso a esta página</div>;

    if (!raffle)
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <p>Cargando rifa...</p>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto p-10">

            <div className="flex items-start justify-between">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2 text-white">{raffle.title}</h1>
                    <p className="text-gray-400 mb-4">{raffle.description}</p>
                    <p className="font-semibold text-white">🎟️ Total tickets: {raffle.total_numbers}</p>
                    <p className="font-semibold text-white">💰 Precio por ticket: ${raffle.price}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        ⏰ Termina: {new Date(raffle.end_date).toLocaleString()}
                    </p>
                </div>
                <div className="mt-6">
                    <p className="text-white text-sm mb-1">
                        🎯 Progreso de venta: {soldPercentage.toFixed(2)}%
                    </p>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-700"
                            style={{ width: `${soldPercentage}%` }}
                        />
                    </div>
                </div>
            </div>



            <div className="grid grid-cols-10 gap-2 mb-6">
                {currentTickets.map((ticket) => (
                    <div
                        key={ticket.id_ticket}
                        className={`border rounded-md text-center p-2 text-sm cursor-pointer transition-all ${getTicketColor(
                            ticket.status
                        )}`}
                        onClick={() => handleTicketSelect(ticket)}
                    >
                        {ticket.ticket_number}
                    </div>
                ))}
            </div>


            <div className="flex gap-6 text-sm text-white items-center justify-center my-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-200 border border-green-400" />
                    <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-200 border border-blue-400" />
                    <span>Reservado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-200 border border-red-400" />
                    <span>Comprado</span>
                </div>
            </div>


            <div className="flex justify-between items-center mt-4">
                <Button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    variant="outline"
                >
                    Anterior
                </Button>

                <p className="text-white">
                    Página {page} de {totalPages}
                </p>

                <Button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    variant="outline"
                >
                    Siguiente
                </Button>
            </div>


            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ticket #{selectedTicket?.ticket_number}</DialogTitle>
                        <p className="text-sm text-gray-500">Precio: ${raffle.price}</p>
                    </DialogHeader>

                    <div className="flex flex-col gap-2 mt-4">
                        <Button onClick={() => handleAction("nequi")} className="bg-pink-500 hover:bg-pink-600 text-white">
                            Pagar con Nequi
                        </Button>
                        <Button onClick={() => handleAction("daviplata")} className="bg-purple-500 hover:bg-purple-600 text-white">
                            Pagar con Daviplata
                        </Button>
                        <Button onClick={() => handleAction("reserve")} variant="outline">
                            Reservar Ticket
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}