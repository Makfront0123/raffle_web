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