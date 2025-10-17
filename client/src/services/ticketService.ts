import axios from "axios";

export class TicketService {
    static async getSoldPercentage(raffleId: number,token: string) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ticket/${raffleId}/sold-percentage`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
}