
export class RaffleService {
    async getAllRaffles(): Promise<Raffle[]> {
        const response = await fetch("/api/raffles");
        if (!response.ok) {
            throw new Error("Error obteniendo rifas");
        }
        const raffles = await response.json();
        return raffles;
    }
}