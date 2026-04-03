"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RaffleService } from "@/services/raffleService";
import { Raffle, CreateRaffleDTO, UpdateRafflePayload, DashboardData } from "@/type/Raffle";

interface RaffleStore {
  raffles: Raffle[];
  dashboardData: DashboardData | null;
  setRaffles: (raffles: Raffle[]) => void;
  getRaffles: () => Promise<void>;
  getRaffleById: (id: number) => Promise<Raffle>;
  addRaffle: (raffle: CreateRaffleDTO) => Promise<Raffle>;
  updateRaffle: (id: number, data: UpdateRafflePayload) => Promise<Raffle>;
  deleteRaffle: (id: number) => Promise<boolean>;
  regenerateTickets: (id: number, newDigits: number) => Promise<boolean>;
  activateRaffle: (id: number) => Promise<void>;
  deactivateRaffle: (id: number) => Promise<void>;
  getDashboardData: () => Promise<void>;
}

export const useRaffleStore = create<RaffleStore>()(
  persist(
    (set, get) => ({
      raffles: [],
      dashboardData: null,

      setRaffles: (raffles) => set({ raffles }),

      getRaffles: async () => {
        try {
          const raffleService = new RaffleService();
          const raffles = await raffleService.getAllRaffles();
          set({ raffles });
        } catch (err) {
          throw err;
        }
      },

      getRaffleById: async (id) => {
        try {
          const raffleService = new RaffleService();
          const raffle: Raffle = await raffleService.getRaffleById(id);

          set((state) => ({
            raffles: state.raffles.some((r) => r.id === id)
              ? state.raffles.map((r) => (r.id === id ? raffle : r))
              : [...state.raffles, raffle],
          }));

          return raffle;
        } catch (err) {
          throw err;
        }
      },

      addRaffle: async (raffle: CreateRaffleDTO) => {
        try {
          const raffleService = new RaffleService();
          const created: Raffle = await raffleService.createRaffle(raffle);
          set((state) => ({ raffles: [...state.raffles, created] }));
          return created;
        } catch (err: unknown) {
          throw err;
        }
      },


      updateRaffle: async (id, data) => {
        try {
          const raffleService = new RaffleService();
          const updated = await raffleService.updateRaffle(id, data);

          set((state) => ({
            raffles: state.raffles.map((r) =>
              r.id === id ? updated : r
            ),
          }));

          return updated;
        } catch (err) {
          throw err;
        }
      },

      deleteRaffle: async (id) => {
        try {
          const raffleService = new RaffleService();
          await raffleService.deleteRaffle(id);

          set((state) => ({
            raffles: state.raffles.filter((r) => r.id !== id),
          }));

          return true;
        } catch (err) {
          throw err;
        }
      },

      regenerateTickets: async (id, newDigits) => {
        try {
          const raffleService = new RaffleService();
          await raffleService.regenerateTickets(id, newDigits);
          return true;
        } catch (err) {
          throw err;
        }
      },

      activateRaffle: async (id) => {
        try {
          const raffleService = new RaffleService();
          await raffleService.activateRaffle(id);
        } catch (err) {
          throw err;
        }
      },

      deactivateRaffle: async (id) => {
        try {
          const raffleService = new RaffleService();
          await raffleService.deactivateRaffle(id);
        } catch (err) {
          throw err;
        }
      },
      getDashboardData: async () => {
        try {
          const raffleService = new RaffleService();
          const data = await raffleService.getDashboardData();
          set({ dashboardData: data });
        } catch (err) {
          throw err;
        }
      },
    }),
    {
      name: "raffle-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        raffles: state.raffles,
      }),
    }
  )
);