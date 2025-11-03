import { AuthService } from "@/services/authService";
import { create } from "zustand";
import { persist } from "zustand/middleware";



interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
  devLogin: (email: string) => Promise<void>;
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

    }),
    {
      name: "auth-store",
      partialize: (state) => ({ token: state.token }), // solo guardamos token
    }
  )
);
