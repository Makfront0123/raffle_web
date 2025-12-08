import { create } from "zustand";
import { RaffleService } from "@/services/raffleService";
import { Raffle } from "@/type/Raffle";
import { toast } from "sonner";

export const useRaffleStore = create<RaffleStore>()((set, get) => ({
    raffles: [],
    setRaffles: (raffles: Raffle[]) => set({ raffles }),

    getRaffles: async () => {
        const raffleService = new RaffleService();
        const raffles = await raffleService.getAllRaffles();
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

    addRaffle: async (raffle: Partial<Raffle>, token: string) => {
        try {
            const raffleService = new RaffleService();

            // 🔹 Normaliza end_date -> endDate
            const payload: any = { ...raffle };
            if ('end_date' in raffle && raffle.end_date) {
                // si viene "YYYY-MM-DD"
                if (raffle.end_date.length === 10) {
                    payload.endDate = new Date(raffle.end_date + "T23:59:59").toISOString();
                } else {
                    payload.endDate = raffle.end_date;  
                }
                delete payload.end_date;
            }

            const created = await raffleService.createRaffle(payload, token);
            set((state) => ({ raffles: [...state.raffles, created] }));
            toast.success("Rifa creada correctamente");
            return created;
        } catch (err: any) {
            toast.error(err.message || "Error creando rifa");
            console.error(err);
            throw err;
        }
    }
    ,


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
            toast.error(err.message || "Error activando la rifa"); // 👈 muestra mensaje del backend
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
    deactivateRaffle: async (id: number, token: string) => {
        try {
            const raffleService = new RaffleService();
            await raffleService.deactivateRaffle(id, token);
            toast.success("La rifa se ha desactivado correctamente");
        } catch (err: any) {
            toast.error("Error desactivando la rifa");
            console.error(err);
        }
    },
}));

interface RaffleStore {
    raffles: Raffle[];
    setRaffles: (raffles: Raffle[]) => void;
    getRaffles: () => Promise<void>;
    getRaffleById: (id: number, token: string) => Promise<Raffle>;
    addRaffle: (raffle:Partial<Raffle>, token: string) => Promise<Raffle>;
    deleteRaffle: (id: number, token: string) => Promise<boolean>;
    regenerateTickets: (id: number, newDigits: number, token: string) => Promise<boolean>;
    activateRaffle: (id: number, token: string) => Promise<void>;
    updateRaffle: (id: number, raffle: Partial<Raffle>, token: string) => Promise<Raffle>;
    deactivateRaffle: (id: number, token: string) => Promise<void>;
}
