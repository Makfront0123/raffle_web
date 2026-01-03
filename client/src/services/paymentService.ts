import { api } from "@/api/api";
import { Payment, PaymentCreateDto, WidgetPaymentDto } from "@/type/Payment";
import { WompiSignatureDto } from "@/type/WompiSignature";

export class PaymentService {
  static async createPayment(data: PaymentCreateDto): Promise<Payment> {
    const response = await api.post("/api/payment", data);
    return response.data;
  }

  static async widgetPayment(data: WidgetPaymentDto): Promise<Payment> {
    const response = await api.post("/api/payment/wompi", data);
    console.log(response.data);
    return response.data;
  }

  static async cancelPayment(id: number): Promise<void> {
    await api.put(`/api/payment/${id}/cancel`);
  }
  static async completePayment(id: number): Promise<void> {
    await api.put(`/api/payment/${id}/complete`);
  }
  static async getPayments(): Promise<Payment[]> {
    const response = await api.get("/api/payment");
    return response.data;
  }
  static async getPaymentsUser(): Promise<Payment[]> {
    const response = await api.get("/api/payment/user");
    return response.data;
  }
  static async getWompiSignature(
    data: WompiSignatureDto
  ): Promise<{ signature: string }> {
    const response = await api.post("/api/payment/wompi/signature", data);
    return response.data;
  }
}
