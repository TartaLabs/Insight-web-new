import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getDefaultChainId } from '@/wallet/wagmi.ts';

interface State {
  selectedChainId: number;
  mintedUSDTChainIds: number[];
}

interface Action {
  setSelectedChainId: (chainId: number) => void;
  setMintedUSDTChainIds: (chainIds: number[]) => void;
}

export const useLocalStore = create<State & Action>()(
  persist<State & Action>(
    (set) => ({
      selectedChainId: getDefaultChainId(),
      mintedUSDTChainIds: [],
      setSelectedChainId: (chainId) => set({ selectedChainId: chainId }),
      setMintedUSDTChainIds: (chainIds: number[]) => set({ mintedUSDTChainIds: chainIds }),
    }),
    {
      name: 'local_store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
