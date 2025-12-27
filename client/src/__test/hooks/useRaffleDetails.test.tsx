import { renderHook, act, waitFor } from "@testing-library/react";
import { useRaffleDetail } from "@/hook/useRaffleDetail";
import { toast } from "sonner";
import { TicketStatusEnum } from "@/type/Payment";
import { Raffle } from "@/type/Raffle";
import { Ticket } from "@/type/Ticket";


// ========= MOCKS =========

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "10" }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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

// ========= FACTORIES =========

const createMockRaffle = (overrides?: Partial<Raffle>): Raffle => ({
  id: 10,
  title: "Rifa Test",
  price: 1000,
  description: "Descripción",
  end_date: new Date().toISOString(),
  digits: 2,
  status: "active",
  tickets: [],
  prizes: [],
  created_at: new Date().toISOString(),
  total_numbers: 100,
  ...overrides,
});

const createMockTicket = (
  raffle: Raffle,
  overrides?: Partial<Ticket>
): Ticket => ({
  id_ticket: 1,
  ticket_number: "01",
  status: TicketStatusEnum.AVAILABLE,
  raffle,
  ...overrides,
});

// ========= TESTS =========

describe("useRaffleDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("🔹 carga la rifa correctamente en el primer useEffect", async () => {
    const raffle = createMockRaffle();

    mockGetRaffleById.mockResolvedValue(raffle);

    const payWithWompiWidget = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRaffleDetail({ payWithWompiWidget })
    );

    expect(mockGetRaffleById).toHaveBeenCalledWith(10, "mock-token");

    await waitFor(() => {
      expect(result.current.raffle).toEqual(raffle);
    });
  });

  test("🔹 setea tickets locales y calcula porcentaje vendido", async () => {
    const raffle = createMockRaffle();
    raffle.tickets = [
      createMockTicket(raffle),
      createMockTicket(raffle, {
        id_ticket: 2,
        ticket_number: "02",
        status: TicketStatusEnum.RESERVED,
      }),
    ];

    mockGetRaffleById.mockResolvedValue(raffle);

    const payWithWompiWidget = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRaffleDetail({ payWithWompiWidget })
    );

    await waitFor(() => {
      expect(result.current.raffle).not.toBeNull();
    });

    expect(result.current.currentTickets.length).toBe(2);
    expect(mockGetSoldPercentage).toHaveBeenCalledWith(10, "mock-token");
  });

  test("🔹 bloquea ticket no disponible", async () => {
    const raffle = createMockRaffle();
    mockGetRaffleById.mockResolvedValue(raffle);

    const payWithWompiWidget = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRaffleDetail({ payWithWompiWidget })
    );

    const reservedTicket = createMockTicket(raffle, {
      status: TicketStatusEnum.RESERVED,
    });

    act(() => {
      result.current.handleTicketSelect(reservedTicket);
    });

    expect(toast.error).toHaveBeenCalled();
    expect(result.current.selectedTickets).toHaveLength(0);
    expect(result.current.open).toBe(false);

  });

  test("🔹 selecciona un ticket válido", async () => {
    const raffle = createMockRaffle();
    mockGetRaffleById.mockResolvedValue(raffle);

    const payWithWompiWidget = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRaffleDetail({ payWithWompiWidget })
    );

    const availableTicket = createMockTicket(raffle);

    act(() => {
      result.current.handleTicketSelect(availableTicket);
    });

    expect(result.current.selectedTickets).toHaveLength(1);
    expect(result.current.selectedTickets[0]).toEqual(availableTicket);
    expect(result.current.open).toBe(true);

  });

  test("🔹 reserva un ticket correctamente", async () => {
    const raffle = createMockRaffle();
    const ticket = createMockTicket(raffle);
    raffle.tickets = [ticket];

    mockGetRaffleById.mockResolvedValue(raffle);

    const payWithWompiWidget = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRaffleDetail({ payWithWompiWidget })
    );

    await waitFor(() => {
      expect(result.current.raffle).not.toBeNull();
    });

    act(() => {
      result.current.handleTicketSelect(ticket);
    });

    await act(async () => {
      await result.current.handleAction("reserved");
    });

    expect(mockCreateReservation).toHaveBeenCalledWith(
      ticket.id_ticket,
      raffle.id,
      "mock-token"
    );

    expect(result.current.currentTickets[0].status).toBe(
      TicketStatusEnum.RESERVED
    );

    expect(toast.success).toHaveBeenCalled();
  });

  test("🔹 realiza pago con Wompi widget", async () => {
    const raffle = createMockRaffle();
    const ticket = createMockTicket(raffle, {
      id_ticket: 5,
      ticket_number: "05",
    });
    raffle.tickets = [ticket];

    mockGetRaffleById.mockResolvedValue(raffle);

    const payWithWompiWidget = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRaffleDetail({ payWithWompiWidget })
    );

    await waitFor(() => {
      expect(result.current.raffle).not.toBeNull();
    });

    act(() => {
      result.current.handleTicketSelect(ticket);
    });

    await act(async () => {
      await result.current.handleAction("pay");
    });

    expect(payWithWompiWidget).toHaveBeenCalledWith({
      ticket,
      raffle: {
        ...raffle,
        tickets: expect.any(Array),
      },
      method: "pay",
    });
  });
});
