"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import { useReservationsLogic } from "@/hook/useReservationsLogic";
import { useCountdown } from "@/hook/useCountdown";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Raffle } from "@/type/Raffle";
import { Reservation } from "@/type/Reservation";

export default function Reservations() {
  const {
    reservations,
    loading,
    error,
    raffles,
    canceling,
    page,
    totalPages,
    paginatedReservations,
    setPage,
    handleCancel,
    handlePayment,
  } = useReservationsLogic();

  if (loading || raffles.length === 0) return <LoadingScreen />;

  if (error) return <div className="p-10 text-red-500">{error}</div>;


  return (
    <div className="w-full min-h-[100vh] px-20 py-16">
      <h1 className="text-3xl font-bold mb-8 text-white">🎟️ Tus Reservas</h1>

      {reservations.length === 0 ? (
        <div className="text-gray-400">No tienes reservas activas</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReservations.map((r: Reservation) => {
              const ticket = r.reservationTickets?.[0]?.ticket;
              if (!ticket) return null;
              const raffle = raffles.find((rf) => rf.id === ticket.raffleId);
              return (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  raffle={raffle} 
                  canceling={canceling}
                  onCancel={handleCancel}
                  onPay={handlePayment}
                />
              );
            })}

          </div>

          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="cursor-pointer bg-white"
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="cursor-pointer bg-white"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

function ReservationCard({
  reservation,
  raffle,
  canceling,
  onCancel,
  onPay,
}: {
  reservation: Reservation;
  raffle?: Raffle;
  canceling: number | null;
  onCancel: (id: number) => Promise<void>;
  onPay: (method: "nequi" | "daviplata", raffleId: number, ticketId: number) => Promise<void>;
}) {

  const [open, setOpen] = useState(false);
  const countdown = useCountdown(reservation.expires_at);
  const ticket = reservation.reservationTickets?.[0]?.ticket;

  useEffect(() => {
    if (countdown === "Expirada" || countdown === "00:00") {
      toast.error(`La reserva #${reservation.id} ha expirado 😔`);
    }
  }, [countdown, reservation.id]);

  return (
    <>
      <Card className="p-4 bg-gray-800 text-white border border-gray-700">
        <CardHeader>
          <h3 className="font-semibold text-lg">🎰 Rifa #{raffle?.id}</h3>
          <p className="text-sm text-gray-400">
            Ticket #{ticket.ticket_number} — {ticket.status}
          </p>
        </CardHeader>

        <CardContent>
          <p>⏳ Expira en: <span className="font-semibold">{countdown}</span></p>
          <Button
            className="mt-4 bg-red-500 hover:bg-red-600"
            disabled={canceling === reservation.id}
            onClick={() => onCancel(reservation.id)}
          >
            {canceling === reservation.id ? "Cancelando..." : "Cancelar"}
          </Button>

          {ticket.status === "reserved" && (
            <Button
              className="mt-2 bg-green-500 hover:bg-green-600 ml-8"
              onClick={() => setOpen(true)}
            >
              Comprar
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket #{ticket.ticket_number}</DialogTitle>
            <p className="text-sm text-gray-500">Precio: ${raffle?.price}</p>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={() => onPay("nequi", raffle?.id!, ticket.id_ticket)} className="bg-pink-500 hover:bg-pink-600 text-white">
              Nequi
            </Button>
            <Button onClick={() => onPay("daviplata", raffle?.id!, ticket.id_ticket)} className="bg-purple-500 hover:bg-purple-600 text-white">
              Daviplata
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/*
<Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket #{ticketNumber}</DialogTitle>
            <p className="text-sm text-gray-500">Precio: ${raffle.price}</p>
          </DialogHeader>

          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={() => handlePayment("nequi")}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Pagar con Nequi
            </Button>
            <Button
              onClick={() => handlePayment("daviplata")}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Pagar con Daviplata
            </Button>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
*/