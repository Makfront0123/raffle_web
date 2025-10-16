import { create } from "zustand";

import { PrizeService } from "@/services/prizeService";
import { Prizes } from "@/type/Prizes";

export const usePrizeStore = create<PrizeStore>()((set) => ({
    prizes: [],
    setPrizes: (prizes: Prizes[]) => set({ prizes }),
    getPrizes: async (token: string) => {
        const prizeService = new PrizeService();
        const prizes = await prizeService.getAllPrizes(token);
        set({ prizes });
    },
    getPrizeById: async (id: number, token: string) => {
        const prizeService = new PrizeService();
        const prize = await prizeService.getPrizeById(id, token);
        set({ prizes: [prize] });
    },
}));

interface PrizeStore {
    prizes: Prizes[];
    setPrizes: (prizes: Prizes[]) => void;
    getPrizes: (token: string) => Promise<void>;
    getPrizeById: (id: number, token: string) => Promise<void>;
}