# Insight Web App

Insight 是一套“情感 AI 基础设施”前端应用：包含品牌落地页与 WebApp 工作区，支持钱包登录、情感数据贡献、奖励领取、排行榜与订阅升级等流程。

## 用户流程图

```mermaid
flowchart TD
  A[访问官网] --> B{进入 WebApp?}
  B -->|了解生态| C[浏览 Vision / App / SDK]
  B -->|Launch App| D[连接钱包]
  D --> E[签名登录]
  E --> F{新用户?}
  F -->|是| G[填写昵称/邀请码/同意协议]
  F -->|否| H[进入工作区]
  G --> H
  H --> I[贡献任务]
  I --> I1[选择情绪任务<br/>HAPPY / SAD / ANGRY / FEAR / SURPRISE / DISGUST / NEUTRAL]
  I1 --> I2[开始采集或上传表情数据]
  I2 --> I3[标注问答<br/>情绪类型锁定]
  I3 --> I4[提交任务]
  I4 --> I5{审核结果}
  I5 -->|通过| N[领取奖励/交易确认]
  I5 -->|退回| I6[查看原因并重提]
  I6 --> I2
  H --> J[账本与奖励]
  H --> K[排行榜]
  H --> L[邀请与分享]
  H --> M[订阅与升级]
  J --> N
  M --> N
  H --> O[退出/断开钱包]
```

## 架构

```mermaid
flowchart LR
  UI[UI Layer<br/>React + Router + Framer Motion] --> State[State<br/>Zustand Stores]
  UI --> Web3[Web3<br/>RainbowKit + Wagmi + Viem]
  UI --> Services[Services<br/>Axios API Client]
  Services --> API[Backend APIs<br/>/api/1/*]
  UI --> Assets[Assets & UI Components]
```

- 路由与页面：`src/router.tsx` + `src/pages/*` 组织落地页与 WebApp。
- WebApp 工作区：`src/pages/WebApp` 负责登录、任务、排行榜、邀请与订阅。
- 状态管理：`src/store/*` 使用 Zustand 管理用户、任务与订阅状态。
- 服务层：`src/services/*` 封装 API 调用，默认指向 TartaLabs 的后端域名。
- Web3 登录：`wagmi` + `@rainbow-me/rainbowkit` 负责钱包连接与签名。

## 开源依赖项

运行时核心依赖（部分）：

- React 19 / React DOM
- React Router 7
- Vite 7
- Zustand
- Axios
- Framer Motion
- RainbowKit + Wagmi + Viem
- Lucide React
- Three.js
- React Hot Toast

完整依赖列表请见 `package.json`。

## 部署说明

### 环境变量

在项目根目录创建 `.env.local`：

```bash
GEMINI_API_KEY=your_api_key
```

> `GEMINI_API_KEY` 会在 `vite.config.ts` 中注入到前端环境。

### 本地开发

```bash
npm install
npm run dev
```

### 生产构建

```bash
npm run build
```

构建产物位于 `dist/`，可部署到任意静态托管（如 Nginx / Vercel / Netlify）。  
如需切换后端 API 地址，请调整 `src/services/request.ts` 的 `baseUrl` 配置。
