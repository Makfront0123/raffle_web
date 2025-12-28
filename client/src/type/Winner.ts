import { User } from "./User";

export interface WinnerTicket {
  id_ticket: number;
  ticket_number: number;
}

export interface Winner {
  id: number;
  prize_id: number;
  raffle_id: number;
  raffle_title: string;
  prize_name: string;
  value: number;
  winner_user: User;
  winner_ticket: WinnerTicket;
}
