import { create } from 'zustand';
import type { User } from '../services/model/types';
import { apiTask, apiUser } from '../services/api';

interface UserState {
  user: User | null;
  pendingRewards: number;
  loading: boolean;
  initialized: boolean;
  fetchUserData: () => Promise<void>;
  fetchPendingRewards: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getWalletAddress: () => string;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  pendingRewards: 0,
  loading: false,
  error: null,
  initialized: false,

  fetchUserData: async () => {
    // 避免重复请求
    if (get().loading) return;

    set({ loading: true });
    try {
      const user = await apiUser.getUserData();
      set({ user, loading: false, initialized: true });
    } catch (error) {
      set({ loading: false, initialized: true });
      throw error;
    }
  },

  fetchPendingRewards: async () => {
    try {
      const pendingRewards = await apiTask.getClaimableAmount('DAILY');
      set({ pendingRewards });
    } catch (error) {
      console.error(error);
    }
  },

  getWalletAddress: () => {
    return get().user?.oauth_info?.wallet?.oauth_user?.id || '';
  },

  setUser: (user: User | null) => set({ user }),

  setPendingRewards: (pendingRewards: number) => set({ pendingRewards }),

  updateUser: (updates: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  setLoading: (loading: boolean) => set({ loading }),

  reset: () => {
    set({ user: null, pendingRewards: 0, loading: false, initialized: false });
    localStorage.removeItem('auth_token');
  },
}));
