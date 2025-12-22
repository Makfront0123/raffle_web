export interface PaymentCreateDto {
  raffle_id: number;
  ticket_id: number;
  reference: string;
  total_amount: number;
  method: string;
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
  method: string;
  total_amount: string;
  status: string;
  raffle: { id: number; title: string };
  user: { id: number; name: string };
  created_at: string;
  cancelled_at: string | null;
}
