import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia, mainnet, mantle } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Insight',
  projectId: '3fbb6bba6f1de962d911bb5b5c9dba88',
  chains: [mantle, arbitrumSepolia, arbitrum],
});

export function getChainById(chainId: number) {
  switch (chainId) {
    case 421614:
      return arbitrumSepolia;
    case 42161:
      return arbitrum;
    default:
      return mainnet;
  }
}
