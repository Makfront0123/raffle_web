/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useTickets } from "@/hook/useTickets";
import { useTicketStore } from "@/store/ticketStore";
import { AuthStore } from "@/store/authStore";

jest.mock("@/store/ticketStore");
jest.mock("@/store/authStore");

describe("useTickets", () => {
  const mockGetTickets = jest.fn();

  // ---- Zustand FIX ----
  const mockUseTicketStore = useTicketStore as unknown as jest.Mock;
  const mockAuthStore = AuthStore as unknown as jest.Mock;
  // ----------------------

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTicketStore.mockReturnValue({
      tickets: [{ id: 1 }],
      getTickets: mockGetTickets,
    });

    mockAuthStore.mockReturnValue({
      token: "abc123",
    });
  });

  it("carga tickets exitosamente", async () => {
    const { result } = renderHook(() => useTickets());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await result.current.fetchTickets();
    });

    expect(mockGetTickets).toHaveBeenCalledWith("abc123");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("maneja errores al cargar tickets", async () => {
    mockGetTickets.mockRejectedValueOnce(new Error("fail"));

    const { result } = renderHook(() => useTickets());

    await act(async () => {
      await result.current.fetchTickets();
    });

    expect(result.current.error).toBe("Error cargando tickets");
  });

  it("no rompe si no hay token", async () => {
    mockAuthStore.mockReturnValue({ token: null });

    const { result } = renderHook(() => useTickets());

    await act(async () => {
      await result.current.fetchTickets();
    });

    // en tu hook usas "" cuando token es null
    expect(mockGetTickets).toHaveBeenCalledWith("");
  });
});

 