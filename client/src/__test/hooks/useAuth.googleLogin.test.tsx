/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hook/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GoogleTokenResponse, GoogleTokenClient } from "@/type/GoogleUserData";

// ---------- mocks ----------
const mockPush = jest.fn();
const mockLogout = jest.fn();
const mockLoginAdmin = jest.fn();
const mockStoreLoginWithGoogle = jest.fn().mockResolvedValue(undefined);
const mockPersist = jest.fn().mockResolvedValue(undefined);

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("@/store/authStore", () => {
  const state = {
    user: {
      id: "1",
      name: "Armando Tester",
      role: "admin",
      email: "test@test.com",
    },
  };

  return {
    AuthStore: Object.assign(
      jest.fn(() => ({
        ...state,
        logout: mockLogout,
        loginAdmin: mockLoginAdmin,
        loginWithGoogle: mockStoreLoginWithGoogle,
        persist: mockPersist,
      })),
      {
        getState: jest.fn(() => state),
      }
    ),
  };
});

// ---------- setup ----------
beforeEach(() => {
  jest.clearAllMocks();

  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

  // Mock Google OAuth SDK
  (globalThis as unknown as {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (opts: {
            callback: (resp: GoogleTokenResponse) => void;
          }) => GoogleTokenClient;
        };
      };
    };
  }).google = {
    accounts: {
      oauth2: {
        initTokenClient: jest.fn().mockImplementation(
          (opts): GoogleTokenClient => ({
            requestAccessToken: () =>
              opts.callback({ access_token: "test-google-token" }),
          })
        ),
      },
    },
  };
});

jest.useFakeTimers();

// ---------- test ----------
test("loginWithGoogle → ejecuta OAuth, obtiene usuario, muestra toast y actualiza store", async () => {
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    result.current.loginWithGoogle();
    jest.runAllTimers();
  });

  expect(mockStoreLoginWithGoogle).toHaveBeenCalledWith("test-google-token");

  expect(toast.success).toHaveBeenCalledWith(
    "¡Bienvenido Armando Tester!"
  );
});
