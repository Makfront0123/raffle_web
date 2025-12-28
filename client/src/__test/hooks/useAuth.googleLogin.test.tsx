/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hook/useAuth";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface GoogleOAuthClient {
    requestAccessToken: () => void;
}

interface GoogleAccounts {
    oauth2: {
        initTokenClient: (config: {
            callback: (response: { access_token: string }) => void;
        }) => GoogleOAuthClient;
    };
}

interface GoogleMock {
    accounts: GoogleAccounts;
}

// MOCK jwtDecode para evitar errores de token inválido
jest.mock("jwt-decode", () => ({
    jwtDecode: jest.fn().mockReturnValue({
        exp: Math.floor(Date.now() / 1000) + 3600,
        id: "1",
        name: "Armando Tester",
        email: "test@test.com",
        role: "admin",
    }),
}));

const mockSetUser = jest.fn();
const mockLogout = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/services/authService");

jest.mock("sonner", () => ({
    toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

jest.mock("@/store/authStore", () => ({
    AuthStore: jest.fn(() => ({
        user: null,
        token: null,
        setUser: mockSetUser,
        logout: mockLogout,
    })),
}));

beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(),
    });

    (globalThis as unknown as { google: GoogleMock }).google = {
        accounts: {
            oauth2: {
                initTokenClient: jest.fn().mockImplementation(
                    ({ callback }) => ({
                        requestAccessToken: () =>
                            callback({ access_token: "test-google-token" }),
                    })
                ),
            },
        },
    };

    Storage.prototype.setItem = jest.fn();
});


jest.useFakeTimers();

test("loginWithGoogle → ejecuta OAuth, obtiene usuario, guarda token y redirige", async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    const mockGetUserByGoogle = jest.fn().mockResolvedValue({
        token: "jwt-test-token",
    });

    const mockGetUserByToken = jest.fn().mockResolvedValue({
        user: {
            id: "1",
            name: "Armando Tester",
            role: "admin",
            email: "test@test.com",
        },
    });

    (AuthService as jest.Mock).mockImplementation(() => ({
        getUserByGoogle: mockGetUserByGoogle,
        getUserByToken: mockGetUserByToken,
    }));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
        result.current.loginWithGoogle();
    });

    act(() => {
        jest.runAllTimers();
    });

    expect(mockGetUserByGoogle).toHaveBeenCalledWith({
        token: "test-google-token",
    });

    expect(mockGetUserByToken).toHaveBeenCalledWith("jwt-test-token");

    expect(mockSetUser).toHaveBeenCalledWith(
        {
            id: "1",
            name: "Armando Tester",
            role: "admin",
            email: "test@test.com",
        },
        "jwt-test-token"
    );

    expect(localStorage.setItem).toHaveBeenCalledWith(
        "token",
        "jwt-test-token"
    );

    expect(toast.success).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
});

