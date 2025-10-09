
interface Prize {
    id: number;
    name: string;
    provider: Provider;
    raffle: Raffle;
    winner_ticket: Ticket;
}