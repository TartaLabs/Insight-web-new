import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

// Roots
import { HomeRoot } from './roots/HomeRoot';
import { WebAppRoot } from './roots/WebAppRoot';

// Pages
import Home from './pages/Home';
import { PrivacyPolicy } from './pages/Privacy';
import { TermsOfUse } from './pages/Terms';
import { Support } from './pages/Support';
import { Login } from './pages/WebApp/components/Login';
import { WebApp } from './pages/WebApp';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRoot />,
    children: [
      { index: true, element: <Home /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsOfUse /> },
      { path: 'support', element: <Support /> },
    ],
  },
  {
    path: '/webapp',
    element: <WebAppRoot />,
    children: [
      { index: true, element: <Navigate to="contributions" replace /> },
      { path: 'login', element: <Login /> },
      { path: ':tab', element: <WebApp /> },
    ],
  },
  // 兜底路由：未匹配的路由重定向到首页
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
