import { create } from "zustand";
import { TicketService } from "@/services/ticketService";
import { Ticket } from "@/type/Ticket";

interface TicketStore {
  tickets: Ticket[];
  soldPercentage: number;
  setTickets: (tickets: Ticket[]) => void;
  getSoldPercentage: (raffleId: number) => Promise<number>;
  getTickets: () => Promise<void>;
}

export const useTicketStore = create<TicketStore>()((set) => ({
  tickets: [],
  soldPercentage: 0,

  setTickets: (tickets: Ticket[]) => set({ tickets }),

  getSoldPercentage: async (raffleId: number): Promise<number> => {
    try {
      const result = await TicketService.getSoldPercentage(raffleId);
      const sold = result?.soldPercentage ?? 0;
      set({ soldPercentage: sold });
      return sold;
    } catch (error) {
      console.error("Error al obtener el porcentaje vendido:", error);
      return 0;
    }
  },


  getTickets: async () => {
    try {
      const tickets = await TicketService.getTickets();
      set({ tickets: tickets ?? [] });
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
    }
  },
}));
