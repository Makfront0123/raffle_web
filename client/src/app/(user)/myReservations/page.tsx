"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReservation } from "@/hook/useReservation";
import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";
import { Reservation } from "@/type/Reservation";
import { useState, useEffect } from "react";
import { useCountdown } from "@/hook/useCountdown";
import { toast } from "sonner"; // ✅ importa Sonner

export default function Reservations() {
  const { reservations, loading, error } = useReservation();
  const { cancelReservation } = useReservationStore();
  const { token } = AuthStore();
  const [canceling, setCanceling] = useState<number | null>(null);

  if (loading) return <div className="p-10">Cargando reservas...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-[100vh] px-20 py-16">
      <h1 className="text-3xl font-bold mb-8 text-white">🎟️ Tus Reservas</h1>

      {reservations.length === 0 ? (
        <div className="text-gray-400">No tienes reservas activas</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((r) => (
            <ReservationCard
              key={r.id}
              reservation={r}
              token={token}
              canceling={canceling}
              onCancel={async (id) => {
                if (!token) return;
                setCanceling(id);
                await cancelReservation(id, token);
                setCanceling(null);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReservationCard({
  reservation,
  token,
  canceling,
  onCancel,
}: {
  reservation: Reservation;
  token: string | null;
  canceling: number | null;
  onCancel: (id: number) => Promise<void>;
}) {
  const countdown = useCountdown(reservation.expires_at);
  const ticket = reservation.reservationTickets?.[0]?.ticket;
  const ticketNumber = ticket?.ticket_number ?? "N/A";
  const ticketStatus = ticket?.status ?? "unknown";
  const raffleId = ticket?.raffleId ?? "N/A";

  // ✅ Detectar expiración
  useEffect(() => {
    if (countdown === "Expirada" || countdown === "00:00") {
      toast.error(`La reserva #${reservation.id} ha expirado 😔`, {
        description: `El ticket #${ticketNumber} ya no está disponible.`,
      });
    }
  }, [countdown, reservation.id, ticketNumber]);

  return (
    <Card className="p-4 bg-gray-800 text-white border border-gray-700">
      <CardHeader>
        <h3 className="font-semibold text-lg">🎰 Rifa #{raffleId}</h3>
        <p className="text-sm text-gray-400">
          Ticket #{ticketNumber} — {ticketStatus}
        </p>
      </CardHeader>

      <CardContent className="mt-2">
        <p>
          ⏳ Expira en: <span className="font-semibold">{countdown}</span>
        </p>
        <p className="text-sm text-gray-400">
          📅 Creada: {new Date(reservation.created_at).toLocaleString()}
        </p>

        <Button
          className="mt-4 bg-red-500 hover:bg-red-600"
          disabled={canceling === reservation.id}
          onClick={() => onCancel(reservation.id)}
        >
          {canceling === reservation.id ? "Cancelando..." : "Cancelar Reserva"}
        </Button>
      </CardContent>
    </Card>
  );
}
