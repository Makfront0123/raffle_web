import { PaymentDetails } from "./PaymentDetails";

// Para pagos creados desde el backend
export interface PaymentCreateDto {
  raffle_id: number;
  ticket_id: number;
  reference: string;
  total_amount: number;
  method: string;
}

export interface WidgetPaymentDto {
  method: "card" | "pse";
  raffle_id: number;
  ticket_id: number;
  card_token?: string;
  reference: string;
}



/**test_integrity_mkuGZ8PNZTT6KFaHz4iRA3B7q0tNy1LL */

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
