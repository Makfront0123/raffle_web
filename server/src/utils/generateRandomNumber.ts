export function generateAllTicketNumbers(digits: number): string[] {
    const total = Math.pow(10, digits);
    const tickets: string[] = [];

    for (let i = 0; i < total; i++) {
        tickets.push(i.toString().padStart(digits, '0'));
    }

    return tickets;
}
