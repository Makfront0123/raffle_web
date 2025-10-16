import { Prizes } from "./Prizes";
import { Ticket } from "./Ticket";

export interface Raffle {
  id: number;
  title: string;
  price: string;
  total_numbers: number;
  description: string;
  end_date: string;
  digits: number;
  tickets: Ticket[];
  prizes: Prizes[];
}