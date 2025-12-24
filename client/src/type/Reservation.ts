import { Raffle } from "./Raffle";

export interface Reservation {
  id: number;
  created_at: string;
  expires_at: string;
  userId: number;
  raffleId: number;
  raffle: Raffle;
  reservationTickets: {
    id: number;
    ticket: {
      id_ticket: number;
      raffleId: number;
      ticket_number: string;
      status: string;
      purchased_at: string;
    };
  }[];
}
