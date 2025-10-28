// Moonbase Alpha 测试网配置
export const MOONBASE_CONFIG = {
  network: 'moonbase-alpha',
  chainId: '0x507', // 1287 in hex
  chainIdDecimal: 1287,
  rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
  blockExplorer: 'https://moonbase.moonscan.io/',
  
  // Bifrost 跨链代币合约地址 (待确认)
  bifrostContracts: {
    xcvASTR: {
      address: '0x0000000000000000000000000000000000000000', // 待确认实际地址
      symbol: 'xcvASTR',
      name: 'Bifrost xcvASTR',
      decimals: 18,
      color: '#0C1446'
    },
    xcvKSM: {
      address: '0x0000000000000000000000000000000000000000', // 待确认实际地址
      symbol: 'xcvKSM',
      name: 'Bifrost xcvKSM', 
      decimals: 18,
      color: '#B32D9E'
    },
    xcvDOT: {
      address: '0x0000000000000000000000000000000000000000', // 待确认实际地址
      symbol: 'xcvDOT',
      name: 'Bifrost xcvDOT',
      decimals: 18,
      color: '#E6007A'
    }
  }
};

// Moonbase 网络配置 (用于 MetaMask)
export const MOONBASE_NETWORK = {
  chainId: '0x507', // 1287
  chainName: 'Moonbase Alpha',
  nativeCurrency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18
  },
  rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
  blockExplorerUrls: ['https://moonbase.moonscan.io/']
};

// Moonbase 测试网水龙头
export const MOONBASE_FAUCETS = {
  dev: {
    name: 'Moonbeam DEV Token Faucet',
    url: 'https://moonbeam.network/developers/moonbeam-testnet-faucet/',
    amount: '1 DEV',
    description: '获取 Moonbase Alpha 测试网的 DEV 代币'
  },
  astar: {
    name: 'Astar xcTOKEN Faucet',
    url: 'https://docs.astar.network/docs/build/environment/xc-token/moonbeam/',
    amount: '0.1 xcDOT',
    description: '获取跨链代币用于测试'
  }
};

// Moonbase 区块浏览器链接
export const MOONBASE_EXPLORERS = {
  moonscan: 'https://moonbase.moonscan.io/',
  blockscout: 'https://moonbase-blockscout.testnet.moonbeam.network/',
  polkadotJs: 'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer'
};

// Moonbase RPC 端点
export const MOONBASE_RPCS = [
  'https://rpc.api.moonbase.moonbeam.network',
  'https://moonbeam-alpha.publicnode.com',
  'https://moonbase.drpc.org'
];

// 跨链桥配置
export const CROSS_CHAIN_CONFIG = {
  moonbeam: {
    bridgeContract: '0x0000000000000000000000000000000000000000', // 待确认
    supportedTokens: ['xcvASTR', 'xcvKSM', 'xcvDOT'],
    estimatedTime: '10-30 minutes',
    fee: '0.01 DEV'
  }
};