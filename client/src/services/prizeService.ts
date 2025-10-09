export class PrizeService {
    async getAllPrizes(): Promise<Prize[]> {
        const response = await fetch("/api/prizes");
        if (!response.ok) {
            throw new Error("Error obteniendo premios");
        }
        const prizes = await response.json();
        return prizes;
    }
}