import { PaymentService } from "@/services/paymentService";
import { usePaymentStore } from "@/store/paymentStore";
import { Payment, PaymentCreateDto } from "@/type/Payment";
import { act } from "@testing-library/react";

jest.mock("@/services/paymentService", () => ({
    PaymentService: {
        getPayments: jest.fn(),
        createPayment: jest.fn(),
        cancelPayment: jest.fn(),
        completePayment: jest.fn(),
    },
}));

const MockPaymentService = PaymentService as jest.Mocked<typeof PaymentService>;


const mockPayment = (overrides?: Partial<Payment>): Payment => ({
    id: 1,
    method: "nequi",
    total_amount: "5000",
    status: "pending",
    raffle: {
        id: 10,
        title: "Rifa de prueba",
    },
    user: {
        id: 99,
        name: "Armando",
    },
    created_at: "2025-01-01T00:00:00Z",
    cancelled_at: null,
    ...overrides,
});


const mockCreateDto = (): PaymentCreateDto => ({
    method: "nequi",
    raffle_id: 1,
    ticket_ids: [10, 11],
});

/* -------------------------------------------------------------------------- */
/*                                  TESTS                                      */
/* -------------------------------------------------------------------------- */

describe("PaymentStore", () => {
    beforeEach(() => {
        usePaymentStore.setState({ payments: [], loading: false });
        jest.clearAllMocks();
    });

    it("getPayments guarda payments", async () => {
        MockPaymentService.getPayments.mockResolvedValue([
            mockPayment({ id: 1 }),
        ]);

        await act(async () => {
            await usePaymentStore.getState().getPayments("token");
        });

        expect(usePaymentStore.getState().payments.length).toBe(1);
        expect(usePaymentStore.getState().payments[0].id).toBe(1);
    });

    it("createPayment añade un payment", async () => {
        MockPaymentService.createPayment.mockResolvedValue(
            mockPayment({ id: 77 })
        );

        await act(async () => {
            await usePaymentStore
                .getState()
                .createPayment(mockCreateDto(), "token");
        });

        const state = usePaymentStore.getState();

        expect(state.payments.length).toBe(1);
        expect(state.payments[0].id).toBe(77);
    });
});
