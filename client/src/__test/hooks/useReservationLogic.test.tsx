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

// --- MOCKS ---
jest.mock("@/hook/useReservation");
jest.mock("@/store/reservationStore");
jest.mock("@/hook/useRaffles");
jest.mock("@/store/authStore");
jest.mock("@/hook/usePayment");

describe("useReservationsLogic", () => {
  const mockCancelReservation = jest.fn();
  const mockFetchReservations = jest.fn();
  const mockCreatePayment = jest.fn();

  const mockUseReservationStore =
    useReservationStore as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // useReservation
    (useReservation as jest.Mock).mockReturnValue({
      reservations: [
        { id: 1, expires_at: "2099-01-01" },
        { id: 2, expires_at: "2000-01-01" },
      ],
      loading: false,
      error: null,
      fetchReservations: mockFetchReservations,
    });

    // Zustand store
    mockUseReservationStore.mockReturnValue({
      cancelReservation: mockCancelReservation,
    });

    // Raffles
    (useRaffles as jest.Mock).mockReturnValue({
      raffles: [],
    });

    // Auth
    (AuthStore as unknown as jest.Mock).mockReturnValue({
      token: "abc123",
    });

    // Payment hook (⚠️ NOMBRE CORRECTO)
    (usePayment as jest.Mock).mockReturnValue({
      createPayment: mockCreatePayment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                   TESTS                                    */
  /* -------------------------------------------------------------------------- */

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

    expect(mockCancelReservation).toHaveBeenCalledWith(1, "abc123");
    expect(mockFetchReservations).toHaveBeenCalled();
  });

  it("procesa un pago y vuelve a cargar reservas", async () => {
    const { result } = renderHook(() => useReservationsLogic());

    const mockReservation = {
      id: 1,
      reservationTickets: [
        {
          ticket: { id_ticket: 99 },
        },
      ],
    } as any;

    const mockRaffle = {
      id: 5,
      price: 1000,
    } as any;

    await act(async () => {
      await result.current.handleAction(mockReservation, mockRaffle);
    });

    expect(mockCreatePayment).toHaveBeenCalledWith(
      {
        raffle_id: 5,
        ticket_ids: [99],
        reference: expect.stringContaining("RAFFLE_5"),
        total_amount: 1000,
        reservation_id: 1,
      },
      "abc123"
    );

    expect(mockFetchReservations).toHaveBeenCalled();
  });

  it("cambia la página", () => {
    const { result } = renderHook(() => useReservationsLogic());

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
  });
});