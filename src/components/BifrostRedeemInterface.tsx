import React, { useState, useEffect } from 'react';
import { useBifrostVTokens } from '../hooks/useBifrostVTokens';
import { VTOKENS } from '../config/bifrost';
import { toast } from 'sonner';
import { Loader2, ArrowDownUp, Clock, Zap, Info, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BifrostRedeemInterfaceProps {
  userAddress?: string;
  onSuccess?: () => void;
}

const BifrostRedeemInterface: React.FC<BifrostRedeemInterfaceProps> = ({
  userAddress,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [selectedToken, setSelectedToken] = useState('vDOT');
  const [amount, setAmount] = useState('');
  const [quickRedeem, setQuickRedeem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(false);
  
  const { 
    api, 
    networkStatus, 
    balances,
    fetchVTokenBalances, 
    redeemVToken 
  } = useBifrostVTokens();

  // 检查网络连接
  useEffect(() => {
    setNetworkConnected(networkStatus.isConnected);
  }, [networkStatus.isConnected]);

  // 获取当前选择的代币余额
  const currentBalance = balances.find(b => b.symbol === selectedToken);
  const availableBalance = currentBalance?.availableBalance || '0';

  const handleRedeem = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(t('bifrostRedeem.enterAmount'));
      return;
    }

    if (parseFloat(amount) > parseFloat(availableBalance)) {
      toast.error(t('bifrostRedeem.insufficientBalance'));
      return;
    }

    if (!networkConnected) {
      toast.error(t('bifrostRedeem.connectNetwork'));
      return;
    }

    setLoading(true);
    try {
      const result = await redeemVToken({
        amount,
        tokenSymbol: selectedToken,
        quickRedeem,
        account: userAddress || '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      });
      
      if (result) {
        const redeemType = quickRedeem ? t('bifrostRedeem.quickRedeemType') : t('bifrostRedeem.standardRedeemType');
        toast.success(t('bifrostRedeem.redeemInitiated', { type: redeemType, amount, token: selectedToken }));
        setAmount('');
        
        // 刷新余额
        if (userAddress) {
          fetchVTokenBalances(userAddress);
        }
        
        onSuccess?.();
      }
      
    } catch (error: any) {
      console.error('Redeem error:', error);
      toast.error(t('bifrostRedeem.redeemFailed') + `: ${error.message || t('bifrostRedeem.unknownError')}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxAmount = () => {
    setAmount(availableBalance);
  };

  const selectedTokenConfig = VTOKENS[selectedToken as keyof typeof VTOKENS];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ArrowDownUp className="w-5 h-5 text-red-600" />
          {t('bifrostRedeem.redeemVToken')}
        </h3>
        
        {/* 网络状态指示器 */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            networkConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600">
            {networkConnected ? t('bifrostRedeem.networkConnected') : t('bifrostRedeem.networkDisconnected')}
          </span>
        </div>
      </div>

      {/* 余额显示 */}
      {currentBalance && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">{t('bifrostRedeem.currentBalance')}</span>
          </div>
          <div className="text-lg font-semibold text-green-900">
            {parseFloat(availableBalance).toFixed(6)} {selectedToken}
          </div>
          <div className="text-sm text-green-700 mt-1">
            {t('bifrostRedeem.stakingRewards')}: {parseFloat(currentBalance.stakingRewards || '0').toFixed(6)} {selectedToken}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 选择代币 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('bifrostRedeem.selectRedeemToken')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(VTOKENS).map(([symbol, config]) => {
              const tokenBalance = balances.find(b => b.symbol === symbol);
              const hasBalance = tokenBalance && parseFloat(tokenBalance.availableBalance) > 0;
              
              return (
                <button
                  key={symbol}
                  onClick={() => setSelectedToken(symbol)}
                  className={`p-4 border-2 rounded-lg transition-all relative ${
                    selectedToken === symbol
                      ? 'border-red-500 bg-red-50'
                      : hasBalance
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-100 bg-gray-50 opacity-50'
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
                      {hasBalance && (
                        <div className="text-xs text-green-600 font-medium">
                          {parseFloat(tokenBalance.availableBalance).toFixed(4)} {t('bifrostRedeem.available')}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 赎回选项 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('bifrostRedeem.redeemMethod')}
          </label>
          <div className="space-y-3">
            <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              !quickRedeem ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                checked={!quickRedeem}
                onChange={() => setQuickRedeem(false)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{t('bifrostRedeem.standardRedeemTitle')}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {t('bifrostRedeem.standardRedeemDesc1')}
                  <br />
                  {t('bifrostRedeem.standardRedeemDesc2')}
                  <br />
                  {t('bifrostRedeem.standardRedeemDesc3')}
                </div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              quickRedeem ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                checked={quickRedeem}
                onChange={() => setQuickRedeem(true)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-gray-900">{t('bifrostRedeem.quickRedeemTitle')}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {t('bifrostRedeem.quickRedeemDesc1')}
                  <br />
                  {t('bifrostRedeem.quickRedeemDesc2')}
                  <br />
                  {t('bifrostRedeem.quickRedeemDesc3')}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* 输入金额 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('bifrostRedeem.redeemQuantity', { token: selectedToken })}
            </label>
            <button
              onClick={handleMaxAmount}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              disabled={!availableBalance || parseFloat(availableBalance) === 0}
            >
              {t('bifrostRedeem.max')}
            </button>
          </div>
          
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('bifrostRedeem.inputRedeemAmount', { token: selectedToken })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={loading}
              max={availableBalance}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              {selectedToken}
            </div>
          </div>
          
          {availableBalance && (
            <div className="text-xs text-gray-500 mt-1">
              {t('bifrostRedeem.availableBalanceLabel', { balance: parseFloat(availableBalance).toFixed(6), token: selectedToken })}
            </div>
          )}
        </div>

        {/* 预估输出 */}
        {amount && parseFloat(amount) > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{t('bifrostRedeem.estimatedOutput')}</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {amount} {selectedTokenConfig.underlying}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {t('bifrostRedeem.redeemRatio', { from: selectedToken, to: selectedTokenConfig.underlying })}
            </div>
            {quickRedeem && (
              <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                <AlertTriangle className="w-3 h-3" />
                {t('bifrostRedeem.slippageWarning')}
              </div>
            )}
          </div>
        )}

        {/* 赎回按钮 */}
        <button
          onClick={handleRedeem}
          disabled={loading || !amount || !networkConnected || parseFloat(amount) > parseFloat(availableBalance)}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('bifrostRedeem.redeeming')}
            </>
          ) : (
            <>
              <ArrowDownUp className="w-5 h-5" />
              {t('bifrostRedeem.redeemVTokenButton', { mode: quickRedeem ? t('bifrostRedeem.quickRedeemTitle') : t('bifrostRedeem.standardRedeemTitle'), token: selectedToken })}
            </>
          )}
        </button>

        {/* 说明文字 */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>{t('bifrostRedeem.redeemDescription1')}</p>
          <p>{t('bifrostRedeem.redeemDescription2')}</p>
          <p>{t('bifrostRedeem.redeemDescription3')}</p>
          {quickRedeem && (
            <p className="text-orange-600">{t('bifrostRedeem.redeemDescription4')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BifrostRedeemInterface;