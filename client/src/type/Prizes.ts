
import { Providers } from "./Providers";
import { Raffle } from "./Raffle";
import { Ticket } from "./Ticket";



export interface Prizes {
    id: number;
    name: string;
    description: string;
    price: number;
    provider: Providers;
    raffle: Raffle;
    winner_ticket: Ticket;
}