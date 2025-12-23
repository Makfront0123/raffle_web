import { create } from "zustand";
import { PaymentService } from "@/services/paymentService";
import { Payment, PaymentCreateDto, WidgetPaymentDto } from "@/type/Payment";
import { WompiSignatureDto } from "@/type/WompiSignature";
import { toast } from "sonner";

interface PaymentStore {
  // ADMIN
  payments: Payment[];

  // USER
  userPayments: Payment[];

  loading: boolean;

  getPayments: (token: string) => Promise<Payment[]>;
  getPaymentsUser: (token: string) => Promise<Payment[]>;

  createPayment: (data: PaymentCreateDto, token: string) => Promise<Payment>;
  widgetPayment: (data: WidgetPaymentDto, token: string) => Promise<any>;

  completePayment: (id: number, token: string) => Promise<void>;
  cancelPayment: (id: number, token: string) => Promise<void>;

  getWompiSignature: (data: WompiSignatureDto, token: string) => Promise<any>;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  userPayments: [],
  loading: false,

  getPayments: async (token) => {
    set({ loading: true });
    try {
      const payments = await PaymentService.getPayments(token);
      set({ payments });
      return payments;
    } finally {
      set({ loading: false });
    }
  },

  getPaymentsUser: async (token) => {
    set({ loading: true });
    try {
      const payments = await PaymentService.getPaymentsUser(token);
      set({ userPayments: payments });
      return payments;
    } finally {
      set({ loading: false });
    }
  },

  createPayment: async (data, token) => {
    const payment = await PaymentService.createPayment(data, token);
    set((state) => ({
      userPayments: [...state.userPayments, payment],
    }));
    return payment;
  },

  widgetPayment: async (data, token) => {
    return PaymentService.widgetPayment(data, token);
  },

  completePayment: async (id, token) => {
    await PaymentService.completePayment(id, token);
    set({
      payments: get().payments.map((p) =>
        p.id === id ? { ...p, status: "completed" } : p
      ),
    });
  },

  cancelPayment: async (id, token) => {
    await PaymentService.cancelPayment(id, token);
    set({
      payments: get().payments.filter((p) => p.id !== id),
    });
  },

  getWompiSignature: async (data, token) => {
    return PaymentService.getWompiSignature(data, token);
  },
}));
