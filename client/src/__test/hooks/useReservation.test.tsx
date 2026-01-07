import { renderHook,waitFor } from "@testing-library/react";
import { useReservationStore } from "@/store/reservationStore";
import { AuthStore } from "@/store/authStore";
import { useReservation } from "@/hook/useReservation";

jest.mock("@/store/reservationStore", () => ({
  useReservationStore: jest.fn(),
}));

jest.mock("@/store/authStore", () => ({
  AuthStore: jest.fn(),
}));

const mockUseReservationStore = useReservationStore as unknown as jest.Mock;
const mockGetAllReservationsByUser = jest.fn();

describe("useReservation Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReservationStore.mockImplementation((selector) =>
      selector({
        reservations: [],
        getAllReservationsByUser: mockGetAllReservationsByUser,
      })
    );

    (AuthStore as unknown as jest.Mock).mockImplementation(() => ({
      user: { id: 1, name: "Test User" },
    }));
  });

  test("carga reservas al montarse", async () => {
    mockGetAllReservationsByUser.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useReservation());

    expect(result.current.loading).toBe(true);


    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetAllReservationsByUser).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
