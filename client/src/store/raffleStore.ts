"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { RaffleService } from "@/services/raffleService";
import { Raffle, CreateRaffleDTO, UpdateRafflePayload } from "@/type/Raffle";

interface RaffleStore {
  raffles: Raffle[];
  setRaffles: (raffles: Raffle[]) => void;
  getRaffles: () => Promise<void>;
  getRaffleById: (id: number) => Promise<Raffle>;
  addRaffle: (raffle: CreateRaffleDTO) => Promise<Raffle>;
  updateRaffle: (id: number, data: UpdateRafflePayload) => Promise<Raffle>;
  deleteRaffle: (id: number) => Promise<boolean>;
  regenerateTickets: (id: number, newDigits: number) => Promise<boolean>;
  activateRaffle: (id: number) => Promise<void>;
  deactivateRaffle: (id: number) => Promise<void>;
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
      console.log("🔥 raffles:", raffles);
      set({ raffles });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      console.error(err);
    }
  },
  getRaffleById: async (id) => {
    try {
      const raffleService = new RaffleService();
      const raffle: Raffle = await raffleService.getRaffleById(id);

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
  addRaffle: async (raffle: CreateRaffleDTO) => {
    try {
      const raffleService = new RaffleService();
      const created: Raffle = await raffleService.createRaffle(raffle);
      set((state) => ({ raffles: [...state.raffles, created] }));
      toast.success("Rifa creada correctamente");
      return created;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      console.error(err);
      throw err;
    }
  },

  updateRaffle: async (id, data) => {
    try {
      const raffleService = new RaffleService();
      const updated: Raffle = await raffleService.updateRaffle(id, data);

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

  deleteRaffle: async (id) => {
    try {
      const raffleService = new RaffleService();
      await raffleService.deleteRaffle(id);
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
  regenerateTickets: async (id, newDigits) => {
    try {
      const raffleService = new RaffleService();
      await raffleService.regenerateTickets(id, newDigits);
      toast.success("Tickets regenerados correctamente");
      return true;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error regenerando tickets");
      console.error(err);
      return false;
    }
  },
  activateRaffle: async (id) => {
    try {
      const raffleService = new RaffleService();
      await raffleService.activateRaffle(id);
      toast.success("La rifa se ha activado correctamente");
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error activando la rifa");
      console.error(err);
    }
  },

  deactivateRaffle: async (id) => {
    try {
      const raffleService = new RaffleService();
      await raffleService.deactivateRaffle(id);
      toast.success("La rifa se ha desactivado correctamente");
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error desactivando la rifa");
      console.error(err);
    }
  },
}));
