import { Raffle } from "./Raffle";
import { User } from "./User";

export enum PaymentStatusEnum {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export enum TicketStatusEnum {
  AVAILABLE = 'available',
  HELD = 'held',
  RESERVED = 'reserved',
  PURCHASED = 'purchased',
}

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
  ticket_ids: number[];
  card_token?: string;
  reference: string;
  reservation_id?: number;
}

export interface WompiPaymentResponse {
  payment_id: number;
  reference: string;
  amount_in_cents: number;
  currency: string;
}

export interface Payment {
  id: number;
  total_amount: number;
  status: PaymentStatusEnum;
  method: string;
  created_at: string;
  cancelled_at: string | null;
  details: TicketDetail[];
  raffle: Raffle;
  reference: string;
  transaction_id: string | null;
  user: User | null;
}

export interface TicketDetail {
  id: number;
  amount: string;
  ticket: PaymentTicket;
}

export interface PaymentTicket {
  id_ticket: number;
  ticket_number: string;
  status: TicketStatusEnum;
}
