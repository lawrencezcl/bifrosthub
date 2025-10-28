// Bifrost 网络配置
export const BIFROST_CONFIG = {
  mainnet: {
    polkadot: {
      rpcUrl: 'wss://api-bifrost-polkadot.n.dwellir.com',
      httpUrl: 'https://api-bifrost-polkadot.n.dwellir.com',
      parachainId: '2030',
      ss58Prefix: 6,
      unitSymbol: 'BNC',
      decimals: 12,
      explorer: 'bifrost.subscan.io',
      averageBlockTime: 6000 // 6 seconds
    }
  },
  kusama: {
    polkadot: {
      rpcUrl: 'wss://api-bifrost-kusama.n.dwellir.com',
      httpUrl: 'https://api-bifrost-kusama.n.dwellir.com',
      parachainId: '2001',
      ss58Prefix: 6,
      unitSymbol: 'BNC',
      decimals: 12,
      explorer: 'bifrost-kusama.subscan.io',
      averageBlockTime: 6000 // 6 seconds
    }
  }
};

// 支持的 vToken 配置
export const VTOKENS = {
  vDOT: { 
    symbol: 'vDOT', 
    underlying: 'DOT', 
    chain: 'polkadot',
    description: 'DOT 流动性质押代币',
    color: '#E6007A'
  },
  vKSM: { 
    symbol: 'vKSM', 
    underlying: 'KSM', 
    chain: 'kusama',
    description: 'KSM 流动性质押代币',
    color: '#B32D9E'
  },
  vGLMR: { 
    symbol: 'vGLMR', 
    underlying: 'GLMR', 
    chain: 'polkadot',
    description: 'GLMR 流动性质押代币',
    color: '#53FFE9'
  },
  vASTR: { 
    symbol: 'vASTR', 
    underlying: 'ASTR', 
    chain: 'polkadot',
    description: 'ASTR 流动性质押代币',
    color: '#0C1446'
  },
  vFIL: { 
    symbol: 'vFIL', 
    underlying: 'FIL', 
    chain: 'polkadot',
    description: 'FIL 流动性质押代币',
    color: '#0090FF'
  }
};

// vToken 操作类型
export enum VTokenOperation {
  MINT = 'mint',
  REDEEM = 'redeem',
  QUICK_REDEEM = 'quickRedeem'
}

// Bifrost API 端点
export const BIFROST_ENDPOINTS = {
  // 实时数据 API
  api: 'https://api.bifrost.finance',
  
  // 统计数据 API
  stats: 'https://stats.bifrost.finance',
  
  // 跨链桥 API
  bridge: 'https://bridge.bifrost.finance',
  
  // 质押收益 API
  staking: 'https://staking.bifrost.finance'
};

// 网络健康检查
export const NETWORK_HEALTH = {
  bifrost: {
    name: 'Bifrost Polkadot',
    rpc: BIFROST_CONFIG.mainnet.polkadot.rpcUrl,
    status: 'active',
    lastBlock: null
  },
  kusama: {
    name: 'Bifrost Kusama', 
    rpc: BIFROST_CONFIG.kusama.polkadot.rpcUrl,
    status: 'active',
    lastBlock: null
  }
};