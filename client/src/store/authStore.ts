import { create } from "zustand";
import { User } from "@/type/User";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";
import { isAxiosError } from "axios";


interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  loginAdmin: (email: string, password: string) => Promise<void>;

  logout: () => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  persist: () => Promise<void>;
}

export const AuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      const authService = new AuthService();
      await authService.logout();
      set({ user: null });
    } catch (err) {
      console.error("Error logout:", err);
      set({ user: null });
    }
  },

  loginAdmin: async (email, password) => {
    try {
      const authService = new AuthService();
      const res = await authService.loginAdmin({ email, password });
      set({ user: res.user });
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message || err.message : "Error al iniciar sesión";
      toast.error(msg);
      throw err;
    }
  },

  loginWithGoogle: async (token: string) => {
    try {
      const authService = new AuthService();
      const res = await authService.getUserByGoogle({ token });
      set({ user: res.user });
    } catch (err) {
      console.error("Error Google login:", err);
      throw err;
    }
  },

  persist: async () => {
    try {
      const authService = new AuthService();
      const res = await authService.persist();
      set({ user: res.user });
    } catch (err) {
      console.error("Error persist session:", err);
      set({ user: null });
    }
  },
}));
