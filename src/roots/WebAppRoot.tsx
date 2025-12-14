import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useUserStore } from '../store/userStore';
import { useProStore } from '../store/proStore';
import { useTaskStore } from '../store/taskStore';
import { LoadingScreen } from '../pages/WebApp/components/LoadingScreen';

type InitState = 'idle' | 'loading' | 'inited' | 'unInit';

/**
 * WebApp 根组件
 * 职责：
 * 1. 检查登录状态（通过获取用户数据）
 * 2. 已登录 -> 加载认证数据 -> 渲染工作台
 * 3. 未登录 -> 重定向到登录页
 */
export const WebAppRoot: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInitializing = useRef(false);

  const { fetchUserData, fetchPendingRewards, user } = useUserStore();
  const { fetchProVersion, fetchProVersionList } = useProStore();
  const { fetchDailyTasks } = useTaskStore();

  const [initState, setInitState] = useState<InitState>('idle');

  const isLoginPage = location.pathname === '/webapp/login';

  // 加载认证数据
  const initBizData = async () => {
    await Promise.all([
      fetchPendingRewards(),
      fetchProVersion(),
      fetchProVersionList(),
      fetchDailyTasks(),
    ]);
  };

  // 初始化：检查登录状态并加载数据
  useEffect(() => {
    // 登录页面不需要初始化
    if (isLoginPage) {
      return;
    }

    // 已经初始化完成或正在初始化中，不再重复
    if (initState === 'loading' || initState === 'inited') {
      return;
    }

    // 防止重复执行
    if (isInitializing.current) {
      return;
    }
    isInitializing.current = true;

    const init = async () => {
      setInitState('loading');

      try {
        // 如果用户不存在，先尝试获取用户数据
        if (!user) {
          await fetchUserData();
        }

        // 加载认证数据
        await initBizData();
        setInitState('inited');
      } catch (error) {
        console.error('Failed to initialize:', error);
        setInitState('unInit');
        navigate('/webapp/login', { replace: true });
      } finally {
        isInitializing.current = false;
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginPage]);

  // 登录页面直接渲染
  if (isLoginPage) {
    return <Outlet />;
  }

  // 加载中或初始状态
  if (initState !== 'inited') {
    return <LoadingScreen />;
  }

  // 已认证，渲染子路由
  return <Outlet />;
};
