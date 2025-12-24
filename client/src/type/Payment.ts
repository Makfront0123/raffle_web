import { Raffle } from "./Raffle";
import { Ticket } from "./Ticket";

export interface PaymentCreateDto {
  raffle_id: number;
  ticket_ids: number[];
  reference: string;
  total_amount: number;
  reservation_id?: number;
}

export interface WidgetPaymentDto {
  method: string;
  raffle_id: number;
  ticket_id: number;
  card_token?: string;
  reference: string;
}

export interface Payment {
  id: number;
  total_amount: number;
  status: string;
  method: string;
  created_at: string;
  cancelled_at: string | null;
  details: TicketDetail[];
  raffle: Raffle;
  reference: string;
}
export interface TicketDetail {
  id: number;
  amount: string;
  ticket: Ticket;
}
