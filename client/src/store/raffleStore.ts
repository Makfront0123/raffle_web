import { create } from "zustand";
import { RaffleService } from "@/services/raffleService";
import { Raffle } from "@/type/Raffle";
import { toast } from "sonner";

export const useRaffleStore = create<RaffleStore>()((set, get) => ({
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

        set((state) => ({
            raffles: state.raffles.some(r => r.id === id)
                ? state.raffles.map(r => (r.id === id ? raffle : r))
                : [...state.raffles, raffle],
        }));

        return raffle; // ✅ <- Devuelve la rifa obtenida
    },

    addRaffle: async (raffle: Raffle, token: string) => {
        try {
            const raffleService = new RaffleService();
            const created = await raffleService.createRaffle(raffle, token);
            set((state) => ({ raffles: [...state.raffles, created] }));
            toast.success("Rifa creada correctamente");
            return created;
        } catch (err: any) {
            toast.error("Error creando rifa");
            console.error(err);
            throw err;
        }
    },

    deleteRaffle: async (id: number, token: string) => {
        try {
            const raffleService = new RaffleService();
            await raffleService.deleteRaffle(id, token);
            set((state) => ({
                raffles: state.raffles.filter((r) => r.id !== id),
            }));
            toast.success("Rifa eliminada correctamente");
            return true;
        } catch (err: any) {
            // ✅ Aquí mostramos el mensaje del backend (por ejemplo: "Solo se pueden eliminar rifas con estado 'ended'...")
            toast.error(err.message || "Error eliminando la rifa");
            console.error("Error al eliminar la rifa:", err);
            return false;
        }
    },



    regenerateTickets: async (id: number, newDigits: number, token: string) => {
        try {
            const raffleService = new RaffleService();
            await raffleService.regenerateTickets(id, newDigits, token);
            toast.success("Tickets regenerados correctamente");
            return true;
        } catch (err: any) {
            toast.error(err.message || "Error regenerando tickets");
            return false;
        }
    },

    activateRaffle: async (id: number, token: string) => {
        try {
            const raffleService = new RaffleService();
            await raffleService.activateRaffle(id, token);
            toast.success("La rifa se ha activado correctamente");
        } catch (err: any) {
            toast.error("Error activando la rifa");
            console.error(err);
        }
    },

    updateRaffle: async (id: number, raffle: Partial<Raffle>, token: string) => {
        try {
            const raffleService = new RaffleService();
            const updated = await raffleService.updateRaffle(id, raffle, token);
            set((state) => ({
                raffles: state.raffles.map((r) =>
                    r.id === id ? { ...r, ...updated } : r
                ),
            }));
            toast.success("Rifa actualizada correctamente");
            return updated;
        } catch (err: any) {
            toast.error("Error actualizando la rifa");
            console.error(err);
            throw err;
        }
    },
}));

interface RaffleStore {
    raffles: Raffle[];
    setRaffles: (raffles: Raffle[]) => void;
    getRaffles: (token: string) => Promise<void>;
    getRaffleById: (id: number, token: string) => Promise<Raffle>;
    addRaffle: (raffle: Raffle, token: string) => Promise<Raffle>;
    deleteRaffle: (id: number, token: string) => Promise<boolean>;
    regenerateTickets: (id: number, newDigits: number, token: string) => Promise<boolean>;
    activateRaffle: (id: number, token: string) => Promise<void>;
    updateRaffle: (id: number, raffle: Partial<Raffle>, token: string) => Promise<Raffle>;
}
