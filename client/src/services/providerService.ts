import { Providers } from "@/type/Providers";
import { api } from "@/api/api";
import { AxiosError } from "axios";

export class ProviderService {
  private handleError(error: unknown, defaultMessage: string): never {
    let backendMessage = defaultMessage;

    if (error && typeof error === "object" && "response" in error) {
      const err = error as AxiosError<{ message?: string }>;
      backendMessage = err.response?.data?.message || err.message || defaultMessage;
    } else if (error instanceof Error) {
      backendMessage = error.message;
    }

    throw new Error(backendMessage);
  }

  async getAllProviders(): Promise<Providers[]> {
    try {
      const res = await api.get<Providers[]>("/api/providers");
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error obteniendo los proveedores");
    }
  }

  async getProviderById(id: number): Promise<Providers> {
    try {
      const res = await api.get<Providers>(`/api/providers/${id}`);
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error obteniendo el proveedor");
    }
  }

  async createProvider(provider: Providers): Promise<Providers> {
    try {
      const res = await api.post<Providers>("/api/providers", provider);
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error creando el proveedor");
    }
  }

  async updateProvider(id: number, provider: Providers): Promise<Providers> {
    try {
      const res = await api.put<Providers>(`/api/providers/${id}`, provider);
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error actualizando el proveedor");
    }
  }

  async deleteProvider(id: number): Promise<void> {
    try {
      await api.delete(`/api/providers/${id}`);
    } catch (error: unknown) {
      return this.handleError(error, "Error eliminando el proveedor");
    }
  }
}
