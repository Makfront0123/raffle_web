import { create } from "zustand";

import { Prizes, CreatePrizeDTO } from "@/type/Prizes";
import { Winner } from "@/type/Winner";
import { PrizeService } from "@/services/prizeService";
import { RaffleService } from "@/services/raffleService";
import { toast } from "sonner";


interface PrizeStore {
  prizes: Prizes[];
  winners: Winner[];
  winner: Winner | null;
  setPrizes: (prizes: Prizes[]) => void;
  setWinners: (winners: Winner[]) => void;
  getWinner: (raffleId: number | "all") => Promise<void>;
  getPrizes: () => Promise<void>;
  getPrizeById: (id: number, token: string) => Promise<void>;
  addPrize: (prize: CreatePrizeDTO, token: string) => Promise<void>;
  updatePrize: (id: number, prize: Prizes, token: string) => Promise<void>;
  getWinners: () => Promise<void>;
  deletePrize: (id: number, token: string) => Promise<void>;
}

export const usePrizeStore = create<PrizeStore>()((set) => ({
  prizes: [],
  winners: [],
  winner: null,

  setPrizes: (prizes: Prizes[]) => set({ prizes }),
  setWinners: (winners: Winner[]) => set({ winners }),

  getWinner: async (raffleId: number | "all",) => {
    try {
      const prizeService = new PrizeService();
      let winner: Winner | null = null;

      if (raffleId === "all") {
        const raffleService = new RaffleService();
        const rafflesRes = await raffleService.getAllRaffles();
        for (const r of rafflesRes) {
          const rWinner = await prizeService.getWinner(r.id);
          winner = winner || rWinner;
        }
      } else {
        winner = await prizeService.getWinner(raffleId);
      }

      set({ winner });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Error obteniendo premio");
    }
  },

  getPrizes: async () => {
    try {
      const prizeService = new PrizeService();
      const prizes = await prizeService.getAllPrizes();
      set({ prizes });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Error obteniendo premios");
    }
  },

  getPrizeById: async (id: number, token: string) => {
    try {
      const prizeService = new PrizeService();
      const prize = await prizeService.getPrizeById(id, token);
      set({ prizes: [prize] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Error obteniendo premio");
    }
  },

  addPrize: async (prize: CreatePrizeDTO, token: string) => {
    try {
      const prizeService = new PrizeService();
      const res = await prizeService.createPrize(prize, token); // ahora devuelve message + data
      set((state) => ({ prizes: [...state.prizes, res.data] }));
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Error creando premio");
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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Error actualizando premio");
    }
  },

 getWinners: async () => {
  try {
    const prizeService = new PrizeService();
    const winners = await prizeService.getWinners();
    set({ winners });
  } catch (err: any) {
    toast.error(err?.message || "Error obteniendo ganadores");
  }
},


  deletePrize: async (id: number, token: string) => {
    try {
      const prizeService = new PrizeService();
      const res = await prizeService.deletePrize(id, token); // ahora devuelve message
      set((state) => ({ prizes: state.prizes.filter((p) => p.id !== id) }));
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Error eliminando premio");
    }
  },
}));
