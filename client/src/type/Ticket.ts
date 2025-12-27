import { Payment, TicketStatusEnum } from "./Payment";
import { Raffle } from "./Raffle";
export interface Ticket {
  id_ticket: number;
  ticket_number: string;
  status: TicketStatusEnum;
  purchased_at?: string;
  raffle: Raffle;
  payment?: Payment;
}
