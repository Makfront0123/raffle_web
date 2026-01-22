"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { ReservationService, CancelReservationResponse } from "@/services/reservationService";
import { Reservation } from "@/type/Reservation";
interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
interface ReservationStore {
  reservations: Reservation[];
  setReservations: (
    reservationsOrFn: Reservation[] | ((prev: Reservation[]) => Reservation[])
  ) => void;

  getReservations: () => Promise<void>;
  getReservationById: (id: number) => Promise<void>;
  getAllReservationsByUser: () => Promise<void>;
  createReservation: (ticketId: number, raffleId: number) => Promise<Reservation>;
  cancelReservation: (id: number) => Promise<void>;
}



const getErrorMessage = (err: unknown): string => {
  const e = err as AxiosErrorLike;
  if (e.response?.data?.message) return e.response.data.message;
  if (e.message) return e.message;
  return "Error desconocido";
};


export const useReservationStore = create<ReservationStore>()((set) => ({
  reservations: [],

  setReservations: (reservationsOrFn) =>
    set((state) => ({
      reservations:
        typeof reservationsOrFn === "function"
          ? reservationsOrFn(state.reservations)
          : reservationsOrFn,
    })),

  getReservations: async () => {
    try {
      const service = new ReservationService();
      const reservations = await service.getAllReservations();
      set({ reservations });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error cargando reservas");
      console.error(err);
    }
  },

  getReservationById: async (id) => {
    try {
      const service = new ReservationService();
      const reservation = await service.getReservationById(id);
      set({ reservations: [reservation] });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error cargando reserva");
      console.error(err);
    }
  },

  getAllReservationsByUser: async () => {
    try {
      const service = new ReservationService();
      const reservations = await service.getAllReservationsByUser();
      set({ reservations });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error cargando reservas del usuario");
      console.error(err);
    }
  },

  createReservation: async (ticketId, raffleId) => {
    try {
      const service = new ReservationService();
      const newReservation = await service.createReservation(ticketId, raffleId);
      set((state) => ({
        reservations: [...state.reservations, newReservation],
      }));
      return newReservation;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error creando reserva");
      console.error(err);
      throw err;
    }
  },

  cancelReservation: async (id) => {
    try {
      const service = new ReservationService();
      const res: CancelReservationResponse = await service.cancelReservation(id);

      toast.success(res.message || "Reserva cancelada correctamente");

      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
      }));
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error cancelando reserva");
      throw err;
    }
  }

}));
