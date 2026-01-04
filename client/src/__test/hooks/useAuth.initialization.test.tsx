/**
 * @jest-environment jsdom
 */
import { renderHook,  waitFor } from "@testing-library/react";
import { useAuth } from "@/hook/useAuth";
import { AuthStore } from "@/store/authStore";
import { AuthService } from "@/services/authService";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/authStore", () => ({
  AuthStore: jest.fn(),
}));

jest.mock("@/services/authService");
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

describe("useAuth - Inicialización con cookies", () => {
  let mockLogout: jest.Mock;
  let mockSetUser: jest.Mock;
  let pushMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    mockLogout = jest.fn();
    mockSetUser = jest.fn();

    (AuthStore as unknown as jest.Mock).mockImplementation(() => ({
      user: null,
      setUser: mockSetUser,
      logout: mockLogout,
    }));
  });

  it("debe inicializar el usuario correctamente si persist() resuelve", async () => {
    (AuthService as jest.Mock).mockImplementation(() => ({
      persist: jest.fn().mockResolvedValue({
        user: { id: "1", name: "Test User", role: "user", email: "test@test.com" },
      }),
      logout: jest.fn(),
    }));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.initialized).toBe(true));

    expect(mockSetUser).toHaveBeenCalledWith({
      id: "1",
      name: "Test User",
      role: "user",
      email: "test@test.com",
    });
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("debe ejecutar logout si persist() lanza error 401", async () => {
    (AuthService as jest.Mock).mockImplementation(() => ({
      persist: jest.fn().mockRejectedValue({ response: { status: 401 } }),
      logout: jest.fn(),
    }));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.initialized).toBe(true));

    expect(mockLogout).toHaveBeenCalled();
  });

  it("debe inicializar sin logout si persist() lanza otro error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (AuthService as jest.Mock).mockImplementation(() => ({
      persist: jest.fn().mockRejectedValue(new Error("Backend error")),
      logout: jest.fn(),
    }));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.initialized).toBe(true));

    expect(mockLogout).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error verificando sesión:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("debe exponer funciones logout y loginWithGoogle", async () => {
    (AuthService as jest.Mock).mockImplementation(() => ({
      persist: jest.fn().mockResolvedValue({ user: null }),
      logout: jest.fn(),
    }));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.initialized).toBe(true));

    expect(typeof result.current.logout).toBe("function");
    expect(typeof result.current.loginWithGoogle).toBe("function");
  });
});
