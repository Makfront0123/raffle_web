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
    const mockCancel = jest.fn();
    const mockFetchReservations = jest.fn();
    const mockMakePayment = jest.fn();

    // Zustand FIX ⭐⭐⭐⭐⭐
    const mockUseReservationStore =
        useReservationStore as unknown as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        (useReservation as jest.Mock).mockReturnValue({
            reservations: [
                { id: 1, expires_at: "2099-01-01" },
                { id: 2, expires_at: "2000-01-01" },
            ],
            loading: false,
            error: null,
            fetchReservations: mockFetchReservations,
        });

        // ← CORRECTO AHORA
        mockUseReservationStore.mockReturnValue({
            cancelReservation: mockCancel,
        });

        (useRaffles as jest.Mock).mockReturnValue({
            raffles: [],
        });

        const mockAuthStore = AuthStore as unknown as jest.Mock;

        mockAuthStore.mockReturnValue({
            token: "abc123",
        });


        (usePayment as jest.Mock).mockReturnValue({
            makePayment: mockMakePayment,
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

        expect(mockCancel).toHaveBeenCalledWith(1, "abc123");
        expect(mockFetchReservations).toHaveBeenCalled();
    });

    it("procesa un pago y vuelve a cargar reservas", async () => {
        const { result } = renderHook(() => useReservationsLogic());

        await act(async () => {
            await result.current.handlePayment("nequi", 5, 99);
        });

        expect(mockMakePayment).toHaveBeenCalledWith({
            method: "nequi",
            raffle_id: 5,
            ticket_ids: [99],
        });

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
