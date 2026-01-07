import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  arbitrumSepolia,
  bsc,
  mainnet,
  mantle,
  mantleSepoliaTestnet,
} from 'wagmi/chains';

export const getDefaultChainId = () => {
  return process.env.NODE_ENV !== 'production' ? 5000 : 5000;
};

export const config = getDefaultConfig({
  appName: 'Insight',
  projectId: '3fbb6bba6f1de962d911bb5b5c9dba88',
  chains:
    process.env.NODE_ENV !== 'production' ? [mantle, mantleSepoliaTestnet, bsc] : [mantle, bsc],
});

export function getChainById(chainId: number) {
  switch (chainId) {
    case 421614:
      return arbitrumSepolia;
    case 42161:
      return arbitrum;
    case 56:
      return bsc;
    case 5000:
      return mantle;
    case 5003:
      return mantleSepoliaTestnet;
    default:
      return mainnet;
  }
}
