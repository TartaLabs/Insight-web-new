import React, { useEffect } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo.tsx';
import { useQueryConfig } from '@/services/useQueryConfig.ts';
import { useSwitchChain } from 'wagmi';
import { useLocalStore } from '@/store/useLocalStore.ts';

interface AppBarProps {
  onExit: () => void;
}

/**
 * 顶部导航栏组件
 */
export const AppBar: React.FC<AppBarProps> = ({ onExit }) => {
  const { selectedChainId, setSelectedChainId } = useLocalStore();
  const { data: appConfig } = useQueryConfig();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    switchChain({ chainId: selectedChainId });
  }, [selectedChainId, switchChain]);

  function updateChainId(chainId: number) {
    setSelectedChainId(chainId);
  }

  return (
    <div className="fixed top-0 w-full z-40 bg-[#020205]/90 backdrop-blur-md border-b border-tech-blue/20 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8" />
        <div className="hidden md:block">
          <div className="font-bold tracking-tight font-mono text-tech-blue">INSIGHT WEB</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-tech-blue/5 rounded border border-tech-blue/20 px-2 py-1 relative">
          <div className="w-1.5 h-1.5 bg-tech-blue rounded-full animate-pulse" />
          <select
            value={selectedChainId || ''}
            onChange={(e) => updateChainId(Number(e.target.value))}
            className="appearance-none bg-transparent text-[10px] font-mono text-tech-blue tracking-widest uppercase pr-4 focus:outline-none cursor-pointer"
          >
            {appConfig?.chains?.map((chain) => (
              <option key={chain.chain_id} value={chain.chain_id}>
                {chain.name}
              </option>
            ))}
          </select>
          <ChevronDown size={10} className="absolute right-2 text-tech-blue pointer-events-none" />
        </div>

        <button
          onClick={onExit}
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest group"
        >
          <LogOut size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
};
