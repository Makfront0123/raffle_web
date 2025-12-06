import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { useRaffleDetail } from "@/hook/useRaffleDetail";
import { toast } from "sonner";

// ========= MOCKS =========

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "10" }),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/store/authStore", () => ({
  AuthStore: () => ({ token: "mock-token" }),
}));

const mockGetRaffleById = jest.fn();
const mockCreateReservation = jest.fn();
const mockMakePayment = jest.fn();
const mockGetSoldPercentage = jest.fn();

jest.mock("@/store/raffleStore", () => ({
  useRaffleStore: () => ({
    raffles: [],
    getRaffleById: mockGetRaffleById,
  }),
}));

jest.mock("@/store/reservationStore", () => ({
  useReservationStore: () => ({
    createReservation: mockCreateReservation,
  }),
}));

jest.mock("@/store/ticketStore", () => ({
  useTicketStore: () => ({
    soldPercentage: 30,
    getSoldPercentage: mockGetSoldPercentage,
  }),
}));

jest.mock("@/hook/usePayment", () => ({
  usePayment: () => ({
    makePayment: mockMakePayment,
  }),
}));

// ========= TESTS =========

describe("useRaffleDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("🔹 carga la rifa correctamente en el primer useEffect", async () => {
    mockGetRaffleById.mockResolvedValue({
      id: 10,
      tickets: [],
    });

    let result: any;

    await act(async () => {
      const hook = renderHook(() => useRaffleDetail());
      result = hook.result;
    });

    expect(mockGetRaffleById).toHaveBeenCalledWith(10, "mock-token");

    await waitFor(() => {
      expect(result.current.raffle).toEqual({
        id: 10,
        tickets: [],
      });
    });
  });

  test("🔹 setea tickets locales y calcula porcentaje vendido", async () => {
    mockGetRaffleById.mockResolvedValue({
      id: 10,
      tickets: [
        { id_ticket: 1, ticket_number: 1, status: "available" },
        { id_ticket: 2, ticket_number: 2, status: "reserved" },
      ],
    });

    const { result } = renderHook(() => useRaffleDetail());

    await waitFor(() => {
      expect(result.current.raffle).not.toBe(null);
    });

    expect(result.current.currentTickets.length).toBe(2);
    expect(mockGetSoldPercentage).toHaveBeenCalledWith(10, "mock-token");
  });

  test("🔹 bloquea ticket no disponible", async () => {
    mockGetRaffleById.mockResolvedValue({ id: 10, tickets: [] });

    let result: any;
    await act(async () => {
      result = renderHook(() => useRaffleDetail()).result;
    });

    const ticket = { id_ticket: 1, ticket_number: 1, status: "reserved" };

    act(() => {
      result.current.handleTicketSelect(ticket as any);
    });

    expect(toast.error).toHaveBeenCalled();
    expect(result.current.selectedTicket).toBe(null);
  });

  test("🔹 selecciona un ticket válido", async () => {
    mockGetRaffleById.mockResolvedValue({ id: 10, tickets: [] });

    let result: any;

    await act(async () => {
      result = renderHook(() => useRaffleDetail()).result;
    });

    const ticket = { id_ticket: 1, ticket_number: 1, status: "available" };

    act(() => {
      result.current.handleTicketSelect(ticket as any);
    });

    expect(result.current.selectedTicket).toEqual(ticket);
    expect(result.current.open).toBe(true);
  });

  test("🔹 reserva un ticket correctamente", async () => {
    mockGetRaffleById.mockResolvedValue({
      id: 10,
      tickets: [{ id_ticket: 1, ticket_number: 1, status: "available" }],
    });

    let result: any;
    await act(async () => {
      result = renderHook(() => useRaffleDetail()).result;
    });

    await waitFor(() => {
      expect(result.current.raffle).not.toBe(null);
    });

    act(() => {
      result.current.handleTicketSelect({
        id_ticket: 1,
        ticket_number: 1,
        status: "available",
      } as any);
    });

    await act(async () => {
      await result.current.handleAction("reserve");
    });

    expect(mockCreateReservation).toHaveBeenCalledWith(1, 10, "mock-token");
    expect(result.current.currentTickets[0].status).toBe("reserved");
    expect(toast.success).toHaveBeenCalled();
  });

  test("🔹 realiza pago con Nequi o Daviplata", async () => {
    mockGetRaffleById.mockResolvedValue({
      id: 10,
      tickets: [{ id_ticket: 5, ticket_number: 5, status: "available" }],
    });

    const { result } = renderHook(() => useRaffleDetail());

    await waitFor(() => {
      expect(result.current.raffle).not.toBe(null);
    });

    act(() => {
      result.current.handleTicketSelect({
        id_ticket: 5,
        ticket_number: 5,
        status: "available",
      } as any);
    });

    await act(async () => {
      await result.current.handleAction("nequi");
    });

    expect(mockMakePayment).toHaveBeenCalledWith({
      method: "nequi",
      raffle_id: 10,
      ticket_ids: [5],
    });

    expect(result.current.currentTickets[0].status).toBe("purchased");
    expect(toast.success).toHaveBeenCalled();
  });
});
