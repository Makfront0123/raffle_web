import { AuthService } from "@/services/authService";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface AuthState {
  user: User | null;
  token: string | null; // access token
  refreshToken: string | null;
  setUser: (user: User | null, token?: string | null, refreshToken?: string | null) => void;
  logout: () => void;
  devLogin: (email: string) => Promise<void>;
  updateToken: (token: string) => void;
}

const authService = new AuthService();

export const AuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,

      setUser: (user, token, refreshToken) =>
        set((state) => ({
          user,
          token: token ?? state.token,
          refreshToken: refreshToken ?? state.refreshToken,
        })),

      updateToken: (token) => set({ token }),

      logout: () => {
        set({ user: null, token: null, refreshToken: null });
        localStorage.removeItem("token");
        localStorage.removeItem("auth-store");
      },

      devLogin: async (email: string) => {
        try {
          const { user, token, refreshToken } = await authService.devLogin(email);
          set({ user, token, refreshToken });
          localStorage.setItem("token", token);
        } catch (err) {
          console.error("Error en login dev:", err);
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);


/*

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
  devLogin: (email: string) => Promise<void>;
  refreshToken: (refreshToken: string) => Promise<void>;
}
const authService = new AuthService();

async function loginDev() {
  const { user, token } = await authService.devLogin("user1@test.com");
  localStorage.setItem("token", token);
  console.log("Usuario de prueba logueado:", user);
}

export const AuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user, token) =>
        set((state) => ({
          user,
          token: token ?? state.token, // ← si no se pasa token, conserva el actual
        })),

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("token");
        localStorage.removeItem("auth-store"); // 👈 borra el persist de Zustand
      },

      devLogin: async (email: string) => {
        try {
          const { user, token } = await authService.devLogin(email);
          set({ user, token });
        } catch (err) {
          console.error("Error al iniciar sesión en modo dev:", err);
        }
      },

      refreshToken: async (refreshToken: string) => {
        try {
          const { token } = await authService.refreshToken(refreshToken);
          set({ token });
        } catch (err) {
          console.error("Error al actualizar el token:", err);
        }
      },

    }),
    {
      name: "auth-store",
      partialize: (state) => ({ token: state.token }), // solo guardamos token
    }
  )
);

*/