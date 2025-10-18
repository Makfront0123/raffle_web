import { create } from "zustand";

import { RaffleService } from "@/services/raffleService";
import { Raffle } from "@/type/Raffle";



export const useRaffleStore = create<RaffleStore>()((set) => ({
    raffles: [],
    setRaffles: (raffles: Raffle[]) => set({ raffles }),
    getRaffles: async (token: string) => {
        const raffleService = new RaffleService();
        const raffles = await raffleService.getAllRaffles(token);
        set({ raffles });
    },
    getRaffleById: async (id: number, token: string) => {
        const raffleService = new RaffleService();
        const raffle = await raffleService.getRaffleById(id, token);
        set({ raffles: [raffle] });
    },
}));

interface RaffleStore {
    raffles: Raffle[];
    setRaffles: (raffles: Raffle[]) => void;
    getRaffles: (token: string) => Promise<void>;
    getRaffleById: (id: number, token: string) => Promise<void>;
}