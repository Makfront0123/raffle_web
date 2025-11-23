import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { AuthService } from "@/services/authService";


interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken?: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
  devLogin: (email: string) => Promise<void>;
  refreshTokenFn: (refreshToken: string) => Promise<void>;
}

export const AuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => {
        set({ user, token });
      },


      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("token");
        toast.info("Sesión cerrada.");
      },

      devLogin: async (email: string) => {
        try {
          const authService = new AuthService();
          const { user, token } = await authService.devLogin(email);

          set({ user, token });
          localStorage.setItem("token", token);
          toast.success(`Has iniciado sesión como ${user.name || email}`);
        } catch (error: any) {
          console.error("Error en devLogin:", error);
          toast.error("Error iniciando sesión en modo desarrollador");
        }
      },

      refreshTokenFn: async (refreshToken: string) => {
        try {
          const authService = new AuthService();
          const { token } = await authService.refreshToken(refreshToken);
          set({ token });
          toast.success("Token actualizado correctamente.");
        } catch (error) {
          console.error("Error refrescando token:", error);
          toast.error("Error actualizando el token.");
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
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