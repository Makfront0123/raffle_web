import axios from "axios";
import { Reservation } from "@/type/Reservation";

export interface CancelReservationResponse {
  message: string;
  reservation: Reservation;
}

export class ReservationService {
  async getAllReservations(token: string): Promise<Reservation[]> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservation`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async getReservationById(id: number, token: string): Promise<Reservation> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservation/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async createReservation(ticketId: number, raffleId: number, token: string): Promise<Reservation> {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservation`,
      { raffleId, ticketIds: [ticketId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }

  // 👇 Aquí cambias el tipo de retorno
  async cancelReservation(id: number, token: string): Promise<CancelReservationResponse> {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservation/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async getAllReservationsByUser(userId: number, token: string): Promise<Reservation[]> {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservation/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}
