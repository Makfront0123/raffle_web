import { Raffle } from "@/type/Raffle";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle`;

export class RaffleService {
    // 🔹 Centraliza el manejo de errores del backend
    private handleError(error: any, defaultMessage: string): never {
        console.error("Backend error:", error.response?.data || error);
        const backendMessage =
            error?.response?.data?.message || error?.message || defaultMessage;

        throw {
            message: backendMessage,
            status: error?.response?.status,
            data: error?.response?.data,
        };
    }

    async getAllRaffles(token: string): Promise<Raffle[]> {
        try {
            const res = await axios.get(`${API_URL}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error: any) {
            return this.handleError(error, "Error obteniendo las rifas");
        }
    }

    async getRaffleById(id: number, token: string): Promise<Raffle> {
        try {
            const res = await axios.get(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error: any) {
            return this.handleError(error, "Error obteniendo la rifa");
        }
    }

    async createRaffle(raffle: Raffle, token: string): Promise<Raffle> {
        try {
            const res = await axios.post(`${API_URL}`, raffle, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console
            return res.data;
        } catch (error: any) {
            return this.handleError(error, "Error creando la rifa");
        }
    }
    async updateRaffle(
        id: number,
        raffle: Partial<Raffle>,
        token: string
    ): Promise<Raffle> {
        try {
            const res = await axios.patch(`${API_URL}/${id}`, raffle, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error: any) {
            return this.handleError(error, "Error actualizando la rifa");
        }
    }


    async deleteRaffle(id: number, token: string): Promise<void> {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return;
        } catch (error: any) {
            return this.handleError(error, "Error eliminando la rifa");
        }
    }



    async regenerateTickets(
        raffleId: number,
        newDigits: number,
        token: string
    ): Promise<void> {
        try {
            await axios.put(
                `${API_URL}/${raffleId}/regenerate-tickets/${newDigits}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return;
        } catch (error: any) {
            return this.handleError(error, "Error regenerando los tickets");
        }
    }

    async activateRaffle(id: number, token: string): Promise<void> {
        try {
            await axios.put(
                `${API_URL}/${id}/activate`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return;
        } catch (error: any) {
            return this.handleError(error, "Error activando la rifa");
        }
    }

    async deactivateRaffle(id: number, token: string): Promise<void> {
        try {
            await axios.put(
                `${API_URL}/${id}/deactivate`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return;
        } catch (error: any) {
            return this.handleError(error, "Error desactivando la rifa");
        }
    }
}
