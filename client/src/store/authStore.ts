import { create } from "zustand";
import { AuthService } from "@/services/authService";
import { User } from "@/type/User";
interface AuthState {
  user: User | null;
  initialized: boolean;
  persistChecked: boolean;

  setUser: (user: User | null) => void;
  persist: () => Promise<void>;
  logout: () => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
}

export const AuthStore = create<AuthState>((set, get) => ({
  user: null,
  initialized: false,
  persistChecked: false,

  setUser: (user) => set({ user }),

  persist: async () => {
    if (get().persistChecked || get().initialized) return;

    set({ persistChecked: true });

    try {
      const authService = new AuthService();
      const res = await authService.persist();

      set({
        user: res.user,
        initialized: true,
      });
    } catch {
      set({
        user: null,
        initialized: true,
      });
    }
  },

  logout: async () => {
    const authService = new AuthService();
    await authService.logout();
    set({ user: null });
  },

  loginAdmin: async (email, password) => {
    const authService = new AuthService();
    const res = await authService.loginAdmin({ email, password });
    set({ user: res.user });
  },

  loginWithGoogle: async (token) => {
    const authService = new AuthService();
    const res = await authService.getUserByGoogle({ token });
    set({ user: res.user });
  },
}));
