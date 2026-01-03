import { CreateRaffleDTO, Raffle, UpdateRafflePayload } from "@/type/Raffle";
import { api } from "@/api/api";

const API_URL = "/api/raffle";

export interface BackendError {
  message: string;
  status?: number;
  data?: Record<string, unknown>;
}

export class RaffleService {
  private handleError(error: unknown, defaultMessage: string): never {
    let backendMessage = defaultMessage;
    let status: number | undefined;
    let data: Record<string, unknown> | undefined;

    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { data?: unknown; status?: number }; message?: string };
      const responseData = err.response?.data;
      if (typeof responseData === "object" && responseData !== null && "message" in responseData) {
        backendMessage = (responseData as any).message ?? err.message ?? defaultMessage;
      } else {
        backendMessage = err.message ?? defaultMessage;
      }
      status = err.response?.status;
      data = err.response?.data as Record<string, unknown> | undefined;
    } else if (error instanceof Error) {
      backendMessage = error.message;
    }

    throw { message: backendMessage, status, data } as BackendError;
  }

  async getAllRaffles(): Promise<Raffle[]> {
    try {
      const res = await api.get<Raffle[]>(API_URL);
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error obteniendo las rifas");
    }
  }

  async getRaffleById(id: number): Promise<Raffle> {
    try {
      const res = await api.get<Raffle>(`${API_URL}/${id}`);
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error obteniendo la rifa");
    }
  }

  async createRaffle(data: CreateRaffleDTO): Promise<Raffle> {
    try {
      const res = await api.post<Raffle>(API_URL, data);
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error creando la rifa");
    }
  }

  async updateRaffle(id: number, data: UpdateRafflePayload): Promise<Raffle> {
    try {
      const res = await api.patch<Raffle>(`${API_URL}/${id}`, data);
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error actualizando la rifa");
    }
  }

  async deleteRaffle(id: number): Promise<void> {
    try {
      await api.delete(`${API_URL}/${id}`);
    } catch (error: unknown) {
      return this.handleError(error, "Error eliminando la rifa");
    }
  }

  async regenerateTickets(raffleId: number, newDigits: number): Promise<void> {
    try {
      await api.put(`${API_URL}/${raffleId}/regenerate-tickets/${newDigits}`);
    } catch (error: unknown) {
      return this.handleError(error, "Error regenerando los tickets");
    }
  }

  async activateRaffle(id: number): Promise<void> {
    try {
      await api.put(`${API_URL}/${id}/activate`);
    } catch (error: unknown) {
      return this.handleError(error, "Error activando la rifa");
    }
  }

  async deactivateRaffle(id: number): Promise<void> {
    try {
      await api.put(`${API_URL}/${id}/deactivate`);
    } catch (error: unknown) {
      return this.handleError(error, "Error desactivando la rifa");
    }
  }
}
