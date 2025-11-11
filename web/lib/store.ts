/**
 * Zustand store for global state
 */
import { create } from "zustand";
import { UserResponse } from "./api";

interface AuthState {
  user: UserResponse | null;
  setUser: (user: UserResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

