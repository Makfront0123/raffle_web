import { PaymentDetails } from "./PaymentDetails";

export interface PaymentCreateDto {
  method: string;
  raffle_id: number;
  ticket_ids: number[];
}


export interface Payment {
  id: number;
  method: string;
  total_amount: string; // 👈 o number si lo prefieres
  status: string;
  raffle: { id: number; title: string };
  user: { id: number; name: string };
  created_at: string;
  cancelled_at: string | null;
}
