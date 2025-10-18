import { create } from "zustand";
import { ReservationService } from "@/services/reservationService";
import { Reservation } from "@/type/Reservation";
import { toast } from "sonner";

export const useReservationStore = create<ReservationStore>()((set, get) => ({
  reservations: [],

  // 👈 ahora acepta array o función
  setReservations: (reservationsOrFn) =>
    set((state) => ({
      reservations:
        typeof reservationsOrFn === "function"
          ? reservationsOrFn(state.reservations)
          : reservationsOrFn,
    })),

  getReservations: async (token: string) => {
    const service = new ReservationService();
    const reservations = await service.getAllReservations(token);
    set({ reservations });
  },

  getReservationById: async (id: number, token: string) => {
    const service = new ReservationService();
    const reservation = await service.getReservationById(id, token);
    set({ reservations: [reservation] });
  },

  createReservation: async (ticketId: number, raffleId: number, token: string) => {
    const service = new ReservationService();
    const newReservation = await service.createReservation(ticketId, raffleId, token);

    set((state) => ({
      reservations: [...state.reservations, newReservation],
    }));

    return newReservation;
  },

  getAllReservationsByUser: async (token: string) => {
    const service = new ReservationService();
    const reservations = await service.getAllReservationsByUser(token);
    set({ reservations });
  },

  cancelReservation: async (id, token) => {
    try {
      const service = new ReservationService();
      const res = await service.cancelReservation(id, token);
      toast.success(res.message);

      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
      }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error cancelando reserva");
      throw error;
    }
  },
}));

interface ReservationStore {
  reservations: Reservation[];
  setReservations: (
    reservationsOrFn: Reservation[] | ((prev: Reservation[]) => Reservation[])
  ) => void;
  getReservations: (token: string) => Promise<void>;
  getReservationById: (id: number, token: string) => Promise<void>;
  getAllReservationsByUser: (token: string) => Promise<void>;
  createReservation: (ticketId: number, raffleId: number, token: string) => Promise<Reservation>;
  cancelReservation: (id: number, token: string) => Promise<void>;
}
