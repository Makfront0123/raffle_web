import { create } from "zustand";
import { PaymentService } from "@/services/paymentService";
import { Payment, PaymentCreateDto, PaymentStatusEnum, WidgetPaymentDto } from "@/type/Payment";
import { WompiSignatureDto } from "@/type/WompiSignature";

interface PaymentStore {
  // ADMIN
  payments: Payment[];

  // USER
  userPayments: Payment[];

  loading: boolean;

  getPayments: (token: string) => Promise<Payment[]>;
  getPaymentsUser: (token: string) => Promise<Payment[]>;

  createPayment: (data: PaymentCreateDto, token: string) => Promise<Payment>;
  widgetPayment: (data: WidgetPaymentDto, token: string) => Promise<Payment>;


  completePayment: (id: number, token: string) => Promise<void>;
  cancelPayment: (id: number, token: string) => Promise<void>;

  getWompiSignature: (data: WompiSignatureDto, token: string) => Promise<{ signature: string }>;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  userPayments: [],
  loading: false,

  getPayments: async (token: string) => {
    set({ loading: true });
    try {
      const payments = await PaymentService.getPayments(token);
      set({ payments });
      return payments;
    } finally {
      set({ loading: false });
    }
  },

  getPaymentsUser: async (token: string) => {
    set({ loading: true });
    try {
      const payments = await PaymentService.getPaymentsUser(token);
      set({ userPayments: payments });
      return payments;
    } finally {
      set({ loading: false });
    }
  },

  createPayment: async (data: PaymentCreateDto, token: string) => {
    const payment = await PaymentService.createPayment(data, token);
    set((state) => ({
      userPayments: [...state.userPayments, payment],
    }));
    return payment;
  },

  widgetPayment: async (data: WidgetPaymentDto, token: string) => {
    return PaymentService.widgetPayment(data, token);
  },

  completePayment: async (id: number, token: string) => {
    await PaymentService.completePayment(id, token);
    set({
      payments: get().payments.map((p) =>
        p.id === id ? { ...p, status: PaymentStatusEnum.COMPLETED } : p
      ),
    });
  },

  cancelPayment: async (id: number, token: string) => {
    await PaymentService.cancelPayment(id, token);
    set({
      payments: get().payments.filter((p) => p.id !== id),
    });
  },

  getWompiSignature: async (data: WompiSignatureDto, token: string) => {
    return PaymentService.getWompiSignature(data, token);
  },
}));
