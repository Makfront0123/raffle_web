import { create } from "zustand";

import { Prizes, CreatePrizeDTO } from "@/type/Prizes";
import { Winner } from "@/type/Winner";
import { PrizeService } from "@/services/prizeService";
import { RaffleService } from "@/services/raffleService";
import { toast } from "sonner";


interface PrizeStore {
  prizes: Prizes[];
  winners: Winner[];
  setPrizes: (prizes: Prizes[]) => void;
  setWinners: (winners: Winner[]) => void;

  getPrizes: (token: string) => Promise<void>;
  getPrizeById: (id: number, token: string) => Promise<void>;
  addPrize: (prize: CreatePrizeDTO, token: string) => Promise<void>;
  updatePrize: (id: number, prize: Prizes, token: string) => Promise<void>;
  getWinners: (raffleId: number | "all", token: string) => Promise<void>;
  deletePrize: (id: number, token: string) => Promise<void>;
}

export const usePrizeStore = create<PrizeStore>()((set) => ({
  prizes: [],
  winners: [],

  setPrizes: (prizes: Prizes[]) => set({ prizes }),
  setWinners: (winners: Winner[]) => set({ winners }),

  getPrizes: async (token: string) => {
    try {
      const prizeService = new PrizeService();
      const prizes = await prizeService.getAllPrizes(token);
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

  getWinners: async (raffleId: number | "all", token: string) => {
    try {
      const prizeService = new PrizeService();
      let winners: Winner[] = [];

      if (raffleId === "all") {
        const raffleService = new RaffleService();
        const rafflesRes = await raffleService.getAllRaffles(token);
        for (const r of rafflesRes) {
          const rWinners = await prizeService.getWinners(r.id, token);
          winners = winners.concat(rWinners);
        }
      } else {
        winners = await prizeService.getWinners(raffleId, token);
      }

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
