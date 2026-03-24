import { create } from "zustand";
import { Prizes, CreatePrizeDTO } from "@/type/Prizes";
import { Winner } from "@/type/Winner";
import { BackendResponse, PrizeService } from "@/services/prizeService";
import { toast } from "sonner";

interface PrizeStore {
  prizes: Prizes[];
  winners: Winner[];
  winner: Winner | null;

  setPrizes: (prizes: Prizes[]) => void;
  setWinners: (winners: Winner[]) => void;

  getPrizes: () => Promise<void>;
  getPrizeById: (id: number) => Promise<void>;

  addPrize: (prize: CreatePrizeDTO) => Promise<BackendResponse<Prizes>>;
  updatePrize: (id: number, prize: Prizes) => Promise<BackendResponse<Prizes>>;
  deletePrize: (id: number) => Promise<BackendResponse<void>>;

  getWinnersByRaffle: (raffleId: number) => Promise<void>;
  getWinners: () => Promise<void>;
}


export const usePrizeStore = create<PrizeStore>()((set) => ({
  prizes: [],
  winners: [],
  winner: null,

  setPrizes: (prizes: Prizes[]) => set({ prizes }),
  setWinners: (winners: Winner[]) => set({ winners }),

  getPrizes: async () => {
    try {
      const prizeService = new PrizeService();
      const prizes = await prizeService.getAllPrizes();
      set({ prizes });
    } catch (err: unknown) {
      throw err;
    }
  },

  getPrizeById: async (id: number) => {
    try {
      const prizeService = new PrizeService();
      const prize = await prizeService.getPrizeById(id);
      set({ prizes: [prize] });
    } catch (err: unknown) {
      throw err;
    }
  },

  addPrize: async (prize: CreatePrizeDTO,) => {
    try {
      const prizeService = new PrizeService();
      const res = await prizeService.createPrize(prize);
      set((state) => ({ prizes: [...state.prizes, res.data] }));
      return res
    } catch (err: unknown) {
      throw err;
    }
  },

  updatePrize: async (id: number, prize: Prizes) => {
    try {
      const prizeService = new PrizeService();
      const res = await prizeService.updatePrize(id, prize);
      set((state) => ({
        prizes: state.prizes.map((p) => (p.id === res.data.id ? res.data : p)),
      }));
      return res
    } catch (err: unknown) {
      throw err;
    }
  },

  getWinnersByRaffle: async (raffleId: number) => {
    try {
      const prizeService = new PrizeService();
      const winners = await prizeService.getWinnersByRaffle(raffleId);
      set({ winners });
    } catch (err: unknown) {
      throw err;
    }
  },

  getWinners: async () => {
    try {
      const prizeService = new PrizeService();
      const winners = await prizeService.getWinners();
      set({ winners });
    } catch (err: unknown) {
      throw err;
    }
  },

  deletePrize: async (id: number) => {
    try {
      const prizeService = new PrizeService();
      const res = await prizeService.deletePrize(id);
      set((state) => ({ prizes: state.prizes.filter((p) => p.id !== id) }));
      return res
    } catch (err: unknown) {
      throw err;
    }
  },
}));
