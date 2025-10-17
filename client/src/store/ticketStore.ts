import { create } from "zustand";
import { TicketService } from "@/services/ticketService";
import { Ticket } from "@/type/Ticket";

interface TicketStore {
    tickets: Ticket[];
    soldPercentage: number;
    setTickets: (tickets: Ticket[]) => void;
    getSoldPercentage: (raffleId: number, token: string) => Promise<void>;
}

export const useTicketStore = create<TicketStore>()((set) => ({
    tickets: [],
    soldPercentage: 0,

    setTickets: (tickets: Ticket[]) => set({ tickets }),

    getSoldPercentage: async (raffleId: number, token: string) => {
        try {

            const { soldPercentage } = await TicketService.getSoldPercentage(raffleId, token);
            set({ soldPercentage: soldPercentage ?? 0 });

        } catch (error) {
            console.error("Error al obtener el porcentaje vendido:", error);
        }
    },
}));
