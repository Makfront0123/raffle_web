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
    }
}));

interface RaffleStore {
    raffles: Raffle[];
    setRaffles: (raffles: Raffle[]) => void;
    getRaffles: (token: string) => Promise<void>;
    getRaffleById: (id: number, token: string) => Promise<void>;
    addRaffle: (raffle: Raffle, token: string) => Promise<void>;
}