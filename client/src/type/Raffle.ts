import { Prizes } from "./Prizes";
import { Ticket } from "./Ticket";

export interface Raffle {
  id: number;
  title: string;
  price: number; // o number si quieres
  description: string;
  end_date: string;
  digits: number;
  status: string;
  tickets: Ticket[];
  prizes: Prizes[];
  created_at: string;
  total_numbers: number; // readonly, calculado en backend
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
