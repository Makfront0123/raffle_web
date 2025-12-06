/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hook/useAuth";
import { AuthStore } from "@/store/authStore";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

    (global as any).google = {
        accounts: {
            oauth2: {
                initTokenClient: jest.fn().mockImplementation(({ callback }) => ({
                    requestAccessToken: () =>
                        callback({ access_token: "test-google-token" }),
                })),
            },
        },
    };

    Storage.prototype.setItem = jest.fn();
});

test("loginWithGoogle → ejecuta OAuth, obtiene usuario, guarda token y redirige", async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (AuthService as jest.Mock).mockImplementation(() => ({
        getUserByGoogle: jest.fn().mockResolvedValue({
            user: {
                id: "1",
                name: "Armando Tester",
                role: "admin",
                email: "test@test.com",
            },
            token: "jwt-test-token",
        }),
    }));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
        result.current.loginWithGoogle();
    });

    expect(
        (AuthService as jest.Mock).mock.calls[0][0]?.getUserByGoogle ??
        (AuthService as jest.Mock).mock.results[0].value.getUserByGoogle
    ).toHaveBeenCalledWith({ token: "test-google-token" });


    // 2️⃣ Estado guardado
    expect(mockSetUser).toHaveBeenCalledWith(
        {
            id: "1",
            name: "Armando Tester",
            role: "admin",
            email: "test@test.com",
        },
        "jwt-test-token"
    );

    // 3️⃣ Token en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
        "token",
        "jwt-test-token"
    );

    // 4️⃣ Toast
    expect(toast.success).toHaveBeenCalled();

    // 5️⃣ Redirección
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
});
