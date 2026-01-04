import { useReservation } from "@/hook/useReservation";
import { AuthStore } from "@/store/authStore";
import { useReservationStore } from "@/store/reservationStore";
import { renderHook } from "@testing-library/react";

jest.mock("@/hook/useReservation", () => ({
  useReservation: jest.fn(),
}));

jest.mock("@/store/authStore");
jest.mock("@/store/reservationStore");

describe("useReservation Hook", () => {
  let mockAuthStore: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // mock AuthStore tipo Zustand
    (AuthStore as unknown as jest.Mock).mockImplementation((selector?: any) => {
      const state = { token: "TEST_TOKEN", user: { id: "user1" } };
      return typeof selector === "function" ? selector(state) : state;
    });

    // mock useReservation
    (useReservation as jest.Mock).mockReturnValue({
      reservations: [],
      loading: false,
      error: null,
      fetchReservations: jest.fn(),
    });

    // mock useReservationStore (si tu hook lo usa)
    (useReservationStore as unknown as jest.Mock).mockImplementation((selector?: any) => {
      const state = {
        reservations: [],
        getAllReservationsByUser: jest.fn(),
      };
      return typeof selector === "function" ? selector(state) : state;
    });
  });

  it("carga reservas al montarse", async () => {
    const { result } = renderHook(() => useReservation());
    expect(result.current.reservations).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
