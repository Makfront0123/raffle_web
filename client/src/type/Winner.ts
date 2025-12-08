// src/type/Winner.ts
export interface Winner {
  id: number;  
  raffle_id: number;  
  raffle_title: string;  
  winner_user: User;  
  prize_name: string;  
  winner_ticket: string;  
  value: number; 
}
