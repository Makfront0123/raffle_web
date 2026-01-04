import { useReservation } from "@/hook/useReservation";
import { AuthStore } from "@/store/authStore";
import { useReservationStore } from "@/store/reservationStore";
import { renderHook } from "@testing-library/react";

interface MockAuthState {
  token: string;
  user: { id: string };
}

interface MockReservationState {
  reservations: any[];
  getAllReservationsByUser: jest.Mock;
}

jest.mock("@/hook/useReservation", () => ({
  useReservation: jest.fn(),
}));

jest.mock("@/store/authStore");
jest.mock("@/store/reservationStore");

describe("useReservation Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // mock AuthStore tipado
    (AuthStore as unknown as jest.Mock).mockImplementation(
      (selector?: (state: MockAuthState) => any) => {
        const state: MockAuthState = { token: "TEST_TOKEN", user: { id: "user1" } };
        return selector ? selector(state) : state;
      }
    );

    // mock useReservation
    (useReservation as jest.Mock).mockReturnValue({
      reservations: [],
      loading: false,
      error: null,
      fetchReservations: jest.fn(),
    });

    // mock useReservationStore tipado
    (useReservationStore as unknown as jest.Mock).mockImplementation(
      (selector?: (state: MockReservationState) => any) => {
        const state: MockReservationState = {
          reservations: [],
          getAllReservationsByUser: jest.fn(),
        };
        return selector ? selector(state) : state;
      }
    );
  });

  it("carga reservas al montarse", async () => {
    const { result } = renderHook(() => useReservation());

    expect(result.current.reservations).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
