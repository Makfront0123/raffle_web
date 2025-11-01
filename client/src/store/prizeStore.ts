import { create } from "zustand";
import { PrizeService } from "@/services/prizeService";
import { Prizes, CreatePrizeDTO } from "@/type/Prizes";
import { Winner } from "@/type/Winner";
import { RaffleService } from "@/services/raffleService";

interface PrizeStore {
  prizes: Prizes[];
  winners: Winner[]; // ✅ nuevo estado
  setPrizes: (prizes: Prizes[]) => void;
  setWinners: (winners: Winner[]) => void; // ✅ nuevo setter
  getPrizes: (token: string) => Promise<void>;
  getPrizeById: (id: number, token: string) => Promise<void>;
  addPrize: (prize: CreatePrizeDTO, token: string) => Promise<void>;
  updatePrize: (id: number, prize: Prizes, token: string) => Promise<void>;
  getWinners: (raffleId: number | "all", token: string) => Promise<void>;
}

export const usePrizeStore = create<PrizeStore>()((set) => ({
  prizes: [],
  winners: [], // ✅ inicializamos

  setPrizes: (prizes: Prizes[]) => set({ prizes }),
  setWinners: (winners: Winner[]) => set({ winners }), // ✅

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

  getWinners: async (raffleId: number | "all", token: string): Promise<void> => {
    try {
      const prizeService = new PrizeService();
      let winners: Winner[] = [];

      if (raffleId === "all") {
        const raffleService = new RaffleService();
        const rafflesRes = await raffleService.getAllRaffles(token); // Trae todas las rifas

        for (const r of rafflesRes) {
          const rWinners = await prizeService.getWinners(r.id, token);
          winners = winners.concat(rWinners);
        }
      } else {
        winners = await prizeService.getWinners(raffleId, token);
      }


      set({ winners });
    } catch (err: any) {
      console.error(err);
    }
  }


}));
