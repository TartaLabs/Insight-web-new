import React from 'react';

interface HudPanelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GameFi 风格的 HUD 面板组件
 * 带有科技感的边框装饰和网格背景
 */
export const HudPanel: React.FC<HudPanelProps> = ({
  children,
  className = '',
}) => (
  <div
    className={`relative bg-[#0a0a0f]/90 border border-tech-blue/20 ${className} overflow-hidden group`}
  >
    {/* Corner decorations */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-tech-blue" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-tech-blue" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-tech-blue" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-tech-blue" />
    
    {/* Grid background */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
    
    {/* Content */}
    <div className="relative z-10">{children}</div>
  </div>
);

