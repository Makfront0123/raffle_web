
interface Payment {
    id: number;
    user: User;
    raffle: Raffle;
    total_amount: number;
    status: string;
    method: string;
    transaction_id: string;
    tickets: Ticket[];
}