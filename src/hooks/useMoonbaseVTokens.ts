import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { MOONBASE_CONFIG, MOONBASE_NETWORK } from '../config/moonbase';
import { toast } from 'sonner';

// ERC-20 ABI
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount) returns (bool)',
  'function redeem(uint256 amount) returns (bool)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function decimals() view returns (uint8)'
];

export interface MoonbaseVTokenBalance {
  symbol: string;
  address: string;
  balance: string;
  decimals: number;
  name: string;
  value: string;
  price: number;
}

export interface MoonbaseNetworkInfo {
  isConnected: boolean;
  chainId: number;
  networkName: string;
  balance: string;
  blockNumber: number;
}

export const useMoonbaseVTokens = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [networkInfo, setNetworkInfo] = useState<MoonbaseNetworkInfo>({
    isConnected: false,
    chainId: 0,
    networkName: '',
    balance: '0',
    blockNumber: 0
  });
  const [balances, setBalances] = useState<MoonbaseVTokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  // 初始化 provider
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      
      // 监听网络变化
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // 处理网络变化
  const handleChainChanged = useCallback((chainId: string) => {
    console.log('🔄 Network changed to:', chainId);
    window.location.reload();
  }, []);

  // 处理账户变化
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    console.log('🔄 Accounts changed:', accounts);
    if (accounts.length > 0) {
      fetchBalances();
    }
  }, []);

  // 切换到 Moonbase Alpha
  const switchToMoonbase = useCallback(async (): Promise<boolean> => {
    if (!window.ethereum) {
      toast.error('请安装 MetaMask');
      return false;
    }

    try {
      setLoading(true);
      
      // 检查是否已经连接到 Moonbase
      const currentChainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      if (currentChainId === MOONBASE_CONFIG.chainId) {
        console.log('✅ Already connected to Moonbase');
        await initializeProvider();
        return true;
      }

      // 尝试切换网络
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MOONBASE_CONFIG.chainId }]
      });

      console.log('✅ Switched to Moonbase Alpha');
      await initializeProvider();
      return true;
      
    } catch (error: any) {
      console.error('❌ Failed to switch to Moonbase:', error);
      
      // 如果网络不存在，尝试添加
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MOONBASE_NETWORK]
          });
          
          console.log('✅ Added Moonbase Alpha network');
          await initializeProvider();
          return true;
        } catch (addError) {
          console.error('❌ Failed to add Moonbase:', addError);
          toast.error('添加 Moonbase 网络失败');
          return false;
        }
      }
      
      toast.error('切换到 Moonbase 失败');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化 provider 和 signer
  const initializeProvider = useCallback(async () => {
    if (!provider) return;
    
    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);
      
      setSigner(signer);
      setNetworkInfo({
        isConnected: true,
        chainId: Number(network.chainId),
        networkName: network.name,
        balance: ethers.formatEther(balance),
        blockNumber: await provider.getBlockNumber()
      });
      
      console.log('✅ Initialized Moonbase provider:', {
        address,
        network: network.name,
        balance: ethers.formatEther(balance)
      });
      
    } catch (error) {
      console.error('❌ Failed to initialize provider:', error);
      toast.error('初始化 Moonbase 连接失败');
    }
  }, [provider]);

  // 获取 vToken 余额
  const fetchBalances = useCallback(async () => {
    if (!signer || !networkInfo.isConnected) return;
    
    setLoading(true);
    try {
      const address = await signer.getAddress();
      const balancePromises = Object.entries(MOONBASE_CONFIG.bifrostContracts).map(
        async ([symbol, config]) => {
          try {
            const contract = new ethers.Contract(config.address, ERC20_ABI, signer);
            
            const [balance, decimals, name] = await Promise.all([
              contract.balanceOf(address),
              contract.decimals(),
              contract.name()
            ]);
            
            const balanceFormatted = ethers.formatUnits(balance, decimals);
            const price = await getTokenPrice(symbol);
            const value = (parseFloat(balanceFormatted) * price).toFixed(2);
            
            return {
              symbol,
              address: config.address,
              balance: balanceFormatted,
              decimals,
              name,
              value,
              price
            };
            
          } catch (error) {
            console.warn(`Failed to fetch ${symbol} balance:`, error);
            return {
              symbol,
              address: config.address,
              balance: '0',
              decimals: 18,
              name: config.name,
              value: '0',
              price: 0
            };
          }
        }
      );
      
      const results = await Promise.all(balancePromises);
      setBalances(results);
      
      console.log('✅ Moonbase vToken balances updated:', results.length);
      
    } catch (error) {
      console.error('❌ Failed to fetch Moonbase balances:', error);
      toast.error('获取 Moonbase 余额失败');
    } finally {
      setLoading(false);
    }
  }, [signer, networkInfo.isConnected]);

  // 铸造 vToken
  const mintVToken = async (tokenSymbol: string, amount: string): Promise<boolean> => {
    if (!signer) {
      toast.error('请先连接钱包');
      return false;
    }

    try {
      setLoading(true);
      const contractAddress = MOONBASE_CONFIG.bifrostContracts[tokenSymbol as keyof typeof MOONBASE_CONFIG.bifrostContracts]?.address;
      
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        toast.error(`${tokenSymbol} 合约地址未配置`);
        return false;
      }
      
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer);
      const amountWei = ethers.parseUnits(amount, 18);
      
      console.log('🔄 Minting vToken:', { tokenSymbol, amount, amountWei: amountWei.toString() });
      
      const tx = await contract.mint(await signer.getAddress(), amountWei);
      const receipt = await tx.wait();
      
      console.log('✅ vToken minted:', receipt.hash);
      toast.success(`成功铸造 ${amount} ${tokenSymbol}`);
      
      // 刷新余额
      await fetchBalances();
      return true;
      
    } catch (error: any) {
      console.error('❌ Mint failed:', error);
      toast.error(`铸造失败: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 赎回 vToken
  const redeemVToken = async (tokenSymbol: string, amount: string): Promise<boolean> => {
    if (!signer) {
      toast.error('请先连接钱包');
      return false;
    }

    try {
      setLoading(true);
      const contractAddress = MOONBASE_CONFIG.bifrostContracts[tokenSymbol as keyof typeof MOONBASE_CONFIG.bifrostContracts]?.address;
      
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        toast.error(`${tokenSymbol} 合约地址未配置`);
        return false;
      }
      
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer);
      const amountWei = ethers.parseUnits(amount, 18);
      
      console.log('🔄 Redeeming vToken:', { tokenSymbol, amount, amountWei: amountWei.toString() });
      
      const tx = await contract.redeem(amountWei);
      const receipt = await tx.wait();
      
      console.log('✅ vToken redeemed:', receipt.hash);
      toast.success(`成功赎回 ${amount} ${tokenSymbol}`);
      
      // 刷新余额
      await fetchBalances();
      return true;
      
    } catch (error: any) {
      console.error('❌ Redeem failed:', error);
      toast.error(`赎回失败: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 获取代币价格
  const getTokenPrice = useCallback(async (symbol: string): Promise<number> => {
    try {
      // 这里应该调用真实的价格 API
      // 暂时返回模拟价格
      const mockPrices: { [key: string]: number } = {
        'xcvASTR': 0.12,
        'xcvKSM': 45.80,
        'xcvDOT': 15.25
      };
      
      return mockPrices[symbol] || 0;
    } catch (error) {
      console.warn('Failed to fetch price for:', symbol);
      return 0;
    }
  }, []);

  // 获取网络统计
  const getNetworkStats = useCallback(async () => {
    if (!provider || !networkInfo.isConnected) return null;
    
    try {
      const blockNumber = await provider.getBlockNumber();
      const gasPrice = await provider.getFeeData();
      
      return {
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString() || '0',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to fetch network stats:', error);
      return null;
    }
  }, [provider, networkInfo.isConnected]);

  return {
    provider,
    signer,
    networkInfo,
    balances,
    loading,
    switchToMoonbase,
    fetchBalances,
    mintVToken,
    redeemVToken,
    getNetworkStats
  };
};