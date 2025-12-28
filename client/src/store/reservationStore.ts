"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { ReservationService, CancelReservationResponse } from "@/services/reservationService";
import { Reservation } from "@/type/Reservation";

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

// Helper para errores tipados
const getErrorMessage = (err: unknown): string => {
  if (typeof err === "object" && err !== null && "message" in err) {
    return (err as { message: string }).message;
  }
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

  getReservations: async (token) => {
    try {
      const service = new ReservationService();
      const reservations = await service.getAllReservations(token);
      set({ reservations });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error cargando reservas");
      console.error(err);
    }
  },

  getReservationById: async (id, token) => {
    try {
      const service = new ReservationService();
      const reservation = await service.getReservationById(id, token);
      set({ reservations: [reservation] });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error cargando reserva");
      console.error(err);
    }
  },

  getAllReservationsByUser: async (token) => {
    try {
      const service = new ReservationService();
      const reservations = await service.getAllReservationsByUser(token);
      set({ reservations });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error cargando reservas del usuario");
      console.error(err);
    }
  },

  createReservation: async (ticketId, raffleId, token) => {
    try {
      const service = new ReservationService();
      const newReservation = await service.createReservation(ticketId, raffleId, token);
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

  cancelReservation: async (id, token) => {
    try {
      const service = new ReservationService();
      const res: CancelReservationResponse = await service.cancelReservation(id, token);
      toast.success(res.message);
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
      }));
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      toast.error(msg || "Error cancelando reserva");
      console.error(err);
      throw err;
    }
  },
}));
