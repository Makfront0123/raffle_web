"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { ReservationService, CancelReservationResponse } from "@/services/reservationService";
import { Reservation } from "@/type/Reservation";

interface ReservationStore {
  reservations: Reservation[];

  setReservations: (
    reservationsOrFn:
      | Reservation[]
      | ((prev: Reservation[]) => Reservation[])
  ) => void;

  getReservations: () => Promise<void>;
  getReservationById: (id: number) => Promise<void>;
  getAllReservationsByUser: () => Promise<void>;
  createReservation: (
    ticketId: number,
    raffleId: number
  ) => Promise<Reservation>;
  cancelReservation: (id: number) => Promise<void>;
}

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
    const service = new ReservationService();
    const reservations = await service.getAllReservations();
    set({ reservations });
  },
  getReservationById: async (id) => {
    const service = new ReservationService();
    const reservation = await service.getReservationById(id);

    set({ reservations: [reservation] });
  },
  getAllReservationsByUser: async () => {
    const service = new ReservationService();
    const reservations = await service.getAllReservationsByUser();

    set({ reservations });
  },
  createReservation: async (ticketId, raffleId) => {
    const service = new ReservationService();
    const newReservation = await service.createReservation(ticketId, raffleId);

    set((state) => ({
      reservations: [...state.reservations, newReservation],
    }));

    return newReservation;
  },

  cancelReservation: async (id) => {
    const service = new ReservationService();
    const res: CancelReservationResponse =
      await service.cancelReservation(id);

    set((state) => ({
      reservations: state.reservations.filter((r) => r.id !== id),
    }));
  },
}));