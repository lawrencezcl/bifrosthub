# BifrostHub 🌉

> **One-Stop Liquid Staking Management Platform** - Comprehensive solution for cross-chain asset management, intelligent yield routing, Gas optimization, and risk management

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[中文版](./README.md) | **English**

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Core Features](#-core-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Module Details](#-module-details)
- [Configuration](#%EF%B8%8F-configuration)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Introduction

**BifrostHub** is a liquid staking management platform designed for blockchain users. It integrates multi-chain asset management, automated yield optimization, Gas fee optimization, and intelligent risk management, providing a one-stop DeFi asset management solution.

### ✨ Highlights

- 🔗 **Multi-Chain Support** - Supports Ethereum (Sepolia Testnet) and Polkadot (Westend Testnet)
- 💰 **Liquid Staking** - Mint and redeem vTokens (vDOT, vKSM, vGLMR, vASTR, vFIL) via Bifrost protocol
- 🤖 **Smart Routing** - Automatically matches optimal yield strategies
- ⛽ **Gas Optimization** - Real-time monitoring and optimization of transaction Gas fees
- 🛡️ **Risk Management** - Real-time asset risk monitoring and alerts
- 🌐 **Internationalization** - Supports Chinese and English bilingual interface
- 🎨 **Modern UI** - Beautiful interface based on Tailwind CSS and Radix UI

---

## 🚀 Core Features

### 1. Asset Dashboard

- 📊 Real-time multi-chain asset viewing and management
- 📈 Asset distribution visualization (pie chart)
- 💹 Yield trend analysis (line chart)
- 🔄 Automatic asset data refresh
- 📊 Real-time APY and yield calculation

### 2. Bifrost vToken Minting

- ✅ Supports multiple vToken minting (vDOT, vKSM, vGLMR, vASTR, vFIL)
- 🔗 Real-time connection to Bifrost Polkadot network
- 💱 1:1 minting ratio estimation
- 📡 Real-time network status monitoring
- ⚡ Fast transaction confirmation

### 3. Bifrost vToken Redemption

- 🔄 Two modes: standard redemption and quick redemption
- ⏱️ Redemption time estimation
- 💸 Transparent fee display
- 🔔 Transaction status notifications

### 4. Yield Router

- 🎯 Intelligently matches optimal yield strategies
- 🔍 Multi-protocol yield comparison
- 📊 Risk scoring and TVL display
- 🚀 One-click strategy switching

### 5. Gas Optimizer

- ⛽ Real-time Gas price monitoring
- 📉 Historical Gas trend analysis
- 💡 Best transaction timing suggestions
- 🔔 Gas price alerts

### 6. Risk Manager

- 🛡️ Real-time risk assessment
- 🚨 Multi-level risk alerts
- 📊 Asset risk visualization
- 🔐 Smart contract security monitoring

### 7. AI Intelligent Staking Assistant

- 🤖 AI-driven staking recommendations
- 💬 Natural language interaction
- 📈 Personalized strategy recommendations
- 🎓 Staking knowledge base

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1** - User interface library
- **TypeScript 5.6.2** - Type-safe JavaScript
- **Vite 6.0.1** - Fast frontend build tool

### Blockchain Integration
- **Polkadot API (@polkadot/api)** - Polkadot ecosystem interaction
- **Polkadot Extension Dapp** - Wallet extension integration
- **Ethers.js 6.15.0** - Ethereum blockchain interaction

### UI Component Library
- **Radix UI** - Accessible, customizable UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Recharts** - Data visualization chart library

### State Management & Tools
- **React Hook Form** - Form management
- **Zod** - Data validation
- **i18next** - Internationalization solution
- **Sonner** - Toast notification component

### Data Storage
- **Supabase** - Backend as a Service (BaaS)

---

## 📁 Project Structure

```
bifrosthub/
├── public/                     # Static assets
│   └── use.txt
├── src/
│   ├── components/            # React components
│   │   ├── AssetDashboard.tsx           # Asset dashboard
│   │   ├── BifrostMintInterface.tsx     # Bifrost mint interface
│   │   ├── BifrostRedeemInterface.tsx   # Bifrost redeem interface
│   │   ├── ErrorBoundary.tsx            # Error boundary
│   │   ├── GasOptimizer.tsx             # Gas optimizer
│   │   ├── Header.tsx                   # Header component
│   │   ├── IntelligentStakingAssistant.tsx  # AI assistant
│   │   ├── RiskManager.tsx              # Risk manager
│   │   └── YieldRouter.tsx              # Yield router
│   ├── config/               # Configuration files
│   │   ├── bifrost.ts                   # Bifrost network config
│   │   ├── moonbase.ts                  # Moonbase config
│   │   └── testnet.ts                   # Testnet config
│   ├── contexts/             # React Context
│   │   └── Web3Context.tsx              # Web3 connection context
│   ├── hooks/                # Custom Hooks
│   │   ├── useBifrostVTokens.ts         # Bifrost vToken Hook
│   │   ├── useMoonbaseVTokens.ts        # Moonbase vToken Hook
│   │   └── useRealData.ts               # Real data Hook
│   ├── i18n/                 # Internationalization
│   │   └── index.ts                     # i18n config
│   ├── lib/                  # Utility libraries
│   │   ├── supabase.ts                  # Supabase client
│   │   └── utils.ts                     # Utility functions
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── App.css               # App styles
│   ├── App.tsx               # Main app component
│   ├── index.css             # Global styles
│   ├── main.tsx              # App entry point
│   └── vite-env.d.ts         # Vite environment types
├── components.json           # shadcn/ui config
├── deployment-trigger.txt    # Deployment trigger
├── eslint.config.js          # ESLint config
├── index.html                # HTML entry
├── package.json              # Project dependencies
├── postcss.config.js         # PostCSS config
├── tailwind.config.js        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
└── vite.config.ts            # Vite config
```

---

## 🏁 Quick Start

### Requirements

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/bifrosthub.git
cd bifrosthub
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start development server**

```bash
pnpm dev
```

The app will start at `http://localhost:5173`

4. **Build for production**

```bash
pnpm build
```

5. **Preview production build**

```bash
pnpm preview
```

### Wallet Configuration

#### MetaMask (Ethereum)

1. Install [MetaMask](https://metamask.io/) browser extension
2. Configure Sepolia testnet
3. Get test ETH: [Sepolia Faucet](https://sepoliafaucet.com/)

#### Polkadot.js (Polkadot)

1. Install [Polkadot.js Extension](https://polkadot.js.org/extension/)
2. Create or import account
3. Connect to Westend testnet
4. Get test WND: [Westend Faucet](https://faucet.polkadot.io/)

---

## 🔧 Module Details

### Web3 Connection Management (Web3Context)

Provides unified Web3 connection management with support for:
- MetaMask (Ethereum) auto-connect and disconnect
- Polkadot.js Extension integration
- Multi-endpoint auto-retry mechanism
- Network status monitoring
- Local storage connection state

```typescript
import { useWeb3 } from '@/contexts/Web3Context'

const { 
  ethAddress,         // Ethereum address
  polkadotAddress,    // Polkadot address
  connectEth,         // Connect MetaMask
  connectPolkadot,    // Connect Polkadot
  ethConnected,       // Ethereum connection status
  polkadotConnected   // Polkadot connection status
} = useWeb3()
```

### Bifrost vToken Management (useBifrostVTokens)

Provides complete vToken operation functionality:

```typescript
import { useBifrostVTokens } from '@/hooks/useBifrostVTokens'

const {
  api,                    // Polkadot API instance
  balances,              // vToken balance list
  networkStatus,         // Network status
  fetchVTokenBalances,   // Fetch balances
  mintVToken,           // Mint vToken
  redeemVToken          // Redeem vToken
} = useBifrostVTokens()
```

### Supported vTokens

| Token | Underlying | Chain | APY (Est.) |
|-------|-----------|-------|-----------|
| vDOT  | DOT       | Polkadot | 15-20% |
| vKSM  | KSM       | Kusama   | 18-25% |
| vGLMR | GLMR      | Moonbeam | 12-18% |
| vASTR | ASTR      | Astar    | 10-15% |
| vFIL  | FIL       | Filecoin | 8-12%  |

---

## ⚙️ Configuration

### Network Configuration

#### Bifrost Config (`src/config/bifrost.ts`)

```typescript
export const BIFROST_CONFIG = {
  mainnet: {
    polkadot: {
      rpcUrl: 'wss://api-bifrost-polkadot.n.dwellir.com',
      parachainId: '2030',
      // ... other configs
    }
  }
}
```

#### Testnet Config (`src/config/testnet.ts`)

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

### Environment Variables

Create `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Infura (optional)
VITE_INFURA_PROJECT_ID=your_infura_project_id

# Build mode
BUILD_MODE=dev
```

---

## 🔨 Development Guide

### Code Standards

The project uses ESLint and TypeScript for code quality:

```bash
# Run linter
pnpm lint
```

### Component Development

Using shadcn/ui component system:

```bash
# Add new component
npx shadcn-ui@latest add [component-name]
```

### Style Development

Using Tailwind CSS utility classes:

```tsx
<div className="gradient-border p-6">
  <h3 className="text-lg font-semibold text-white">Title</h3>
</div>
```

Custom gradient styles are defined in `App.css`.

### Internationalization

Add new translation keys:

```typescript
// src/i18n/locales/en-US.json
{
  "nav": {
    "dashboard": "Asset Dashboard",
    "yieldRouter": "Yield Router"
  }
}

// Usage
const { t } = useTranslation()
<button>{t('nav.dashboard')}</button>
```

### Type Definitions

Define types in `src/types/index.ts`:

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

## 🚀 Deployment

### Build Optimization

```bash
# Development build
pnpm build

# Production build (with optimization)
pnpm build:prod
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`

2. Environment variables: Add required environment variables in Netlify dashboard

### Docker Deployment

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

## ❓ FAQ

### 1. MetaMask Connection Failed

**Issue**: MetaMask doesn't pop up when clicking connect

**Solution**:
- Ensure MetaMask extension is installed
- Check if MetaMask is unlocked
- Refresh the page and retry

### 2. Polkadot Network Timeout

**Issue**: Connection timeout when connecting to Polkadot

**Solution**:
- Check network connection
- Switch to another RPC endpoint
- Retry after network recovery

### 3. vToken Minting Failed

**Issue**: Transaction fails when minting vToken

**Solution**:
- Ensure account has sufficient DOT/KSM balance
- Check Gas fee settings
- Confirm Bifrost network connection is normal

### 4. Data Not Refreshing

**Issue**: Asset data doesn't update automatically

**Solution**:
- Click refresh button to manually refresh
- Check wallet connection status
- Clear browser cache

---

## 🤝 Contributing

We welcome all forms of contributions!

### Contribution Process

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style

- Follow ESLint rules
- Use TypeScript type annotations
- Keep components single responsibility
- Write clear comments

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: code formatting
refactor: refactor code
test: add tests
chore: build/toolchain updates
```

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details

---

## 🔗 Links

- **Bifrost Official**: https://bifrost.finance
- **Polkadot Official**: https://polkadot.network
- **Documentation**: [View Docs](#)
- **Discord Community**: [Join Community](#)
- **Twitter**: [@BifrostHub](#)

---

## 📞 Contact Us

For questions or suggestions, please contact us:

- 📧 Email: support@bifrosthub.io
- 💬 Discord: [BifrostHub Community](#)
- 🐦 Twitter: [@BifrostHub](#)
- 📝 Issues: [GitHub Issues](https://github.com/yourusername/bifrosthub/issues)

---

## 🙏 Acknowledgments

Thanks to the following open source projects:

- [Bifrost Finance](https://bifrost.finance) - Liquid staking protocol
- [Polkadot](https://polkadot.network) - Cross-chain ecosystem
- [React](https://reactjs.org) - UI framework
- [Vite](https://vitejs.dev) - Build tool
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Radix UI](https://www.radix-ui.com) - Component library

---

<div align="center">
  <p>Built with ❤️</p>
  <p>© 2024 BifrostHub. All rights reserved.</p>
</div>
