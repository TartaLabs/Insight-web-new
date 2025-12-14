import React from 'react';
import { Outlet } from 'react-router';
import { GlobalScrollEffects } from '../components/GlobalScrollEffects';

/**
 * 首页根组件
 * 包含全局滚动效果和基础样式
 */
export const HomeRoot: React.FC = () => {
  return (
    <div className="min-h-screen bg-deep-bg text-white font-sans overflow-x-hidden selection:bg-tech-blue selection:text-black">
      <GlobalScrollEffects />
      <Outlet />
    </div>
  );
};
