import React from 'react';
import { Logo } from '../../../components/Logo';

/**
 * 全屏阻塞式加载组件
 * 在应用初始化数据加载期间显示
 */
export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#020205] flex flex-col items-center justify-center font-mono">
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,243,255,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 内容区域 */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo 和旋转边框 */}
        <div className="relative">
          <div className="absolute inset-0 w-24 h-24 border-2 border-tech-blue/30 rounded-full animate-spin-slow" />
          <div className="absolute inset-0 w-24 h-24 border-2 border-transparent border-t-tech-blue rounded-full animate-spin" />
          <div className="w-24 h-24 flex items-center justify-center">
            <Logo className="w-12 h-12 animate-pulse" />
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-white tracking-[0.3em] uppercase mb-2">
            INSIGHT WEB
          </h1>
          <div className="text-[10px] text-tech-blue tracking-[0.2em]">
            INITIALIZING SYSTEM
          </div>
        </div>

        {/* 加载进度条 */}
        <div className="w-64 h-1 bg-white/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tech-blue to-transparent animate-loading-bar" />
        </div>

        {/* 加载状态文字 */}
        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-tech-blue rounded-full animate-pulse" />
          <span>Loading data...</span>
        </div>

        {/* 装饰性 HUD 角落 */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 border-t-2 border-l-2 border-tech-blue/30" />
        <div className="absolute top-1/4 right-1/4 w-4 h-4 border-t-2 border-r-2 border-tech-blue/30" />
        <div className="absolute bottom-1/4 left-1/4 w-4 h-4 border-b-2 border-l-2 border-tech-blue/30" />
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 border-b-2 border-r-2 border-tech-blue/30" />
      </div>

      {/* 底部网络状态 */}
      <div className="absolute bottom-8 flex items-center gap-2 text-[9px] text-gray-600 font-mono">
        <div className="w-1 h-1 bg-tech-blue rounded-full" />
        <span>MANTLE MAINNET</span>
      </div>
    </div>
  );
};

