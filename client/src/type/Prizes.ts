import { Ticket } from "./Ticket";


export interface Prizes {
  id: number;
  name: string;
  description: string;
  value: string | number;
  type: string;
  created_at: string;
  provider: {
    id: number;
    name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
  };
  raffle: {
    id: number;
    title: string;
  };
  winner_ticket?: Ticket | null;
}

export interface PrizeForm {
  name: string;
  description: string;
  value: number;
  raffle: string;
  provider: string;
  type?: string;
}

export interface CreatePrizeDTO {
  name: string;
  description: string;
  value: number;
  type: string;
  raffleId: number;
  providerId: number;
}
