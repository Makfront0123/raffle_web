import { Providers } from "@/type/Providers";
import { api } from "@/api/api";
export class ProviderService {
  async getAllProviders(): Promise<Providers[]> {
    const res = await api.get<Providers[]>("/api/providers");
    return res.data;
  }

  async getProviderById(id: number): Promise<Providers> {
    const res = await api.get<Providers>(`/api/providers/${id}`);
    return res.data;
  }

  async createProvider(provider: Providers): Promise<Providers> {
    const res = await api.post<Providers>("/api/providers", provider);
    return res.data;
  }

  async updateProvider(id: number, provider: Providers): Promise<Providers> {
    const res = await api.put<Providers>(`/api/providers/${id}`, provider);
    return res.data;
  }

  async deleteProvider(id: number): Promise<void> {
    await api.delete(`/api/providers/${id}`);
  }
}