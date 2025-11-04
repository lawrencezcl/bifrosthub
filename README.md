# BifrostHub 🌉

> **一站式流动性质押管理平台** - 跨链资产管理、智能收益路由、Gas 优化和风险管理的综合解决方案

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**简体中文** | [English](./README.en.md)

---

## 📋 目录

- [项目简介](#项目简介)
- [核心功能](#核心功能)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [功能模块详解](#功能模块详解)
- [配置说明](#配置说明)
- [开发指南](#开发指南)
- [部署](#部署)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 🎯 项目简介

**BifrostHub** 是一个专为区块链用户打造的流动性质押（Liquid Staking）管理平台。它整合了多链资产管理、自动化收益优化、Gas 费用优化和智能风险管理等功能，为用户提供一站式的 DeFi 资产管理解决方案。

### ✨ 亮点特性

- 🔗 **多链支持** - 支持 Ethereum (Sepolia 测试网) 和 Polkadot (Westend 测试网)
- 💰 **流动性质押** - 通过 Bifrost 协议铸造和赎回 vToken (vDOT, vKSM, vGLMR, vASTR, vFIL)
- 🤖 **智能路由** - 自动匹配最优收益策略
- ⛽ **Gas 优化** - 实时监控并优化交易 Gas 费用
- 🛡️ **风险管理** - 实时监控资产风险并提供告警
- 🌐 **国际化** - 支持中文和英文双语界面
- 🎨 **现代化 UI** - 基于 Tailwind CSS 和 Radix UI 的精美界面

---

## 🚀 核心功能

### 1. 资产仪表板 (Asset Dashboard)

- 📊 多链资产实时查看和管理
- 📈 资产分布可视化（饼图）
- 💹 收益趋势分析（折线图）
- 🔄 自动刷新资产数据
- 📊 实时 APY 和收益计算

### 2. Bifrost vToken 铸造 (Mint Interface)

- ✅ 支持多种 vToken 铸造（vDOT, vKSM, vGLMR, vASTR, vFIL）
- 🔗 实时连接 Bifrost Polkadot 网络
- 💱 1:1 铸造比率估算
- 📡 网络状态实时监控
- ⚡ 快速交易确认

### 3. Bifrost vToken 赎回 (Redeem Interface)

- 🔄 标准赎回和快速赎回两种模式
- ⏱️ 赎回时间预估
- 💸 手续费透明显示
- 🔔 交易状态通知

### 4. 收益路由器 (Yield Router)

- 🎯 智能匹配最优收益策略
- 🔍 多协议收益对比
- 📊 风险评分和 TVL 展示
- 🚀 一键切换策略

### 5. Gas 优化器 (Gas Optimizer)

- ⛽ 实时 Gas 价格监控
- 📉 历史 Gas 趋势分析
- 💡 最佳交易时机建议
- 🔔 Gas 价格告警

### 6. 风险管理器 (Risk Manager)

- 🛡️ 实时风险评估
- 🚨 多级别风险告警
- 📊 资产风险可视化
- 🔐 智能合约安全监控

### 7. AI 智能质押助手 (Intelligent Staking Assistant)

- 🤖 AI 驱动的质押建议
- 💬 自然语言交互
- 📈 个性化策略推荐
- 🎓 质押知识库

---

## 🛠️ 技术栈

### 前端框架
- **React 18.3.1** - 用户界面库
- **TypeScript 5.6.2** - 类型安全的 JavaScript
- **Vite 6.0.1** - 快速的前端构建工具

### 区块链集成
- **Polkadot API (@polkadot/api)** - Polkadot 生态系统交互
- **Polkadot Extension Dapp** - 钱包扩展集成
- **Ethers.js 6.15.0** - Ethereum 区块链交互

### UI 组件库
- **Radix UI** - 无障碍、可定制的 UI 组件
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 现代化图标库
- **Recharts** - 数据可视化图表库

### 状态管理与工具
- **React Hook Form** - 表单管理
- **Zod** - 数据验证
- **i18next** - 国际化方案
- **Sonner** - Toast 通知组件

### 数据存储
- **Supabase** - 后端即服务 (BaaS)

---

## 📁 项目结构

```
bifrosthub/
├── public/                     # 静态资源
│   └── use.txt
├── src/
│   ├── components/            # React 组件
│   │   ├── AssetDashboard.tsx           # 资产仪表板
│   │   ├── BifrostMintInterface.tsx     # Bifrost 铸造界面
│   │   ├── BifrostRedeemInterface.tsx   # Bifrost 赎回界面
│   │   ├── ErrorBoundary.tsx            # 错误边界
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
│   │   └── index.ts
│   ├── App.css               # 应用样式
│   ├── App.tsx               # 应用主组件
│   ├── index.css             # 全局样式
│   ├── main.tsx              # 应用入口
│   └── vite-env.d.ts         # Vite 环境类型
├── components.json           # shadcn/ui 配置
├── deployment-trigger.txt    # 部署触发器
├── eslint.config.js          # ESLint 配置
├── index.html                # HTML 入口
├── package.json              # 项目依赖
├── postcss.config.js         # PostCSS 配置
├── tailwind.config.js        # Tailwind CSS 配置
├── tsconfig.json             # TypeScript 配置
└── vite.config.ts            # Vite 配置
```

---

## 🏁 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (推荐使用 pnpm)
- **Git**

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/yourusername/bifrosthub.git
cd bifrosthub
```

2. **安装依赖**

```bash
pnpm install
```

3. **启动开发服务器**

```bash
pnpm dev
```

应用将在 `http://localhost:5173` 启动

4. **构建生产版本**

```bash
pnpm build
```

5. **预览生产版本**

```bash
pnpm preview
```

### 钱包配置

#### MetaMask (Ethereum)

1. 安装 [MetaMask](https://metamask.io/) 浏览器扩展
2. 配置 Sepolia 测试网
3. 获取测试 ETH：[Sepolia Faucet](https://sepoliafaucet.com/)

#### Polkadot.js (Polkadot)

1. 安装 [Polkadot.js Extension](https://polkadot.js.org/extension/)
2. 创建或导入账户
3. 连接到 Westend 测试网
4. 获取测试 WND：[Westend Faucet](https://faucet.polkadot.io/)

---

## 🔧 功能模块详解

### Web3 连接管理 (Web3Context)

提供统一的 Web3 连接管理，支持：
- MetaMask (Ethereum) 自动连接和断开
- Polkadot.js Extension 集成
- 多端点自动重试机制
- 网络状态监控
- 本地存储连接状态

```typescript
import { useWeb3 } from '@/contexts/Web3Context'

const { 
  ethAddress,         // Ethereum 地址
  polkadotAddress,    // Polkadot 地址
  connectEth,         // 连接 MetaMask
  connectPolkadot,    // 连接 Polkadot
  ethConnected,       // Ethereum 连接状态
  polkadotConnected   // Polkadot 连接状态
} = useWeb3()
```

### Bifrost vToken 管理 (useBifrostVTokens)

提供完整的 vToken 操作功能：

```typescript
import { useBifrostVTokens } from '@/hooks/useBifrostVTokens'

const {
  api,                    // Polkadot API 实例
  balances,              // vToken 余额列表
  networkStatus,         // 网络状态
  fetchVTokenBalances,   // 获取余额
  mintVToken,           // 铸造 vToken
  redeemVToken          // 赎回 vToken
} = useBifrostVTokens()
```

### 支持的 vToken

| Token | 底层资产 | 链 | APY (估算) |
|-------|---------|-----|-----------|
| vDOT  | DOT     | Polkadot | 15-20% |
| vKSM  | KSM     | Kusama   | 18-25% |
| vGLMR | GLMR    | Moonbeam | 12-18% |
| vASTR | ASTR    | Astar    | 10-15% |
| vFIL  | FIL     | Filecoin | 8-12%  |

---

## ⚙️ 配置说明

### 网络配置

#### Bifrost 配置 (`src/config/bifrost.ts`)

```typescript
export const BIFROST_CONFIG = {
  mainnet: {
    polkadot: {
      rpcUrl: 'wss://api-bifrost-polkadot.n.dwellir.com',
      parachainId: '2030',
      // ... 其他配置
    }
  }
}
```

#### 测试网配置 (`src/config/testnet.ts`)

```typescript
export const TESTNET_CONFIG = {
  ethereum: {
    chainId: '0xaa36a7',    // Sepolia
    chainName: 'Sepolia',
    rpcUrls: ['https://sepolia.infura.io/v3/...']
  },
  polkadot: {
    networkName: 'Westend',
    endpoints: ['wss://westend-rpc.polkadot.io']
  }
}
```

### 环境变量

创建 `.env` 文件：

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Infura (可选)
VITE_INFURA_PROJECT_ID=your_infura_project_id

# 构建模式
BUILD_MODE=dev
```

---

## 🔨 开发指南

### 代码规范

项目使用 ESLint 和 TypeScript 进行代码质量控制：

```bash
# 运行代码检查
pnpm lint
```

### 组件开发

使用 shadcn/ui 组件系统：

```bash
# 添加新组件
npx shadcn-ui@latest add [component-name]
```

### 样式开发

使用 Tailwind CSS 的实用类：

```tsx
<div className="gradient-border p-6">
  <h3 className="text-lg font-semibold text-white">标题</h3>
</div>
```

自定义渐变样式在 `App.css` 中定义。

### 国际化

添加新的翻译键：

```typescript
// src/i18n/locales/zh-CN.json
{
  "nav": {
    "dashboard": "资产仪表板",
    "yieldRouter": "收益路由"
  }
}

// 使用
const { t } = useTranslation()
<button>{t('nav.dashboard')}</button>
```

### 类型定义

在 `src/types/index.ts` 中定义类型：

```typescript
export interface Asset {
  id: string
  chain: string
  asset_symbol: string
  balance: number
  apy: number
}
```

---

## 🚀 部署

### 构建优化

```bash
# 开发构建
pnpm build

# 生产构建（启用优化）
pnpm build:prod
```

### 部署到 Vercel

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 部署：
```bash
vercel
```

### 部署到 Netlify

1. 构建设置：
   - Build command: `pnpm build`
   - Publish directory: `dist`

2. 环境变量：在 Netlify 后台添加所需的环境变量

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 5173
CMD ["pnpm", "preview"]
```

---

## ❓ 常见问题

### 1. MetaMask 连接失败

**问题**：点击连接后没有弹出 MetaMask

**解决方案**：
- 确保已安装 MetaMask 扩展
- 检查 MetaMask 是否已解锁
- 刷新页面重试

### 2. Polkadot 网络连接超时

**问题**：连接 Polkadot 时提示网络超时

**解决方案**：
- 检查网络连接
- 切换到其他 RPC 端点
- 等待网络恢复后重试

### 3. vToken 铸造失败

**问题**：铸造 vToken 时交易失败

**解决方案**：
- 确保账户有足够的 DOT/KSM 余额
- 检查 Gas 费用设置
- 确认 Bifrost 网络连接正常

### 4. 数据不刷新

**问题**：资产数据没有自动更新

**解决方案**：
- 点击刷新按钮手动刷新
- 检查钱包连接状态
- 清除浏览器缓存

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码风格

- 遵循 ESLint 规则
- 使用 TypeScript 类型注解
- 保持组件单一职责
- 编写清晰的注释

### 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建/工具链更新
```

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🔗 相关链接

- **Bifrost 官网**: https://bifrost.finance
- **Polkadot 官网**: https://polkadot.network
- **文档**: [查看文档](#)
- **Discord 社区**: [加入社区](#)
- **Twitter**: [@BifrostHub](#)

---

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 📧 Email: support@bifrosthub.io
- 💬 Discord: [BifrostHub Community](#)
- 🐦 Twitter: [@BifrostHub](#)
- 📝 Issues: [GitHub Issues](https://github.com/yourusername/bifrosthub/issues)

---

## 🙏 致谢

感谢以下开源项目：

- [Bifrost Finance](https://bifrost.finance) - 流动性质押协议
- [Polkadot](https://polkadot.network) - 跨链生态系统
- [React](https://reactjs.org) - UI 框架
- [Vite](https://vitejs.dev) - 构建工具
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架
- [Radix UI](https://www.radix-ui.com) - 组件库

---

<div align="center">
  <p>用 ❤️ 打造</p>
  <p>© 2024 BifrostHub. All rights reserved.</p>
</div>
