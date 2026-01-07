import { api } from "@/api/api";
import { Prizes, CreatePrizeDTO } from "@/type/Prizes";
import { Winner } from "@/type/Winner";
 

interface BackendResponse<T> {
  message: string;
  data: T;
}

export class PrizeService {
  async getAllPrizes(): Promise<Prizes[]> {
    const res = await api.get("/api/prizes");
    return res.data;
  }

  async getPrizeById(id: number): Promise<Prizes> {
    const res = await api.get(`/api/prizes/${id}`);
    return res.data;
  }

  async createPrize(prize: CreatePrizeDTO): Promise<BackendResponse<Prizes>> {
    const res = await api.post("/api/prizes", prize);
    return res.data;
  }

  async updatePrize(id: number, prize: Partial<Prizes>): Promise<BackendResponse<Prizes>> {
    const res = await api.patch(`/api/prizes/${id}`, prize);
    return res.data;
  }

  async deletePrize(id: number): Promise<BackendResponse<void>> {
    const res = await api.delete(`/api/prizes/${id}`);
    return res.data;
  }

  async getWinners(): Promise<Winner[]> {
    const res = await api.get("/api/prizes/winners");
    return res.data;
  }

  async getWinnersByRaffle(raffleId: number): Promise<Winner[]> {
    const res = await api.get(`/api/prizes/${raffleId}/winners`);
    return res.data;
  }
}
