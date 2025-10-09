
export class TicketService {
    async getSoldPercentage(raffleId: number): Promise<{ raffleId: number, totalTickets: number, soldTickets: number, reservedTickets: number, availableTickets: number, soldPercentage: number }> {
        const response = await fetch(`/api/tickets/${raffleId}/sold-percentage`);
        if (!response.ok) {
            throw new Error("Error obteniendo porcentaje de tickets vendidos");
        }
        const data = await response.json();
        return data;
    }
}