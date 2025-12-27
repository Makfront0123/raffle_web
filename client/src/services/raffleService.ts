import { CreateRaffleDTO, Raffle, UpdateRafflePayload } from "@/type/Raffle";
import axios, { AxiosError } from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle`;

interface BackendError {
    message: string;
    status?: number;
    data?: any;
}

export class RaffleService {
    private handleError(error: unknown, defaultMessage: string): never {
        let backendMessage = defaultMessage;
        let status: number | undefined;
        let data: any;

        if (axios.isAxiosError(error)) {
            backendMessage = error.response?.data?.message || error.message || defaultMessage;
            status = error.response?.status;
            data = error.response?.data;
            console.error("Backend error:", error.response?.data || error.message);
        } else if (error instanceof Error) {
            backendMessage = error.message;
            console.error("Backend error:", error.message);
        } else {
            console.error("Backend error:", error);
        }

        throw { message: backendMessage, status, data } as BackendError;
    }

    async getAllRaffles(): Promise<Raffle[]> {
        try {
            const res = await axios.get<Raffle[]>(API_URL);
            return res.data;
        } catch (error: unknown) {
            return this.handleError(error, "Error obteniendo las rifas");
        }
    }

    async getRaffleById(id: number, token: string): Promise<Raffle> {
        try {
            const res = await axios.get<Raffle>(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error: unknown) {
            return this.handleError(error, "Error obteniendo la rifa");
        }
    }

    async createRaffle(data: CreateRaffleDTO, token: string): Promise<Raffle> {
        const res = await axios.post<Raffle>(API_URL, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    }

    async updateRaffle(id: number, data: UpdateRafflePayload, token: string): Promise<Raffle> {
        const res = await axios.patch<Raffle>(`${API_URL}/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    }


    async deleteRaffle(id: number, token: string): Promise<void> {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error: unknown) {
            return this.handleError(error, "Error eliminando la rifa");
        }
    }

    async regenerateTickets(raffleId: number, newDigits: number, token: string): Promise<void> {
        try {
            await axios.put(`${API_URL}/${raffleId}/regenerate-tickets/${newDigits}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error: unknown) {
            return this.handleError(error, "Error regenerando los tickets");
        }
    }

    async activateRaffle(id: number, token: string): Promise<void> {
        try {
            await axios.put(`${API_URL}/${id}/activate`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error: unknown) {
            return this.handleError(error, "Error activando la rifa");
        }
    }

    async deactivateRaffle(id: number, token: string): Promise<void> {
        try {
            await axios.put(`${API_URL}/${id}/deactivate`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error: unknown) {
            return this.handleError(error, "Error desactivando la rifa");
        }
    }
}
