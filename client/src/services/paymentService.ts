import { api } from "@/api/api";
import { Payment, PaymentCreateDto, PaymentStatusEnum, WidgetPaymentDto, WompiPaymentResponse } from "@/type/Payment";
import { WompiSignatureDto } from "@/type/WompiSignature";

export class PaymentService {
  static async createPayment(data: PaymentCreateDto): Promise<Payment> {
    const response = await api.post("/api/payment", data);
    return response.data;
  }

  static async widgetPayment(data: WidgetPaymentDto): Promise<WompiPaymentResponse> {
    const response = await api.post("/api/payment/wompi", data);
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
  static async getPaymentStatusByReference(
    reference: string
  ): Promise<{ status: PaymentStatusEnum }> {
    const res = await api.get(`/api/payment/status/${reference}`);
    return res.data;
  }

  static async verifyPaymentManually(reference: string): Promise<Payment> {
    const response = await api.post(`/api/payment/manual/verify/${reference}`);
    return response.data;
  }

  static async attachTransactionId(reference: string, transactionId: string): Promise<void> {
    await api.post(`/api/payment/manual/attachTransactionId/${reference}`, { transactionId });
  }

}
