import { create } from "zustand";

interface UserState {
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null, token: null }),
    
}));