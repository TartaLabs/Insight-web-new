import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc, mainnet, mantle } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Insight',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, mantle, bsc],
});
