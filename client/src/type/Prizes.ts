// types/Prizes.ts
import { Providers } from "./Providers";
import { Raffle } from "./Raffle";
import { Ticket } from "./Ticket";

export interface Prizes {
  id: number;
  name: string;
  description: string;
  value: number; // ✅ antes lo tenías como price
  type: 'cash' | 'trip' | 'product'; // ✅ agregar type
  provider: Providers;
  raffle: Raffle;
  winner_ticket?: Ticket | null;
}
