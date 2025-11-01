import { create } from "zustand";

import { RaffleService } from "@/services/raffleService";
import { Raffle } from "@/type/Raffle";
import { toast } from "sonner";



export const useRaffleStore = create<RaffleStore>()((set) => ({
    raffles: [],
    setRaffles: (raffles: Raffle[]) => set({ raffles }),
    getRaffles: async (token: string) => {
        const raffleService = new RaffleService();
        const raffles = await raffleService.getAllRaffles(token);
        set({ raffles });
    },
    getRaffleById: async (id: number, token: string) => {
        const raffleService = new RaffleService();
        const raffle = await raffleService.getRaffleById(id, token);
        set({ raffles: [raffle] });
    },
    addRaffle: async (raffle: Raffle, token: string) => {
        try {
            const raffleService = new RaffleService();
            const created = await raffleService.createRaffle(raffle, token);
            set((state) => ({ raffles: [...state.raffles, created] }));
            toast.success("Rifa creada correctamente");
        } catch (err: any) {
            toast.error("Error creando rifa");
            console.error(err);
        }
    },
    deleteRaffle: async (id: number, token: string) => {
        try {
            const raffleService = new RaffleService();
            await raffleService.deleteRaffle(id, token);
            toast.success("Rifa eliminada correctamente");
        } catch (err: any) {
            toast.error("Error eliminando rifa");
            console.error(err);
        }
    },
    regenerateTickets: async (id: number, newDigits: number, token: string) => {
        try {
            const raffleService = new RaffleService();
            await raffleService.regenerateTickets(id, newDigits, token);
            toast.success('Tickets regenerados correctamente');
        } catch (err: any) {
            toast.error("Error regenerando tickets");
            console.error(err);
        }
    },

    activateRaffle: async (id: number, token: string) => {
        try {
            const raffleService = new RaffleService();
            await raffleService.activateRaffle(id, token);
            toast.success('La rifa se ha activado correctamente');
        } catch (err: any) {
            toast.error("Error activando la rifa");
            console.error(err);
        }
    }
}));

interface RaffleStore {
    raffles: Raffle[];
    setRaffles: (raffles: Raffle[]) => void;
    getRaffles: (token: string) => Promise<void>;
    getRaffleById: (id: number, token: string) => Promise<void>;
    addRaffle: (raffle: Raffle, token: string) => Promise<void>;
    deleteRaffle: (id: number, token: string) => Promise<void>;
    regenerateTickets: (id: number, newDigits: number, token: string) => Promise<void>;
    activateRaffle: (id: number, token: string) => Promise<void>;
}