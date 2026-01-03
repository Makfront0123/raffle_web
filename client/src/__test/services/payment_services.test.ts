import { PaymentService } from "@/services/paymentService";
import { api } from "@/api/api";

jest.mock("@/api/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("PaymentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createPayment hace POST y retorna payment", async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: { id: 1 },
    } as any);

    const payload = {
      raffle_id: 2,
      ticket_ids: [1],
      reference: "123",
      total_amount: 100,
      reservation_id: 1,
    };

    const res = await PaymentService.createPayment(payload);

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/payment",
      payload
    );

    expect(res.id).toBe(1);
  });

  it("cancelPayment hace PUT", async () => {
    mockedApi.put.mockResolvedValueOnce({} as any);

    await PaymentService.cancelPayment(10);

    expect(mockedApi.put).toHaveBeenCalledWith(
      "/api/payment/10/cancel"
    );
  });

  it("completePayment hace PUT", async () => {
    mockedApi.put.mockResolvedValueOnce({} as any);

    await PaymentService.completePayment(99);

    expect(mockedApi.put).toHaveBeenCalledWith(
      "/api/payment/99/complete"
    );
  });

  it("getPayments retorna lista de pagos", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: [{ id: 1 }],
    } as any);

    const res = await PaymentService.getPayments();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/payment");
    expect(res).toHaveLength(1);
  });

  it("getPaymentsUser retorna lista de pagos del usuario", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: [{ id: 2 }],
    } as any);

    const res = await PaymentService.getPaymentsUser();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/payment/user");
    expect(res[0].id).toBe(2);
  });

  it("widgetPayment hace POST a wompi", async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: { id: 3 },
    } as any);

    const payload = {
      amount: 100,
      currency: "COP",
    } as any;

    const res = await PaymentService.widgetPayment(payload);

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/payment/wompi",
      payload
    );
    expect(res.id).toBe(3);
  });

  it("getWompiSignature retorna firma", async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: { signature: "abc123" },
    } as any);

    const payload = {
      amount: 100,
      currency: "COP",
    } as any;

    const res = await PaymentService.getWompiSignature(payload);

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/payment/wompi/signature",
      payload
    );

    expect(res.signature).toBe("abc123");
  });
});
