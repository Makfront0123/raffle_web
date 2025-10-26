import { Prizes, CreatePrizeDTO } from "@/type/Prizes";
import axios from "axios";

export class PrizeService {
  async getAllPrizes(token: string): Promise<Prizes[]> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async getPrizeById(id: number, token: string): Promise<Prizes> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async createPrize(prize: CreatePrizeDTO, token: string): Promise<Prizes> {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes`, prize, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async updatePrize(id: number, prize: Partial<Prizes>, token: string): Promise<Prizes> {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prizes/${id}`, prize, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}
