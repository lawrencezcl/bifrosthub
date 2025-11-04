# BifrostHub 项目概述

## 项目简介

BifrostHub 是一个一站式流动性质押管理平台，专为区块链用户设计。它整合了多链资产管理、自动化收益优化、Gas 费用优化和智能风险管理等功能，为用户提供完整的 DeFi 资产管理解决方案。

### 核心功能

1. **资产仪表板 (Asset Dashboard)**
   - 多链资产实时查看和管理
   - 资产分布可视化（饼图）
   - 收益趋势分析（折线图）
   - 自动刷新资产数据

2. **Bifrost vToken 铸造与赎回**
   - 支持多种 vToken 铸造（vDOT, vKSM, vGLMR, vASTR, vFIL）
   - 标准赎回和快速赎回两种模式
   - 实时网络状态监控

3. **收益路由器 (Yield Router)**
   - 智能匹配最优收益策略
   - 多协议收益对比
   - 风险评分和 TVL 展示

4. **Gas 优化器 (Gas Optimizer)**
   - 实时 Gas 价格监控
   - 历史 Gas 趋势分析
   - 最佳交易时机建议

5. **风险管理器 (Risk Manager)**
   - 实时风险评估
   - 多级别风险告警
   - 资产风险可视化

6. **AI 智能质押助手**
   - AI 驱动的质押建议
   - 自然语言交互
   - 个性化策略推荐

## 技术栈

- **前端框架**: React 18.3.1 + TypeScript 5.6.2 + Vite 6.0.1
- **区块链集成**: 
  - Polkadot API (@polkadot/api) 用于 Polkadot 生态系统交互
  - Ethers.js 6.15.0 用于 Ethereum 区块链交互
  - Polkadot Extension Dapp 用于钱包扩展集成
- **UI 组件库**: 
  - Radix UI (无障碍、可定制的 UI 组件)
  - Tailwind CSS (实用优先的 CSS 框架)
  - Recharts (数据可视化图表库)
- **状态管理与工具**:
  - React Hook Form + Zod (表单管理与数据验证)
  - i18next + react-i18next (国际化方案)
  - Sonner (Toast 通知组件)
- **数据存储**: Supabase (后端即服务)

## 项目结构

```
bifrosthub/
├── public/                     # 静态资源
├── src/
│   ├── components/            # React 组件
│   │   ├── AssetDashboard.tsx           # 资产仪表板
│   │   ├── BifrostMintInterface.tsx     # Bifrost 铸造界面
│   │   ├── BifrostRedeemInterface.tsx   # Bifrost 赎回界面
│   │   ├── GasOptimizer.tsx             # Gas 优化器
│   │   ├── Header.tsx                   # 页头组件
│   │   ├── IntelligentStakingAssistant.tsx  # AI 助手
│   │   ├── RiskManager.tsx              # 风险管理器
│   │   └── YieldRouter.tsx              # 收益路由器
│   ├── config/               # 配置文件
│   │   ├── bifrost.ts                   # Bifrost 网络配置
│   │   ├── moonbase.ts                  # Moonbase 配置
│   │   └── testnet.ts                   # 测试网配置
│   ├── contexts/             # React Context
│   │   └── Web3Context.tsx              # Web3 连接上下文
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useBifrostVTokens.ts         # Bifrost vToken Hook
│   │   ├── useMoonbaseVTokens.ts        # Moonbase vToken Hook
│   │   └── useRealData.ts               # 真实数据 Hook
│   ├── i18n/                 # 国际化
│   │   └── index.ts                     # i18n 配置
│   ├── lib/                  # 工具库
│   │   ├── supabase.ts                  # Supabase 客户端
│   │   └── utils.ts                     # 工具函数
│   ├── types/                # TypeScript 类型定义
│   ├── App.tsx               # 应用主组件
│   ├── main.tsx              # 应用入口
│   └── vite-env.d.ts         # Vite 环境类型
├── package.json              # 项目依赖和脚本
└── vite.config.ts            # Vite 配置
```

## 构建与运行

### 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

应用将在 `http://localhost:5173` 启动

### 生产构建

```bash
# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

### 代码质量

```bash
# 运行代码检查
pnpm lint
```

## 开发规范

1. **代码风格**: 使用 ESLint 和 TypeScript 进行代码质量控制
2. **组件开发**: 使用 Radix UI 和 Tailwind CSS 构建组件
3. **状态管理**: 通过 React Context (如 Web3Context) 管理全局状态
4. **数据获取**: 使用自定义 Hooks (如 useRealData) 封装数据逻辑
5. **国际化**: 通过 i18next 实现多语言支持
6. **类型安全**: 充分利用 TypeScript 类型系统确保类型安全

## 核心模块说明

### Web3 连接管理 (Web3Context)

提供统一的 Web3 连接管理，支持：
- MetaMask (Ethereum) 自动连接和断开
- Polkadot.js Extension 集成
- 多端点自动重试机制
- 网络状态监控
- 本地存储连接状态

### 数据获取 (useRealData Hook)

封装了与区块链交互的逻辑，包括：
- 获取以太坊账户余额
- 获取 ERC20 代币余额
- 获取 Polkadot 账户信息
- 获取 Gas 价格
- 获取收益数据

### 路由与导航

应用使用简单的状态管理实现标签页导航，通过 `activeTab` 状态控制显示的组件。

## 部署

项目支持多种部署方式：
1. Vercel
2. Netlify
3. Docker

构建产物位于 `dist/` 目录，可直接部署到支持静态文件托管的服务。