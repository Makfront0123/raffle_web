
interface Reservation {
    id: number;
    user: User;
    raffle: Raffle;
    expires_at: Date;
    reservationTickets: ReservationTicket[];
}