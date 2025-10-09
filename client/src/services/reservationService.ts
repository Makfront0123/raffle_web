

export class ReservationService {
    async getAllReservations(): Promise<Reservation[]> {
        const response = await fetch("/api/reservations");
        if (!response.ok) {
            throw new Error("Error obteniendo reservas");
        }
        const reservations = await response.json();
        return reservations;
    }
}   