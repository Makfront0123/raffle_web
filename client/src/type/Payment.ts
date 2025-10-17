import { PaymentDetails } from "./PaymentDetails";

export interface PaymentCreateDto {
  method: string;
  raffle_id: number;
  ticket_ids: number[];
}


export interface Payment extends PaymentCreateDto {
    id: number;
    userId: number;
    created_at: string;
    expires_at: string;
    paymentDetails?: PaymentDetails;
}
