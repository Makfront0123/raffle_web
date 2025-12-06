import axios from "axios";
import { PaymentService } from "@/services/paymentService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PaymentService", () => {
  it("createPayment hace POST y retorna payment", async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 1 } });

    const res = await PaymentService.createPayment(
      { method: "nequi", raffle_id: 2, ticket_ids: [1] },
      "token123"
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment`,
      { method: "nequi", raffle_id: 2, ticket_ids: [1] },
      { headers: { Authorization: "Bearer token123" } }
    );

    expect(res.id).toBe(1);
  });

  it("cancelPayment hace PUT", async () => {
    mockedAxios.put.mockResolvedValue({});

    await PaymentService.cancelPayment(10, "token");

    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/10/cancel`,
      null,
      { headers: { Authorization: "Bearer token" } }
    );
  });

  it("getPayments retorna lista de pagos", async () => {
    mockedAxios.get.mockResolvedValue({ data: [{ id: 1 }] });

    const res = await PaymentService.getPayments("t");

    expect(res.length).toBe(1);
  });

  it("completePayment hace PUT", async () => {
    mockedAxios.put.mockResolvedValue({});

    await PaymentService.completePayment(99, "t");

    expect(mockedAxios.put).toHaveBeenCalled();
  });
});
