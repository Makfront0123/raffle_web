import { CreateRaffleDTO, DashboardData, Raffle, UpdateRafflePayload } from "@/type/Raffle";
import { api } from "@/api/api";

export class RaffleService {
  async getAllRaffles(): Promise<Raffle[]> {
    const res = await api.get<Raffle[]>("/api/raffle");
    return res.data;
  }

  async getRaffleById(id: number): Promise<Raffle> {
    const res = await api.get<Raffle>(`/api/raffle/${id}`);
    return res.data;
  }

  async createRaffle(data: CreateRaffleDTO): Promise<Raffle> {
    const res = await api.post<Raffle>("/api/raffle", data);
    return res.data;
  }

  async updateRaffle(id: number, data: UpdateRafflePayload): Promise<Raffle> {
    const res = await api.patch<Raffle>(`/api/raffle/${id}`, data);
    return res.data;
  }

  async deleteRaffle(id: number): Promise<void> {
    await api.delete(`/api/raffle/${id}`);
  }

  async regenerateTickets(raffleId: number, newDigits: number): Promise<void> {
    await api.put(`/api/raffle/${raffleId}/regenerate-tickets/${newDigits}`);
  }

  async activateRaffle(id: number): Promise<void> {
    await api.put(`/api/raffle/${id}/activate`);
  }

  async deactivateRaffle(id: number): Promise<void> {
    await api.put(`/api/raffle/${id}/deactivate`);
  }

  async getDashboardData(): Promise<DashboardData> {
    const res = await api.get<DashboardData>("/api/raffle/dashboard");
    return res.data;
  }
}