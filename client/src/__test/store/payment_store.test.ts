import { act } from "@testing-library/react";
import { PaymentService } from "@/services/paymentService";
import { usePaymentStore } from "@/store/paymentStore";
import { Payment, PaymentCreateDto } from "@/type/Payment";
import { Raffle } from "@/type/Raffle";

jest.mock("@/services/paymentService", () => ({
  PaymentService: {
    getPayments: jest.fn(),
    getPaymentsUser: jest.fn(),
    createPayment: jest.fn(),
    cancelPayment: jest.fn(),
    completePayment: jest.fn(),
    widgetPayment: jest.fn(),
    getWompiSignature: jest.fn(),
  },
}));

const MockPaymentService = PaymentService as jest.Mocked<
  typeof PaymentService
>;

const now = new Date().toISOString();

const mockRaffle: Raffle = {
  id: 10,
  title: "Rifa de prueba",
  price: 5000,
  description: "Descripción de la rifa",
  end_date: now,
  digits: 6,
  status: "active",
  tickets: [],
  prizes: [],
  created_at: now,
  total_numbers: 100,
};

const mockPayment = (overrides?: Partial<Payment>): Payment => ({
  id: 1,
  method: "nequi",
  total_amount: 5000,
  status: "pending",
  reference: "TEST_REF",
  raffle: mockRaffle,
  details: [],
  created_at: now,
  cancelled_at: null,
  ...overrides,
});

const mockCreateDto = (): PaymentCreateDto => ({
  raffle_id: 1,
  ticket_ids: [1, 2],
  reference: "TEST_REF",
  total_amount: 5000,
});

describe("PaymentStore", () => {
  beforeEach(() => {
    usePaymentStore.setState({
      payments: [],
      userPayments: [],
      loading: false,
    });
    jest.clearAllMocks();
  });

  it("getPayments guarda payments (ADMIN)", async () => {
    MockPaymentService.getPayments.mockResolvedValue([
      mockPayment({ id: 1 }),
    ]);

    await act(async () => {
      await usePaymentStore.getState().getPayments("token");
    });

    const state = usePaymentStore.getState();

    expect(state.payments.length).toBe(1);
    expect(state.payments[0].id).toBe(1);
  });

  it("createPayment añade un payment a userPayments (USER)", async () => {
    MockPaymentService.createPayment.mockResolvedValue(
      mockPayment({ id: 77 })
    );

    await act(async () => {
      await usePaymentStore
        .getState()
        .createPayment(mockCreateDto(), "token");
    });

    const state = usePaymentStore.getState();

    expect(state.userPayments.length).toBe(1);
    expect(state.userPayments[0].id).toBe(77);
  });
});
