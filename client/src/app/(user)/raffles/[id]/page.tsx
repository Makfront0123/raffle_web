"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRaffleStore } from "@/store/raffleStore";
import { AuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Ticket } from "@/type/Ticket";
import { toast } from "sonner";
import { useReservation } from "@/hook/useReservation";
import { useReservationStore } from "@/store/reservationStore";

export default function RaffleDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const { raffles, getRaffleById } = useRaffleStore();
    const { createReservation } = useReservationStore();
    const { token } = AuthStore();

    const raffle = raffles[0]; // tu store setea 1 rifa activa

    const [page, setPage] = useState(1);
    const perPage = 50;

    // Estado de tickets (local)
    const [localTickets, setLocalTickets] = useState<Ticket[]>([]);

    // Ticket seleccionado y modal
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [open, setOpen] = useState(false);

    // Cargar rifa
    useEffect(() => {
        if (id) getRaffleById(Number(id), token || "");
    }, [id, getRaffleById]);

    // Actualizar tickets locales cuando se obtenga la rifa
    useEffect(() => {
        if (raffle?.tickets) setLocalTickets(raffle.tickets);
    }, [raffle]);

    if (!token) return <div className="p-10 text-white">No tienes acceso a esta página</div>;

    if (!raffle)
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <p>Cargando rifa...</p>
            </div>
        );

    const totalPages = Math.ceil(localTickets.length / perPage);
    const start = (page - 1) * perPage;
    const currentTickets = localTickets.slice(start, start + perPage);

    const getTicketColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
            case "reserved":
                return "bg-blue-100 text-blue-800 border-blue-300 cursor-not-allowed opacity-70";
            case "purchased":
                return "bg-red-100 text-red-800 border-red-300 cursor-not-allowed opacity-70";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const handleTicketSelect = (ticket: Ticket) => {
        if (ticket.status !== "available") return;
        setSelectedTicket(ticket);
        setOpen(true);
    };

    const handleAction = async (action: string) => {
        if (!selectedTicket) return;

        // Cerrar modal
        setOpen(false);

        // Simular cambio de estado visual
        if (action === "reserve") {
            await createReservation(selectedTicket.id_ticket, raffle.id, token || "");
            setLocalTickets((prev) =>
                prev.map((t) =>
                    t.id_ticket === selectedTicket.id_ticket
                        ? { ...t, status: "reserved" }
                        : t
                )
            );
            toast.success(`Ticket #${selectedTicket.ticket_number} reservado exitosamente ✅`);
        } else {
            setLocalTickets((prev) =>
                prev.map((t) =>
                    t.id_ticket === selectedTicket.id_ticket
                        ? { ...t, status: "purchased" }
                        : t
                )
            );
            toast.success(
                `Pago simulado con ${action === "nequi" ? "Nequi" : "Daviplata"
                } para el ticket #${selectedTicket.ticket_number} 💰`
            );
        }

        setSelectedTicket(null);
    };

    return (
        <div className="max-w-5xl mx-auto p-10">
            {/* Info de la rifa */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-2 text-white">{raffle.title}</h1>
                <p className="text-gray-400 mb-4">{raffle.description}</p>
                <p className="font-semibold text-white">🎟️ Total tickets: {raffle.total_numbers}</p>
                <p className="font-semibold text-white">💰 Precio por ticket: ${raffle.price}</p>
                <p className="text-sm text-gray-500 mt-2">
                    ⏰ Termina: {new Date(raffle.end_date).toLocaleString()}
                </p>
            </div>

            {/* Tickets */}
            <div className="grid grid-cols-10 gap-2 mb-6">
                {currentTickets.map((ticket: Ticket) => (
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

            {/* Paginador */}
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

            {/* Modal de opciones */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ticket #{selectedTicket?.ticket_number}</DialogTitle>
                        <p className="text-sm text-gray-500">
                            Precio: ${raffle.price}
                        </p>
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
