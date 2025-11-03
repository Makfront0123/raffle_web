import { Payment, PaymentCreateDto } from "@/type/Payment";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export class PaymentService {
  static async createPayment(data: PaymentCreateDto, token: string): Promise<Payment> {
    const response = await axios.post(`${API_URL}/api/payment`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;

  }

  static async cancelPayment(id: number, token: string): Promise<void> {
    await axios.put(`${API_URL}/api/payment/${id}/cancel`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static async getPayments(token: string): Promise<Payment[]> {
    const response = await axios.get(`${API_URL}/api/payment`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
  static async completePayment(id: number, token: string): Promise<void> {
    await axios.put(`${API_URL}/api/payment/${id}/complete`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

