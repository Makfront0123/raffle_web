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
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error: any) {

            const backendMessage =
                error.response?.data?.message ||
                "Error eliminando la rifa";

            throw new Error(backendMessage);
        }
    }


    async regenerateTickets(raffleId: number, newDigits: number, token: string): Promise<void> {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle/${raffleId}/regenerate-tickets/${newDigits}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error: any) {
            const backendMessage =
                error.response?.data?.message ||
                "Error regenerando los tickets";
            throw new Error(backendMessage);
        }

    }

    async activateRaffle(id: number, token: string): Promise<void> {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle/${id}/activate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

}
