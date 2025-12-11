import { create } from 'zustand';
import type { Pro } from '../services/model/types';
import { apiPro } from '../services/api';

interface ProState {
  pro: Pro | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  fetchProVersion: () => Promise<void>;
  setPro: (pro: Pro | null) => void;
  updatePro: (updates: Partial<Pro>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProStore = create<ProState>((set, get) => ({
  pro: null,
  loading: false,
  error: null,
  initialized: false,

  fetchProVersion: async () => {
    // 避免重复请求
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const pro = await apiPro.getProVersion();
      set({ pro, loading: false, initialized: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pro version';
      set({ error: errorMessage, loading: false, initialized: true });
    }
  },

  setPro: (pro: Pro | null) => set({ pro }),

  updatePro: (updates: Partial<Pro>) =>
    set((state) => ({
      pro: state.pro ? { ...state.pro, ...updates } : null,
    })),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  reset: () => set({ pro: null, loading: false, error: null, initialized: false }),
}));

