import { User } from "./User";

export interface Winner {
  prize_id: number;
  raffle_id: number;
  raffle_title: string;
  prize_name: string;
  value: number;
  winner_user: User;
  winner_ticket: string;
}
