import { renderHook, act, waitFor } from "@testing-library/react";
import { useRaffleDetail } from "@/hook/useRaffleDetail";
import { toast } from "sonner";
import { TicketStatusEnum } from "@/type/Payment";
import { Raffle } from "@/type/Raffle";
import { Ticket } from "@/type/Ticket";

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "10" }),
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("@/hook/useReservation", () => ({
  useReservation: () => ({
    reservations: [],
  }),
}));


jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockGetRaffleById = jest.fn();
const mockCreateReservation = jest.fn();
const mockGetSoldPercentage = jest.fn();

jest.mock("@/store/authStore", () => ({
  AuthStore: () => ({ user: { id: 1, name: "Test" }, token: "mock-token" }),
}));

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
    soldPercentage: 0,
    getSoldPercentage: mockGetSoldPercentage,
  }),
}));

const createMockRaffle = (overrides?: Partial<Raffle>): Raffle => ({
  id: 10,
  title: "Rifa Test",
  price: 1000,
  description: "Desc",
  end_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // ⬅️ FUTURO
  digits: 2,
  status: "active",
  tickets: [],
  prizes: [],
  created_at: new Date().toISOString(),
  total_numbers: 100,
  ...overrides,
});


const createMockTicket = (raffle: Raffle, overrides?: Partial<Ticket>): Ticket => ({
  id_ticket: 1,
  ticket_number: "01",
  status: TicketStatusEnum.AVAILABLE,
  raffle,
  ...overrides,
});

// ===== TESTS =====
describe("useRaffleDetail", () => {
  beforeEach(() => jest.clearAllMocks());

  it("carga la rifa correctamente", async () => {
    const raffle = createMockRaffle();
    mockGetRaffleById.mockResolvedValue(raffle);
    mockGetSoldPercentage.mockResolvedValue(30);

    const payWithWompiWidget = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useRaffleDetail({ payWithWompiWidget }));

    // Espera a que se cargue la rifa
    await waitFor(() => {
      expect(result.current.raffle).toEqual(raffle);
    });

    expect(mockGetRaffleById).toHaveBeenCalledWith(10);
    expect(mockGetSoldPercentage).toHaveBeenCalledWith(raffle.id);
  });

  it("selecciona y reserva un ticket", async () => {
    const raffle = createMockRaffle();
    const ticket = createMockTicket(raffle);
    raffle.tickets = [ticket];

    mockGetRaffleById.mockResolvedValue(raffle);
    mockGetSoldPercentage.mockResolvedValue(0);
    mockCreateReservation.mockResolvedValue(ticket);

    const payWithWompiWidget = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRaffleDetail({ payWithWompiWidget })
    );

    await waitFor(() => expect(result.current.raffle).not.toBeNull());

    act(() => result.current.handleTicketSelect(ticket));

    await waitFor(() => {
      expect(result.current.selectedTickets).toHaveLength(1);
    });

    await act(async () => result.current.handleAction("reserved"));

    expect(mockCreateReservation).toHaveBeenCalledWith(
      ticket.id_ticket,
      raffle.id
    );

    expect(result.current.selectedTickets).toHaveLength(0);
    expect(toast.success).toHaveBeenCalled();
  });
  it("realiza pago con Wompi", async () => {
    const raffle = createMockRaffle();
    const ticket = createMockTicket(raffle);
    raffle.tickets = [ticket];

    mockGetRaffleById.mockResolvedValue(raffle);
    mockGetSoldPercentage.mockResolvedValue(0);

    const payWithWompiWidget = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRaffleDetail({ payWithWompiWidget })
    );

    await waitFor(() => expect(result.current.raffle).not.toBeNull());

    act(() => result.current.handleTicketSelect(ticket));

    await waitFor(() => {
      expect(result.current.selectedTickets).toHaveLength(1);
    });

    await act(async () => result.current.handleAction("pay"));

    expect(payWithWompiWidget).toHaveBeenCalledWith({
      tickets: [ticket],
      raffle,
      method: "pay",
    });
  });

});
