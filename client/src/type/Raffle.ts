import { Prizes } from "./Prizes";
import { Ticket } from "./Ticket";

export interface Raffle {
  id: number;
  title: string;
  price: number;
  description: string;
  end_date: string;
  digits: number;
  status: string;
  tickets: Ticket[];
  prizes: Prizes[];
  created_at: string;
  total_numbers: number;
}

export type RaffleForm = {
  title: string;
  description: string;
  price: string;
  end_date: string;
  digits: number;
  status: string;
  tickets: Ticket[];
  prizes: Prizes[];
};


export type UpdateRafflePayload = {
  price?: number;
  endDate?: string;
  title?: string;
  description?: string;
}

export interface CreateRaffleDTO {
  title: string;
  description?: string;
  price: number;
  endDate?: string;
  digits?: number;
}
