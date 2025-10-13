import type { Raffle } from "@/types/Raffle";
import axios from "axios";


export class RaffleService {
  async getAllRaffles(): Promise<Raffle[]> {
    const res = await axios.get(import.meta.env.PUBLIC_BACKEND_URL + "/api/raffle");
    return res.data as Promise<Raffle[]>;
  }

  async getRaffleById(id: number, token: string): Promise<Raffle> {
    const res = await axios.get(import.meta.env.PUBLIC_BACKEND_URL + `/api/raffle/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Athorization": `Bearer ${token}`,
      },
    });
    return res.data as Promise<Raffle>;

  }
}
