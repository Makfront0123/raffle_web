import { Payment } from "./Payment";
import { Raffle } from "./Raffle";

export interface Ticket {
    id_ticket: number;
    ticket_number: string;
    status: string;
    purchased_at?: string | null;
    raffle: Raffle;
    payment: Payment;
}
