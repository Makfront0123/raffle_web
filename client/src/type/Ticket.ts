import { Payment } from "./Payment";
export interface Ticket {
  id_ticket: number;
  ticket_number: string;
  status: string;
  purchased_at?: string;
  raffle: {
    id: number;
    title: string;
    description: string;
    total_numbers: number;
    price: string;
  };
  payment?: {
    id: number;
    total_amount: string;
    status: string;
    method: string;
    created_at: string;
    cancelled_at: string | null;
    reference: string;
  };
}
