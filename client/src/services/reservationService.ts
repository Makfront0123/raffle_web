import { api } from "@/api/api";
import { Reservation } from "@/type/Reservation";

export interface CancelReservationResponse {
  message: string;
  reservation: Reservation;
}
export class ReservationService {
  async getAllReservations(): Promise<Reservation[]> {
    const res = await api.get<Reservation[]>("/api/reservation");
    return res.data;
  }

  async getReservationById(id: number): Promise<Reservation> {
    const res = await api.get<Reservation>(`/api/reservation/${id}`);
    return res.data;
  }

  async createReservation(ticketId: number, raffleId: number): Promise<Reservation> {
    const res = await api.post<Reservation>("/api/reservation", {
      raffleId,
      ticketIds: [ticketId],
    });
    return res.data;
  }

  async cancelReservation(id: number): Promise<CancelReservationResponse> {
    const res = await api.delete<CancelReservationResponse>(`/api/reservation/${id}`);
    return res.data;
  }

  async getAllReservationsByUser(): Promise<Reservation[]> {
    const res = await api.get<Reservation[]>("/api/reservation/user");
    return res.data;
  }
}