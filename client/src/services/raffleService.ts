import { Raffle } from "@/type/Raffle";
import axios from "axios";


export class RaffleService {
    async getAllRaffles(token?: string): Promise<Raffle[]> {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle`);
        return res.data;
    }
    async getRaffleById(id: number, token: string): Promise<Raffle> {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
         return res.data;
    }

}
