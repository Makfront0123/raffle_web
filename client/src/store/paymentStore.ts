
import { create } from "zustand";
import { PaymentService } from "@/services/paymentService";
import { Payment, PaymentCreateDto, WidgetPaymentDto } from "@/type/Payment";

import { toast } from "sonner";
import { WompiSignatureDto } from "@/type/WompiSignature";

export const usePaymentStore = create<PaymentStore>()((set, get) => ({
    payments: [],
    setPayments: (payments) => set({ payments }),

    loading: false,
    setLoading: (loading) => set({ loading }),

    createPayment: async (data, token) => {
        const newPayment = await PaymentService.createPayment(data, token);
        set((state) => ({ payments: [...state.payments, newPayment] }));
        return newPayment;
    },

    // 🟢 NUEVO: pago por widget
    widgetPayment: async (data, token) => {
        console.log("widgetPayment", data,token);
        return PaymentService.widgetPayment(data, token);
    },

    cancelPayment: async (id, token) => {
        try {
            await PaymentService.cancelPayment(id, token);
            set({
                payments: get().payments.filter((p) => p.id !== id),
            });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error cancelando pago");
            throw error;
        }
    },

    getPayments: async (token) => {
        set({ loading: true });
        try {
            const payments = await PaymentService.getPayments(token);
            set({ payments });
        } finally {
            set({ loading: false });
        }
    },

    completePayment: async (id, token) => {
        await PaymentService.completePayment(id, token);
        set({
            payments: get().payments.map((p) =>
                p.id === id ? { ...p, status: "completed" } : p
            ),
        });
    },

    getWompiSignature: async (data, token) => {
        return PaymentService.getWompiSignature(data, token);
    },
}));

interface PaymentStore {
    payments: Payment[];
    setPayments: (payments: Payment[]) => void;

    loading: boolean;
    setLoading: (loading: boolean) => void;

    createPayment: (data: PaymentCreateDto, token: string) => Promise<Payment>;
    widgetPayment: (data: WidgetPaymentDto, token: string) => Promise<any>;

    getWompiSignature: (data: WompiSignatureDto, token: string) => Promise<any>;

    cancelPayment: (id: number, token: string) => Promise<void>;
    getPayments: (token: string) => Promise<void>;
    completePayment: (id: number, token: string) => Promise<void>;
}


/*
import { create } from "zustand";
import { PaymentService } from "@/services/paymentService";
import { Payment, PaymentCreateDto } from "@/type/Payment";
import { toast } from "sonner";

export const usePaymentStore = create<PaymentStore>()((set, get) => ({
    payments: [],
    setPayments: (payments: Payment[]) => set({ payments }),

    loading: false,
    setLoading: (loading: boolean) => set({ loading }),

    createPayment: async (data: PaymentCreateDto, token: string) => {
        const newPayment = await PaymentService.createPayment(data, token);
        set((state) => ({
            payments: [...state.payments, newPayment],
        }));
        return newPayment;
    },

    cancelPayment: async (id: number, token: string) => {
        try {
            await PaymentService.cancelPayment(id, token);
            set({
                payments: get().payments.filter((p) => p.id !== id),
            });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error cancelando pago");
            throw error;
        }
    },

    getPayments: async (token: string) => {
        set({ loading: true });
        try {
            const payments = await PaymentService.getPayments(token);
            set({ payments });
        } finally {
            set({ loading: false });
        }
    },

    completePayment: async (id: number, token: string) => {
        try {
            await PaymentService.completePayment(id, token);
            set({
                payments: get().payments.map((p) =>
                    p.id === id ? { ...p, status: "completed" } : p
                ),
            });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error completando pago");
            throw error;
        }
    },
}));

interface PaymentStore {
    payments: Payment[];
    setPayments: (payments: Payment[]) => void;

    loading: boolean;            // 👈 faltaba
    setLoading: (loading: boolean) => void; // 👈 faltaba

    createPayment: (data: PaymentCreateDto, token: string) => Promise<Payment>;
    cancelPayment: (id: number, token: string) => Promise<void>;
    getPayments: (token: string) => Promise<void>;
    completePayment: (id: number, token: string) => Promise<void>;
}

*/