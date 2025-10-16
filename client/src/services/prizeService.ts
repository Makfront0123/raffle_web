
import { Prizes } from "@/type/Prizes";
import axios from "axios";

export class PrizeService {
    async getAllPrizes(token: string): Promise<Prizes[]> {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prize`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
    async getPrizeById(id: number, token: string): Promise<Prizes> {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prize/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
}