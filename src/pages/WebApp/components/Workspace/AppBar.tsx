import React from 'react';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo.tsx';
import { useAccount } from 'wagmi';

interface AppBarProps {
  onExit: () => void;
}

/**
 * 顶部导航栏组件
 */
export const AppBar: React.FC<AppBarProps> = ({ onExit }) => {
  const { chain } = useAccount();
  return (
    <div className="fixed top-0 w-full z-40 bg-[#020205]/90 backdrop-blur-md border-b border-tech-blue/20 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8" />
        <div className="hidden md:block">
          <div className="font-bold tracking-tight font-mono text-tech-blue">INSIGHT WEB</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-tech-blue/5 rounded border border-tech-blue/20 px-3 py-1">
          <div className="w-1.5 h-1.5 bg-tech-blue rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-tech-blue tracking-widest">
            {chain?.name?.toUpperCase()}
          </span>
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
