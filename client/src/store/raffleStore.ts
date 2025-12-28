"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { RaffleService } from "@/services/raffleService";
import { Raffle, CreateRaffleDTO, UpdateRafflePayload } from "@/type/Raffle";

interface RaffleStore {
  raffles: Raffle[];
  setRaffles: (raffles: Raffle[]) => void;
  getRaffles: () => Promise<void>;
  getRaffleById: (id: number, token: string) => Promise<Raffle>;
  addRaffle: (raffle: CreateRaffleDTO, token: string) => Promise<Raffle>;
  deleteRaffle: (id: number, token: string) => Promise<boolean>;
  regenerateTickets: (id: number, newDigits: number, token: string) => Promise<boolean>;
  activateRaffle: (id: number, token: string) => Promise<void>;
  updateRaffle: (id: number, data: UpdateRafflePayload, token: string) => Promise<Raffle>;
  deactivateRaffle: (id: number, token: string) => Promise<void>;
}

const getErrorMessage = (err: unknown): string => {
  if (typeof err === "object" && err !== null && "message" in err) {
    return (err as { message: string }).message;
  }
  return "Error desconocido";
};

export const useRaffleStore = create<RaffleStore>()((set) => ({
  raffles: [],

  setRaffles: (raffles) => set({ raffles }),

  getRaffles: async () => {
    try {
      const raffleService = new RaffleService();
      const raffles = await raffleService.getAllRaffles();
      set({ raffles });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      console.error(err);
    }
  },

  getRaffleById: async (id, token) => {
    try {
      const raffleService = new RaffleService();
      const raffle = await raffleService.getRaffleById(id, token);

      set((state) => ({
        raffles: state.raffles.some(r => r.id === id)
          ? state.raffles.map(r => (r.id === id ? raffle : r))
          : [...state.raffles, raffle],
      }));

      return raffle;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      console.error(err);
      throw err;
    }
  },

  addRaffle: async (raffle: CreateRaffleDTO, token: string) => {
    console.log("🔍 raffle:", raffle);
    try {
      const raffleService = new RaffleService();
      const created = await raffleService.createRaffle(raffle, token);
      set((state) => ({ raffles: [...state.raffles, created] }));
      toast.success("Rifa creada correctamente");
      console.log("🔍 created:", created);
      return created;
    } catch (err: unknown) {
      const msg = typeof err === "object" && err !== null && "message" in err
        ? (err as { message: string }).message
        : "Error creando rifa";
      toast.error(msg);
      console.error(err);
      throw err;
    }
  }
  ,
  updateRaffle: async (id, data, token) => {
    try {
      const raffleService = new RaffleService();
      const updated = await raffleService.updateRaffle(id, data, token);

      set((state) => ({
        raffles: state.raffles.map(r => (r.id === id ? updated : r)),
      }));
      toast.success("Rifa actualizada correctamente");

      return updated;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error actualizando la rifa");
      console.error(err);
      throw err;
    }
  },

  deleteRaffle: async (id, token) => {
    try {
      const raffleService = new RaffleService();
      await raffleService.deleteRaffle(id, token);

      set((state) => ({
        raffles: state.raffles.filter(r => r.id !== id),
      }));
      toast.success("Rifa eliminada correctamente");
      return true;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error eliminando la rifa");
      console.error(err);
      return false;
    }
  },

  regenerateTickets: async (id, newDigits, token) => {
    try {
      const raffleService = new RaffleService();
      await raffleService.regenerateTickets(id, newDigits, token);
      toast.success("Tickets regenerados correctamente");
      return true;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error regenerando tickets");
      console.error(err);
      return false;
    }
  },

  activateRaffle: async (id, token) => {
    try {
      const raffleService = new RaffleService();
      await raffleService.activateRaffle(id, token);
      toast.success("La rifa se ha activado correctamente");
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error activando la rifa");
      console.error(err);
    }
  },

  deactivateRaffle: async (id, token) => {
    try {
      const raffleService = new RaffleService();
      await raffleService.deactivateRaffle(id, token);
      toast.success("La rifa se ha desactivado correctamente");
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error desactivando la rifa");
      console.error(err);
    }
  },
}));
