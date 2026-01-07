/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useReservationsLogic } from "@/hook/useReservationsLogic";
import { useReservation } from "@/hook/useReservation";
import { useReservationStore } from "@/store/reservationStore";
import { useRaffles } from "@/hook/useRaffles";
import { AuthStore } from "@/store/authStore";
import { usePayment } from "@/hook/usePayment";
import { TicketStatusEnum } from "@/type/Payment";
import { Reservation } from "@/type/Reservation";
import { Raffle } from "@/type/Raffle";

// --- MOCKS ---
jest.mock("@/hook/useReservation");
jest.mock("@/store/reservationStore");
jest.mock("@/hook/useRaffles");
jest.mock("@/store/authStore");
jest.mock("@/hook/usePayment");

describe("useReservationsLogic", () => {
  const mockCancelReservation = jest.fn();
  const mockFetchReservations = jest.fn();
  const mockPayWithWompiWidget = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de useReservation
    (useReservation as jest.Mock).mockReturnValue({
      reservations: [
        { id: 1, expires_at: "2099-01-01", reservationTickets: [] },
        { id: 2, expires_at: "2000-01-01", reservationTickets: [] },
      ],
      loading: false,
      error: null,
      fetchReservations: mockFetchReservations,
    });

    // Mock de useReservationStore
    ((useReservationStore as unknown) as jest.Mock).mockReturnValue({
      cancelReservation: mockCancelReservation,
      getReservations: jest.fn(),
      getAllReservationsByUser: jest.fn(),
      createReservation: jest.fn(),
      getReservationById: jest.fn(),
      reservations: [],
      setReservations: jest.fn(),
    });


    // Mock de useRaffles
    (useRaffles as jest.Mock).mockReturnValue({
      raffles: [],
    });

    // Mock de AuthStore
    // Mock de AuthStore
    ((AuthStore as unknown) as jest.Mock).mockReturnValue({
      user: { id: 1, name: "Test", role: "user", email: "test@example.com" },
    });

    // Mock de usePayment
    (usePayment as jest.Mock).mockReturnValue({
      payWithWompiWidget: mockPayWithWompiWidget,
    });
  });

  it("filtra reservas activas correctamente", () => {
    const { result } = renderHook(() => useReservationsLogic());

    expect(result.current.paginatedReservations.length).toBe(1);
    expect(result.current.paginatedReservations[0].id).toBe(1);
  });

  it("cancela una reserva", async () => {
    const { result } = renderHook(() => useReservationsLogic());

    await act(async () => {
      await result.current.handleCancel(1);
    });

    expect(mockCancelReservation).toHaveBeenCalledWith(1);
    expect(mockFetchReservations).toHaveBeenCalled();
  });

  it("procesa un pago y vuelve a cargar reservas", async () => {
    const { result } = renderHook(() => useReservationsLogic());

    const mockReservation: Partial<Reservation> = {
      id: 1,
      reservationTickets: [
        {
          id: 123,
          ticket: {
            id_ticket: 99,
            raffleId: 5,
            purchased_at: "2099-01-01",
            status: TicketStatusEnum.AVAILABLE,
            ticket_number: "1",
          },
        },
      ],
    };

    const mockRaffle: Partial<Raffle> = { id: 5, price: 1000 };

    await act(async () => {
      await result.current.handleAction(
        mockReservation as Reservation,
        mockRaffle as Raffle
      );
    });

    expect(mockPayWithWompiWidget).toHaveBeenCalledWith({
      raffle: mockRaffle,
      tickets: [
        {
          id_ticket: 99,
          raffleId: 5,
          purchased_at: "2099-01-01",
          status: TicketStatusEnum.AVAILABLE,
          ticket_number: "1",
          raffle: mockRaffle,
        },
      ],
      reservation_id: 1,
    });

    expect(mockFetchReservations).toHaveBeenCalled();
  });

  it("cambia la página correctamente", () => {
    const { result } = renderHook(() => useReservationsLogic());

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
  });
});
