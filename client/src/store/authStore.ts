import { create } from "zustand";

 
interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
}

export const AuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
