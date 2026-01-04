/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hook/useAuth";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GoogleTokenResponse, GoogleTokenClient } from "@/type/GoogleUserData";

const mockSetUser = jest.fn();
const mockLogout = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/authStore", () => ({
  AuthStore: jest.fn(() => ({
    user: null,
    token: null,
    setUser: mockSetUser,
    logout: mockLogout,
  })),
}));

jest.mock("@/services/authService");
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();

  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

  // Mock de Google OAuth con tipos
  (globalThis as unknown as { google: { accounts: { oauth2: { initTokenClient: (opts: { callback: (resp: GoogleTokenResponse) => void }) => GoogleTokenClient } } } }).google = {
    accounts: {
      oauth2: {
        initTokenClient: jest.fn().mockImplementation(
          (opts: { callback: (resp: GoogleTokenResponse) => void }): GoogleTokenClient => ({
            requestAccessToken: () => opts.callback({ access_token: "test-google-token" }),
          })
        ),
      },
    },
  };
});

jest.useFakeTimers();

test("loginWithGoogle → ejecuta OAuth, obtiene usuario, muestra toast y actualiza store", async () => {
  const mockGetUserByGoogle = jest.fn().mockResolvedValue({
    user: {
      id: "1",
      name: "Armando Tester",
      role: "admin",
      email: "test@test.com",
    },
    token: "jwt-test-token",
  });

  (AuthService as jest.Mock).mockImplementation(() => ({
    getUserByGoogle: mockGetUserByGoogle,
  }));

  const { result } = renderHook(() => useAuth());

  await act(async () => {
    result.current.loginWithGoogle();
  });

  act(() => {
    jest.runAllTimers();
  });

  expect(mockGetUserByGoogle).toHaveBeenCalledWith({ token: "test-google-token" });
  expect(mockSetUser).toHaveBeenCalledWith({
    id: "1",
    name: "Armando Tester",
    role: "admin",
    email: "test@test.com",
  });
  expect(toast.success).toHaveBeenCalledWith("¡Bienvenido Armando Tester!");
});
