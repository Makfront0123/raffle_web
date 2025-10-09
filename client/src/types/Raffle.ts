interface Raffle {
    id: number;
    title: string;
    description: string;
    price: number;
    end_date: Date;
    digits: number;
    total_numbers: number;
    tickets: Ticket[];
}

 