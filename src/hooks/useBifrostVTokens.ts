import { useState, useEffect, useCallback } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BIFROST_CONFIG, VTOKENS } from '../config/bifrost';
import { toast } from 'sonner';

export interface VTokenBalance {
  symbol: string;
  underlying: string;
  chain: string;
  balance: string;
  availableBalance: string;
  stakingRewards: string;
  apy: number;
  price: number;
  value: string;
  color: string;
}

export interface VTokenMintParams {
  amount: string;
  tokenSymbol: string;
  account: string;
  recipient?: string;
}

export interface VTokenRedeemParams {
  amount: string;
  tokenSymbol: string;
  account: string;
  quickRedeem?: boolean;
}

export interface BifrostNetworkStatus {
  isConnected: boolean;
  blockNumber: number;
  lastUpdate: number;
  health: 'healthy' | 'warning' | 'error';
}

export const useBifrostVTokens = () => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [balances, setBalances] = useState<VTokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<BifrostNetworkStatus>({
    isConnected: false,
    blockNumber: 0,
    lastUpdate: 0,
    health: 'error'
  });

  // 初始化 Bifrost API 连接
  useEffect(() => {
    const initApi = async () => {
      try {
        console.log('🔗 Connecting to Bifrost Polkadot...');
        const provider = new WsProvider(BIFROST_CONFIG.mainnet.polkadot.rpcUrl);
        const api = await ApiPromise.create({ 
          provider,
          types: {
            // Bifrost 特定类型
            VTokenBalance: {
              free: 'u128',
              reserved: 'u128',
              frozen: 'u128'
            },
            StakingRewards: {
              total_rewards: 'u128',
              claimed_rewards: 'u128'
            }
          }
        });
        
        // 等待连接就绪
        await api.isReady;
        setApi(api);
        
        // 设置网络状态
        setNetworkStatus(prev => ({
          ...prev,
          isConnected: true,
          health: 'healthy'
        }));
        
        console.log('✅ Connected to Bifrost Polkadot');
        
        // 订阅新区块
        api.rpc.chain.subscribeNewHeads((header) => {
          setNetworkStatus(prev => ({
            ...prev,
            blockNumber: header.number.toNumber(),
            lastUpdate: Date.now()
          }));
        });
        
      } catch (error) {
        console.error('❌ Failed to connect to Bifrost:', error);
        setNetworkStatus(prev => ({
          ...prev,
          isConnected: false,
          health: 'error'
        }));
        toast.error('Bifrost 网络连接失败');
      }
    };

    initApi();

    // 清理函数
    return () => {
      if (api) {
        api.disconnect();
      }
    };
  }, []);

  // 获取 vToken 余额和收益数据
  const fetchVTokenBalances = useCallback(async (address: string) => {
    if (!api || !address) return;

    setLoading(true);
    try {
      console.log('📊 Fetching vToken balances for:', address);
      
      const balancePromises = Object.entries(VTOKENS).map(async ([symbol, config]) => {
        try {
          // 获取余额
          const balanceResult = await api.query.tokens.accounts(address, symbol);
          const balanceData = balanceResult.toJSON() as any;
          
          // 获取可用余额
          const availableBalance = balanceData?.free || '0';
          
          // 获取质押奖励
          const rewardsResult = await api.query.stakingRewards.rewards(address, symbol);
          const rewardsData = rewardsResult.toJSON() as any;
          const stakingRewards = rewardsData?.total_rewards || '0';
          
          // 获取 APY
          const apyResult = await api.query.vtokenApy.apy(symbol);
          const apy = apyResult.toHuman() as string;
          const apyNumber = parseFloat(apy.replace('%', ''));
          
          // 获取价格 (从外部价格源)
          const price = await getTokenPrice(symbol);
          
          // 计算总价值
          const totalBalance = (BigInt(availableBalance) + BigInt(stakingRewards)).toString();
          const value = calculateValue(totalBalance, price, config.underlying);
          
          return {
            symbol,
            underlying: config.underlying,
            chain: config.chain,
            balance: availableBalance,
            availableBalance,
            stakingRewards,
            apy: apyNumber,
            price,
            value,
            color: config.color
          };
          
        } catch (error) {
          console.warn(`Failed to fetch ${symbol} balance:`, error);
          return {
            symbol,
            underlying: config.underlying,
            chain: config.chain,
            balance: '0',
            availableBalance: '0',
            stakingRewards: '0',
            apy: 0,
            price: 0,
            value: '0',
            color: config.color
          };
        }
      });

      const results = await Promise.all(balancePromises);
      setBalances(results);
      
      console.log('✅ vToken balances updated:', results.length);
      
    } catch (error) {
      console.error('❌ Failed to fetch vToken balances:', error);
      toast.error('获取余额失败');
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 铸造 vToken
  const mintVToken = async (params: VTokenMintParams) => {
    if (!api) throw new Error('API not initialized');
    
    try {
      setLoading(true);
      console.log('🔄 Minting vToken:', params);
      
      // 构建铸造交易
      const extrinsic = api.tx.slp.mint(params.tokenSymbol, params.amount);
      
      // 估算费用
      const paymentInfo = await extrinsic.paymentInfo('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
      console.log('💰 Estimated fee:', paymentInfo.partialFee.toString());
      
      // 发送交易
      const result = await extrinsic.signAndSend(params.account);
      
      console.log('✅ vToken minted successfully:', result.toHex());
      toast.success(`成功铸造 ${params.amount} ${params.tokenSymbol}`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Mint failed:', error);
      toast.error(`铸造失败: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 赎回 vToken
  const redeemVToken = async (params: VTokenRedeemParams) => {
    if (!api) throw new Error('API not initialized');
    
    try {
      setLoading(true);
      console.log('🔄 Redeeming vToken:', params);
      
      // 构建赎回交易
      const extrinsic = params.quickRedeem 
        ? api.tx.slp.quickRedeem(params.tokenSymbol, params.amount)
        : api.tx.slp.redeem(params.tokenSymbol, params.amount);
        
      // 估算费用
      const paymentInfo = await extrinsic.paymentInfo('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
      console.log('💰 Estimated fee:', paymentInfo.partialFee.toString());
      
      // 发送交易
      const result = await extrinsic.signAndSend(params.account);
      
      console.log('✅ vToken redemption initiated:', result.toHex());
      toast.success(`成功发起赎回 ${params.amount} ${params.tokenSymbol}`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Redeem failed:', error);
      toast.error(`赎回失败: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 获取网络统计信息
  const getNetworkStats = useCallback(async () => {
    if (!api) return null;
    
    try {
      const [blockNumber, totalIssuance, activeStaking] = await Promise.all([
        api.rpc.chain.getHeader().then(header => header.number.toNumber()),
        api.query.tokens.totalIssuance(),
        api.query.stakingRewards.totalStaked()
      ]);
      
      return {
        blockNumber,
        totalIssuance: totalIssuance.toString(),
        activeStaking: activeStaking.toString(),
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error('Failed to fetch network stats:', error);
      return null;
    }
  }, [api]);

  return {
    api,
    balances,
    loading,
    networkStatus,
    fetchVTokenBalances,
    mintVToken,
    redeemVToken,
    getNetworkStats
  };
};

// 辅助函数：获取代币价格
async function getTokenPrice(symbol: string): Promise<number> {
  try {
    // 这里应该调用真实的价格 API
    // 暂时返回模拟价格
    const mockPrices: { [key: string]: number } = {
      'vDOT': 15.25,
      'vKSM': 45.80,
      'vGLMR': 0.85,
      'vASTR': 0.12,
      'vFIL': 8.45
    };
    
    return mockPrices[symbol] || 0;
  } catch (error) {
    console.warn('Failed to fetch price for:', symbol);
    return 0;
  }
}

// 辅助函数：计算价值
function calculateValue(balance: string, price: number, underlying: string): string {
  try {
    const balanceNum = parseFloat(balance) / Math.pow(10, 12); // 假设 12 位小数
    const value = balanceNum * price;
    return value.toFixed(2);
  } catch (error) {
    console.warn('Failed to calculate value:', error);
    return '0';
  }
}