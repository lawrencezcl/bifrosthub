import React, { useState, useEffect } from 'react';
import { useBifrostVTokens } from '../hooks/useBifrostVTokens';
import { VTOKENS } from '../config/bifrost';
import { toast } from 'sonner';
import { Loader2, ArrowUpDown, Info, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BifrostMintInterfaceProps {
  userAddress?: string;
  onSuccess?: () => void;
}

const BifrostMintInterface: React.FC<BifrostMintInterfaceProps> = ({
  userAddress,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [selectedToken, setSelectedToken] = useState('vDOT');
  const [amount, setAmount] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(false);
  
  const { 
    api, 
    networkStatus, 
    fetchVTokenBalances, 
    mintVToken 
  } = useBifrostVTokens();

  // 检查网络连接
  useEffect(() => {
    setNetworkConnected(networkStatus.isConnected);
  }, [networkStatus.isConnected]);

  // 计算预估输出
  useEffect(() => {
    if (amount && selectedToken) {
      // 1:1 铸造比率 (实际可能有所不同)
      setEstimatedOutput(amount);
    } else {
      setEstimatedOutput('');
    }
  }, [amount, selectedToken]);

  const handleMint = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(t('bifrostMint.enterAmount'));
      return;
    }

    if (!networkConnected) {
      toast.error(t('bifrostMint.connectNetwork'));
      return;
    }

    setLoading(true);
    try {
      const result = await mintVToken({
        amount,
        tokenSymbol: selectedToken,
        account: userAddress || '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      });
      
      if (result) {
        toast.success(t('bifrostMint.mintSuccessDesc', { amount, token: selectedToken }));
        setAmount('');
        setEstimatedOutput('');
        
        // 刷新余额
        if (userAddress) {
          fetchVTokenBalances(userAddress);
        }
        
        onSuccess?.();
      }
      
    } catch (error: any) {
      console.error('Mint error:', error);
      toast.error(t('bifrostMint.mintFailed') + `: ${error.message || t('bifrostMint.unknownError')}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxAmount = () => {
    // 这里应该获取用户的实际余额
    setAmount('100'); // 示例值
  };

  const selectedTokenConfig = VTOKENS[selectedToken as keyof typeof VTOKENS];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-blue-600" />
          {t('bifrostMint.mintVToken')}
        </h3>
        
        {/* 网络状态指示器 */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            networkConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600">
            {networkConnected ? t('bifrostMint.networkConnected') : t('bifrostMint.networkDisconnected')}
          </span>
        </div>
      </div>

      {/* 网络信息 */}
      {networkConnected && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">{t('bifrostMint.networkInfo')}</span>
          </div>
          <div className="text-sm text-blue-700">
            <p>{t('bifrostMint.blockHeight')}: {networkStatus.blockNumber.toLocaleString()}</p>
            <p>{t('bifrostMint.networkStatus')}: {networkStatus.health}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 选择代币 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('bifrostMint.selectMintToken')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(VTOKENS).map(([symbol, config]) => (
              <button
                key={symbol}
                onClick={() => setSelectedToken(symbol)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedToken === symbol
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: (config as any).color }}
                  />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{symbol}</div>
                    <div className="text-xs text-gray-500">{(config as any).description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 输入金额 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('bifrostMint.mintQuantity', { token: selectedTokenConfig.underlying })}
            </label>
            <button
              onClick={handleMaxAmount}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('bifrostMint.max')}
            </button>
          </div>
          
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('bifrostMint.inputTokenAmount', { token: selectedTokenConfig.underlying })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              {selectedTokenConfig.underlying}
            </div>
          </div>
        </div>

        {/* 预估输出 */}
        {estimatedOutput && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">{t('bifrostMint.estimatedOutput')}</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {estimatedOutput} {selectedToken}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {t('bifrostMint.mintRatio', { from: selectedTokenConfig.underlying, to: selectedToken })}
            </div>
          </div>
        )}

        {/* 铸造按钮 */}
        <button
          onClick={handleMint}
          disabled={loading || !amount || !networkConnected}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('bifrostMint.minting')}
            </>
          ) : (
            <>
              <ArrowUpDown className="w-5 h-5" />
              {t('bifrostMint.mintVTokenButton', { token: selectedToken })}
            </>
          )}
        </button>

        {/* 说明文字 */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>{t('bifrostMint.mintDescription1')}</p>
          <p>{t('bifrostMint.mintDescription2')}</p>
          <p>{t('bifrostMint.mintDescription3')}</p>
        </div>
      </div>
    </div>
  );
};

export default BifrostMintInterface;