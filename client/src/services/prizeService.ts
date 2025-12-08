import axios from "axios";
import { Prizes, CreatePrizeDTO } from "@/type/Prizes";
import { Winner } from "@/type/Winner";

interface BackendResponse<T = any> {
  message: string;
  data: T;
}

export class PrizeService {
  async getAllPrizes(): Promise<Prizes[]> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes`);
    return res.data;
  }

  async getPrizeById(id: number, token: string): Promise<Prizes> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async createPrize(prize: CreatePrizeDTO, token: string): Promise<BackendResponse<Prizes>> {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes`, prize, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async updatePrize(id: number, prize: Partial<Prizes>, token: string): Promise<BackendResponse<Prizes>> {
    const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/${id}`, prize, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  // ⭐ GANADORES DE PREMIOS
  async getWinners(): Promise<Winner[]> {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/winners`

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching winners");
    return await response.json();
  }

  // ⭐ GANADOR PRINCIPAL DE LA RIFA
  async getWinner(raffleId: number): Promise<Winner | null> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/${raffleId}/winner`
    );
    if (!response.ok) throw new Error("Error fetching winner");
    return await response.json();
  }

  async deletePrize(id: number, token: string): Promise<BackendResponse<void>> {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}
