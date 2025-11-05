
import { Providers } from "@/type/Providers";
import axios from "axios";

export class ProviderService {
    async getAllProviders(token: string): Promise<Providers[]> {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }

    async getProviderById(id: number, token: string): Promise<Providers> {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
    async createProvider(provider: Providers, token: string): Promise<Providers> {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers`, provider, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
    async updateProvider(id: number, provider: Providers, token: string): Promise<Providers> {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers/${id}`, provider, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
    async deleteProvider(id: number, token: string): Promise<void> {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/providers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });


            return res.data;
        } catch (error: any) {

            const backendMessage =
                error.response?.data?.message ||
                "Error eliminando el proveedor";

            throw new Error(backendMessage);

        }
    }
}