import { renderHook, act } from "@testing-library/react";
 
jest.mock("@/store/reservationStore", () => ({
  useReservationStore: jest.fn(),
}));

jest.mock("@/store/authStore", () => ({
  AuthStore: jest.fn(),
}));

import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";
import { useReservation } from "@/hook/useReservation";

// Convertimos el store a mock SIN romper Zustand
const mockUseReservationStore = useReservationStore as unknown as jest.Mock;

const mockGetAllReservationsByUser = jest.fn();

describe("useReservation Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de Zustand
    mockUseReservationStore.mockImplementation((selector) =>
      selector({
        reservations: [],
        getAllReservationsByUser: mockGetAllReservationsByUser,
      })
    );

    // Mock del token
    (AuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ token: "TEST_TOKEN" })
    );
  });

  test("carga reservas al montarse", async () => {
    mockGetAllReservationsByUser.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useReservation());

    expect(result.current.loading).toBe(true);

    await act(async () => {});

    expect(mockGetAllReservationsByUser).toHaveBeenCalledWith("TEST_TOKEN");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
