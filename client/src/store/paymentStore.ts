import { create } from "zustand";
import { PaymentService } from "@/services/paymentService";
import { Payment, PaymentCreateDto, PaymentStatusEnum, VerifyPaymentResponse, WidgetPaymentDto, WompiPaymentResponse } from "@/type/Payment";
import { WompiSignatureDto } from "@/type/WompiSignature";


interface PaymentStore {
  // ADMIN
  payments: Payment[];

  // USER
  userPayments: Payment[];

  loading: boolean;

  getPayments: () => Promise<Payment[]>;
  getPaymentsUser: () => Promise<Payment[]>;

  createPayment: (data: PaymentCreateDto,) => Promise<Payment>;
  widgetPayment: (data: WidgetPaymentDto,) => Promise<WompiPaymentResponse>;
  attachTransactionId: (reference: string, transactionId: string) => Promise<void>;


  completePayment: (id: number,) => Promise<void>;
  verifyPaymentManually: (reference: string, force?: boolean) => Promise<VerifyPaymentResponse>;
  cancelPayment: (id: number,) => Promise<void>;

  getWompiSignature: (data: WompiSignatureDto,) => Promise<{ signature: string }>;
  getPaymentStatusByReference: (
    reference: string
  ) => Promise<PaymentStatusEnum>;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  userPayments: [],
  loading: false,

  getPayments: async () => {
    set({ loading: true });
    try {
      const payments = await PaymentService.getPayments();
      set({ payments });
      return payments;
    } finally {
      set({ loading: false });
    }
  },

  getPaymentsUser: async () => {
    set({ loading: true });
    try {
      const payments = await PaymentService.getPaymentsUser();
      set({ userPayments: payments });
      return payments;
    } finally {
      set({ loading: false });
    }
  },

  attachTransactionId: async (reference: string, transactionId: string) => {
    await PaymentService.attachTransactionId(reference, transactionId);
  },

  createPayment: async (data: PaymentCreateDto,) => {
    const payment = await PaymentService.createPayment(data);
    set((state) => ({
      userPayments: [...state.userPayments, payment],
    }));
    return payment;
  },

  widgetPayment: async (data: WidgetPaymentDto,) => {
    return PaymentService.widgetPayment(data,);
  },

  completePayment: async (id: number) => {
    try {

      await PaymentService.completePayment(id);
      set({
        payments: get().payments.map((p) =>
          p.id === id ? { ...p, status: PaymentStatusEnum.COMPLETED } : p
        ),
      });
    } catch (err: unknown) {
      throw err;
    }
  },

  verifyPaymentManually: async (reference: string) => {
    const res = await PaymentService.verifyPaymentManually(reference);

    const updatedPayment = res.payment;

    set({
      payments: get().payments.map((p) =>
        p.reference === reference ? { ...p, status: updatedPayment.status } : p
      ),
    });

    return res;
  },
  cancelPayment: async (id: number,) => {
    await PaymentService.cancelPayment(id);
    set({
      payments: get().payments.filter((p) => p.id !== id),
    });
  },

  getWompiSignature: async (data: WompiSignatureDto,) => {
    return PaymentService.getWompiSignature(data,);
  },

  getPaymentStatusByReference: async (reference: string) => {
    const res = await PaymentService.getPaymentStatusByReference(reference);

    if (!res || !res.status) {
      return PaymentStatusEnum.PENDING;
    }

    return res.status;
  },

}));
