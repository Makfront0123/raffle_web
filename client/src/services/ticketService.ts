import { api } from "@/api/api";

export class TicketService {
  static async getSoldPercentage(raffleId: number) {
    const response = await api.get(`/api/ticket/${raffleId}/sold-percentage`);
    return response.data;
  }

  static async getTickets() {
    const response = await api.get("/api/ticket/user");
    return response.data;
  }
}
