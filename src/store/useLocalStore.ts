import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getDefaultChainId } from '@/wallet/wagmi.ts';

interface State {
  selectedChainId: number;
  mintedUSDTChainIds: number[];
  tokenSymbol: string;
}

interface Action {
  setSelectedChainId: (chainId: number) => void;
  setMintedUSDTChainIds: (chainIds: number[]) => void;
  setTokenSymbol: (symbol: string) => void;
}

export const useLocalStore = create<State & Action>()(
  persist<State & Action>(
    (set) => ({
      selectedChainId: getDefaultChainId(),
      mintedUSDTChainIds: [],
      tokenSymbol: 'mEMO',
      setSelectedChainId: (chainId) => set({ selectedChainId: chainId }),
      setMintedUSDTChainIds: (chainIds: number[]) => set({ mintedUSDTChainIds: chainIds }),
      setTokenSymbol: (symbol: string) => set({ tokenSymbol: symbol }),
    }),
    {
      name: 'local_store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
