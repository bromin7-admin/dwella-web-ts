import { create } from "zustand";

interface AuthState {
  isOpen: boolean;
  user: any | null;
  openAuth: () => void;
  closeAuth: () => void;
  setUser: (user: any | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  isOpen: false,
  user: null,

  openAuth: () => set({ isOpen: true }),
  closeAuth: () => set({ isOpen: false }),

  setUser: (user) => set({ user }),
}));