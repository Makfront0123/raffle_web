import { Raffle } from "@/type/Raffle";
import axios from "axios";


export class RaffleService {
    async getAllRaffles(token: string): Promise<Raffle[]> {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
    async getRaffleById(id: number, token: string): Promise<Raffle> {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }

    async createRaffle(raffle: Raffle, token: string): Promise<Raffle> {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle`, raffle, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
    async updateRaffle(id: number, raffle: Partial<Raffle>, token: string): Promise<Raffle> {
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle/${id}`, raffle, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }

    async deleteRaffle(id: number, token: string): Promise<void> {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
    async regenerateTickets(raffleId: number, newDigits: number, token: string): Promise<void> {
        await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle/${raffleId}/regenerate-tickets/${newDigits}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

    }

    async activateRaffle(id: number, token: string): Promise<void> {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle/${id}/activate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

}
