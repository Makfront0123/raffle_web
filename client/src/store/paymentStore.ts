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
