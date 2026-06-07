import { create } from 'zustand';

interface AuthUser {
  email: string;
  role: 'admin' | 'customer';
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setSession: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
