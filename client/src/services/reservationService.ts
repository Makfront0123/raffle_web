import { api } from "@/api/api";
import { Reservation } from "@/type/Reservation";

export interface CancelReservationResponse {
  message: string;
  reservation: Reservation;
}

export class ReservationService {
  private handleError(error: unknown, defaultMessage: string): never {
    console.error("Backend error:", error);
    throw new Error(defaultMessage);
  }

  async getAllReservations(): Promise<Reservation[]> {
    try {
      const res = await api.get<Reservation[]>("/api/reservation");
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error obteniendo las reservaciones");
    }
  }

  async getReservationById(id: number): Promise<Reservation> {
    try {
      const res = await api.get<Reservation>(`/api/reservation/${id}`);
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error obteniendo la reservación");
    }
  }

  async createReservation(ticketId: number, raffleId: number): Promise<Reservation> {
    try {
      const res = await api.post<Reservation>("/api/reservation", {
        raffleId,
        ticketIds: [ticketId],
      });
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error creando la reservación");
    }
  }

  async cancelReservation(id: number): Promise<CancelReservationResponse> {
    try {
      const res = await api.delete<CancelReservationResponse>(`/api/reservation/${id}`);
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error cancelando la reservación");
    }
  }

  async getAllReservationsByUser(): Promise<Reservation[]> {
    try {
      const res = await api.get<Reservation[]>("/api/reservation/user");
      return res.data;
    } catch (error: unknown) {
      return this.handleError(error, "Error obteniendo las reservaciones del usuario");
    }
  }
}
