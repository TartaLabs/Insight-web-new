import { create } from 'zustand';
import type { User } from '../services/model/types';
import { apiUser } from '../services/api';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  fetchUserData: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  fetchUserData: async () => {
    // 避免重复请求
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const user = await apiUser.getUserData();
      set({ user, loading: false, initialized: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data';
      set({ error: errorMessage, loading: false, initialized: true });
    }
  },

  setUser: (user: User | null) => set({ user }),

  updateUser: (updates: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  reset: () => set({ user: null, loading: false, error: null, initialized: false }),
}));
