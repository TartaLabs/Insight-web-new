import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia, mantle } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Insight',
  projectId: '3fbb6bba6f1de962d911bb5b5c9dba88',
  chains: [mantle, arbitrumSepolia, arbitrum],
});
