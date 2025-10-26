import { create } from "zustand";
import { PrizeService } from "@/services/prizeService";
import { Prizes, CreatePrizeDTO } from "@/type/Prizes";

interface PrizeStore {
  prizes: Prizes[];
  setPrizes: (prizes: Prizes[]) => void;
  getPrizes: (token: string) => Promise<void>;
  getPrizeById: (id: number, token: string) => Promise<void>;
  addPrize: (prize: CreatePrizeDTO, token: string) => Promise<void>;
  updatePrize: (id: number, prize: Prizes, token: string) => Promise<void>;
}

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

  addPrize: async (prize: CreatePrizeDTO, token: string) => {
    try {
      const prizeService = new PrizeService();
      const created = await prizeService.createPrize(prize, token);
      set((state) => ({ prizes: [...state.prizes, created] }));
    } catch (err: any) {
      console.error(err);
    }
  },

  updatePrize: async (id: number, prize: Prizes, token: string) => {
    try {
      const prizeService = new PrizeService();
      const updated = await prizeService.updatePrize(id, prize, token);
      set((state) => ({
        prizes: state.prizes.map((p) => (p.id === updated.id ? updated : p)),
      }));
    } catch (err: any) {
      console.error(err);
    }
  },
}));
