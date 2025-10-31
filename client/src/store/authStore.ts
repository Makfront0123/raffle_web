import { create } from "zustand";
import { persist } from "zustand/middleware";

 

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
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
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ token: state.token }), // solo guardamos token
    }
  )
);
