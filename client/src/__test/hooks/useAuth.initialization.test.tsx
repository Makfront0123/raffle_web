/**
 * @file __tests__/useAuth.initialization.test.tsx
 * Test: Inicialización del usuario desde localStorage + validación del token
 */

import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hook/useAuth";
import { AuthStore } from "@/store/authStore";
import { AuthService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

 
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// mock store
jest.mock("@/store/authStore", () => ({
  AuthStore: jest.fn(),
}));

// mock jwt-decode
jest.mock("jwt-decode");

// mock AuthService
jest.mock("@/services/authService");

// mock toast para evitar errores
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => (store[key] = value)),
    removeItem: jest.fn((key) => delete store[key]),
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// mock google OAuth
Object.defineProperty(window, "google", {
  value: {
    accounts: {
      oauth2: {
        initTokenClient: jest.fn().mockReturnValue({
          requestAccessToken: jest.fn(),
        }),
      },
    },
  },
});

describe("useAuth - Inicialización del usuario desde localStorage", () => {
  let pushMock: jest.Mock;
  let mockSetUser: jest.Mock;
  let mockLogout: jest.Mock;
  let mockGetUserByToken: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();

    // router mock
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // store mock
    mockSetUser = jest.fn();
    mockLogout = jest.fn();
    (AuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      setUser: mockSetUser,
      logout: mockLogout,
    });

    // AuthService mock
    mockGetUserByToken = jest.fn();
    (AuthService as jest.Mock).mockImplementation(() => ({
      getUserByToken: mockGetUserByToken,
    }));
  });

  // ---------------------------
  // 1. Token válido
  // ---------------------------
  it("debe inicializar el usuario si el token de localStorage es válido", async () => {
    const fakeToken = "FAKE_JWT";
    localStorageMock.setItem("token", fakeToken);

    // mock jwt decode
    (jwtDecode as jest.Mock).mockReturnValue({
      id: "123",
      email: "test@example.com",
      role: "user",
      name: "Armando",
      exp: Date.now() / 1000 + 60, // expira en 1 minuto
    });

    // mock persist token backend
    mockGetUserByToken.mockResolvedValue({
      user: { id: "123", email: "test@example.com", role: "user", name: "Armando" },
    });

    await act(async () => {
      renderHook(() => useAuth());
    });

    // Se llama a setUser por data local y luego por backend
    expect(mockSetUser).toHaveBeenCalledTimes(2);
    expect(mockLogout).not.toHaveBeenCalled();
  });

  // ---------------------------
  // 2. Token inválido → logout
  // ---------------------------
  it("debe ejecutar logout si jwtDecode lanza error", async () => {
    const fakeToken = "INVALID";
    localStorageMock.setItem("token", fakeToken);

    (jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error("invalid token");
    });

    await act(async () => {
      renderHook(() => useAuth());
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  // ---------------------------
  // 3. Token expirado → logout
  // ---------------------------
  it("debe ejecutar logout si el token está expirado", async () => {
    localStorageMock.setItem("token", "FAKE");

    (jwtDecode as jest.Mock).mockReturnValue({
      exp: Date.now() / 1000 - 10, // expirado hace 10s
    });

    await act(async () => {
      renderHook(() => useAuth());
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  // ---------------------------
  // 4. Backend falla → logout
  // ---------------------------
  it("debe ejecutar logout si getUserByToken falla", async () => {
    const fakeToken = "FAKE_JWT";
    localStorageMock.setItem("token", fakeToken);

    (jwtDecode as jest.Mock).mockReturnValue({
      id: "123",
      email: "test@example.com",
      role: "user",
      exp: Date.now() / 1000 + 60,
    });

    mockGetUserByToken.mockRejectedValue(new Error("backend error"));

    await act(async () => {
      renderHook(() => useAuth());
    });

    expect(mockLogout).toHaveBeenCalled();
  });
});
