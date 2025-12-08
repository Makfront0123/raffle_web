export interface WinnerTicket {
  id_ticket: number;
  ticket_number: number;
}

export interface Winner {
  id: number;
  raffle_id: number;
  raffle_title: string;
  winner_user: User;
  prize_name: string;
  winner_ticket: WinnerTicket;  
  value: number;
}
