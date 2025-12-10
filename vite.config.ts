import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // 从环境变量读取端口，优先级：process.env.PORT > VITE_PORT > 默认值 3000
    // 注意：命令行参数 --port 会覆盖此配置
    const port = parseInt(process.env.PORT || env.VITE_PORT || env.PORT || '3000', 10);
    
    return {
      server: {
        port: port,
        host: '0.0.0.0',
      },
      preview: {
        port: port, // 使用环境变量或默认值，命令行参数会覆盖此值
        host: '0.0.0.0',
        allowedHosts: [
          '.tartalabs.io', // 允许所有 tartalabs.io 子域名
          'localhost',
          '127.0.0.1',
        ],
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
