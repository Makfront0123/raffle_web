import { create } from "zustand";
 
import { RaffleService } from "@/services/raffleService";
import type { Raffle } from "@/types/Raffle";


export const useRaffleStore = create<RaffleStore>()((set) => ({
    raffles: [],
    setRaffles: (raffles: Raffle[]) => set({ raffles }),
    getRaffles: async () => {
        const raffleService = new RaffleService();
        const raffles = await raffleService.getAllRaffles();
        set({ raffles });
    },
    getRaffleById: async (id: number) => {
        const raffleService = new RaffleService();
        const raffle = await raffleService.getRaffleById(id);
        set({ raffles: [raffle] });
    },
}));

interface RaffleStore {
    raffles: Raffle[];
    setRaffles: (raffles: Raffle[]) => void;
    getRaffles: () => Promise<void>;
    getRaffleById: (id: number) => Promise<void>;
}