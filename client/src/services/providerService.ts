import { Providers } from "@/type/Providers";
import axios, { AxiosError } from "axios";

export class ProviderService {
    async getAllProviders(token: string): Promise<Providers[]> {
        const res = await axios.get<Providers[]>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    }

    async getProviderById(id: number, token: string): Promise<Providers> {
        const res = await axios.get<Providers>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    }

    async createProvider(provider: Providers, token: string): Promise<Providers> {
        const res = await axios.post<Providers>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers`,
            provider,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    }

    async updateProvider(id: number, provider: Providers, token: string): Promise<Providers> {
        const res = await axios.put<Providers>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers/${id}`,
            provider,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    }

    async deleteProvider(id: number, token: string): Promise<void> {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const backendMessage = err.response?.data?.message || "Error eliminando el proveedor";
            throw new Error(backendMessage);
        }
    }
}