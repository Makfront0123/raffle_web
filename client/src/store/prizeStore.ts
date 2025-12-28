import { create } from "zustand";
import { Prizes, CreatePrizeDTO } from "@/type/Prizes";
import { Winner } from "@/type/Winner";
import { PrizeService } from "@/services/prizeService";
import { toast } from "sonner";

interface PrizeStore {
  prizes: Prizes[];
  winners: Winner[];
  winner: Winner | null;
  setPrizes: (prizes: Prizes[]) => void;
  setWinners: (winners: Winner[]) => void;

  getPrizes: () => Promise<void>;
  getPrizeById: (id: number, token: string) => Promise<void>;
  addPrize: (prize: CreatePrizeDTO, token: string) => Promise<void>;
  updatePrize: (id: number, prize: Prizes, token: string) => Promise<void>;
  getWinnersByRaffle: (raffleId: number) => Promise<void>;
  getWinners: () => Promise<void>;
  deletePrize: (id: number, token: string) => Promise<void>;
}

const isAxiosError = (err: unknown): err is { response?: { data?: { message?: string } }; message: string } => {
  return typeof err === "object" && err !== null && "message" in err;
};

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
      toast.error(isAxiosError(err) ? err.response?.data?.message || err.message : "Error obteniendo premios");
    }
  },

  getPrizeById: async (id: number, token: string) => {
    try {
      const prizeService = new PrizeService();
      const prize = await prizeService.getPrizeById(id, token);
      set({ prizes: [prize] });
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.response?.data?.message || err.message : "Error obteniendo premio");
    }
  },

  addPrize: async (prize: CreatePrizeDTO, token: string) => {
    try {
      const prizeService = new PrizeService();
      const res = await prizeService.createPrize(prize, token);
      set((state) => ({ prizes: [...state.prizes, res.data] }));
      toast.success(res.message);
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.response?.data?.message || err.message : "Error creando premio");
    }
  },

  updatePrize: async (id: number, prize: Prizes, token: string) => {
    try {
      const prizeService = new PrizeService();
      const res = await prizeService.updatePrize(id, prize, token);
      set((state) => ({
        prizes: state.prizes.map((p) => (p.id === res.data.id ? res.data : p)),
      }));
      toast.success(res.message);
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.response?.data?.message || err.message : "Error actualizando premio");
    }
  },

  getWinnersByRaffle: async (raffleId: number) => {
    try {
      const prizeService = new PrizeService();
      const winners = await prizeService.getWinnersByRaffle(raffleId);
      set({ winners });
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.message : "Error obteniendo ganadores");
    }
  },

  getWinners: async () => {
    try {
      const prizeService = new PrizeService();
      const winners = await prizeService.getWinners();
      set({ winners });
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.message : "Error obteniendo ganadores");
    }
  },

  deletePrize: async (id: number, token: string) => {
    try {
      const prizeService = new PrizeService();
      const res = await prizeService.deletePrize(id, token);
      set((state) => ({ prizes: state.prizes.filter((p) => p.id !== id) }));
      toast.success(res.message);
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.response?.data?.message || err.message : "Error eliminando premio");
    }
  },
}));
