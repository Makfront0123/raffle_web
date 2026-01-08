/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/hook/useAuth";
import { useRouter } from "next/navigation";

// ---------- mocks ----------
const mockLogout = jest.fn();
const mockPersist = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/authStore", () => ({
  AuthStore: Object.assign(
    jest.fn(() => ({
      user: {
        id: "1",
        name: "Test User",
        role: "user",
        email: "test@test.com",
      },
      logout: mockLogout,
      loginAdmin: jest.fn(),
      loginWithGoogle: jest.fn(),
      persist: mockPersist, // 👈 CLAVE
    })),
    {
      getState: jest.fn(() => ({
        user: {
          id: "1",
          name: "Test User",
          role: "user",
          email: "test@test.com",
        },
      })),
    }
  ),
}));

describe("useAuth - Inicialización con persist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("debe inicializar correctamente si persist() resuelve", async () => {
    mockPersist.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.initialized).toBe(true);
    });

    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("debe ejecutar logout si persist() lanza error", async () => {
    mockPersist.mockRejectedValueOnce(new Error("401"));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.initialized).toBe(true);
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  it("debe inicializar inmediatamente si skipPersist es true", async () => {
    const { result } = renderHook(() =>
      useAuth({ skipPersist: true })
    );

    await waitFor(() => {
      expect(result.current.initialized).toBe(true);
    });

    expect(mockPersist).not.toHaveBeenCalled();
  });

  it("debe exponer logout y loginWithGoogle", async () => {
    mockPersist.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.initialized).toBe(true);
    });

    expect(typeof result.current.logout).toBe("function");
    expect(typeof result.current.loginWithGoogle).toBe("function");
  });
});
