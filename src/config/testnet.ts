// 测试网配置文件
export const TESTNET_CONFIG = {
  ethereum: {
    chainId: '0xaa36a7', // Sepolia testnet
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [
      'https://sepolia.drpc.org',
      'https://rpc.sepolia.org',
      'https://sepolia.gateway.tenderly.co',
    ],
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    iconUrls: ['https://cryptologos.cc/logos/ethereum-eth-logo.png'],
  },
  polkadot: {
    // Westend测试网配置
    endpoints: [
      'wss://westend-rpc.polkadot.io',
      'wss://westend.api.onfinality.io/public-ws',
      'wss://westend.dwellir.com',
    ],
    networkName: 'Westend Test Network',
    symbol: 'WND',
    decimals: 12,
  },
  bifrost: {
    // 如果有Bifrost测试网的话，这里配置
    endpoints: [
      'wss://bifrost-rpc.testnet.liebi.com/ws',
      'wss://bifrost-testnet-rpc.dwellir.com',
    ],
    networkName: 'Bifrost Test Network',
    symbol: 'BNC',
    decimals: 12,
  }
}

// 测试网代币配置
export const TESTNET_TOKENS = {
  ethereum: {
    ETH: {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Sepolia Ether',
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    },
    USDC: {
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      symbol: 'USDC',
      name: 'USD Coin (Sepolia)',
      decimals: 6,
      logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    },
    USDT: {
      address: '0x...', // Sepolia上的USDT合约地址
      symbol: 'USDT',
      name: 'Tether USD (Sepolia)',
      decimals: 6,
      logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    },
  },
  polkadot: {
    WND: {
      address: '',
      symbol: 'WND',
      name: 'Westend',
      decimals: 12,
      logoURI: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
    },
  }
}

// API端点配置（用于获取真实数据）
export const API_ENDPOINTS = {
  ethereum: {
    // 使用公共API获取真实数据
    gasPrices: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=',
    tokenBalances: 'https://api-sepolia.etherscan.io/api', // 需要API key
    tokenPrices: 'https://api.coingecko.com/api/v3/simple/price',
  },
  polkadot: {
    // 使用Subscan API获取真实数据
    accountInfo: 'https://westend.subscan.io/api/scan/account',
    tokenPrices: 'https://api.coingecko.com/api/v3/simple/price',
  }
}

// 网络切换函数
export const switchToTestnet = async (ethereum: any) => {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: TESTNET_CONFIG.ethereum.chainId }],
    })
  } catch (switchError: any) {
    // 如果网络不存在，尝试添加
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [TESTNET_CONFIG.ethereum],
        })
      } catch (addError) {
        console.error('添加测试网失败:', addError)
        throw addError
      }
    } else {
      console.error('切换到测试网失败:', switchError)
      throw switchError
    }
  }
}