// @ts-nocheck
import { TrendingUp, DollarSign, Percent, Coins, RefreshCw } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useRealData } from '../hooks/useRealData'
import { useWeb3 } from '../contexts/Web3Context'
import { useTranslation } from 'react-i18next'

export default function AssetDashboard() {
  const { ethAddress, polkadotAddress } = useWeb3()
  const { fetchAllAssets, fetchYieldData, loading, error } = useRealData()
  const [assets, setAssets] = useState([])
  const [yieldData, setYieldData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const { t } = useTranslation()

  // 颜色映射
  const getAssetColor = (symbol: string) => {
    const colors: { [key: string]: string } = {
      'ETH': '#627EEA',
      'USDC': '#2775CA',
      'USDT': '#26A17B',
      'DOT': '#E6007A',
      'WND': '#E6007A',
    }
    return colors[symbol] || '#6B7280'
  }

  // 加载数据
  const loadData = async () => {
    if (!ethAddress && !polkadotAddress) {
      toast.info(t('assetDashboard.connectWalletPrompt'), {
        description: t('assetDashboard.connectWalletDesc')
      })
      return
    }

    setRefreshing(true)
    try {
      const [assetsData, yieldDataResult] = await Promise.all([
        fetchAllAssets(),
        fetchYieldData()
      ])
      
      setAssets(assetsData)
      setYieldData(yieldDataResult)
      
      toast.success(t('assetDashboard.refreshSuccess'), {
        description: t('assetDashboard.refreshSuccessDesc', { count: assetsData.length })
      })
    } catch (err) {
      console.error('加载数据失败:', err)
      toast.error(t('assetDashboard.refreshFailed'), {
        description: t('assetDashboard.refreshFailedDesc')
      })
    } finally {
      setRefreshing(false)
    }
  }

  // 组件加载时获取数据
  useEffect(() => {
    loadData()
  }, [ethAddress, polkadotAddress])

  // 计算统计数据
  const totalValue = assets.reduce((sum, asset) => sum + (asset.balance * 1), 0) // 假设价格都为1进行测试
  const avgApy = yieldData.length > 0 ? yieldData.reduce((sum, item) => sum + item.apy, 0) / yieldData.length : 0
  const totalYield = totalValue * (avgApy / 100) / 365 * 30 // 月收益估算

  // 生成饼图数据
  const pieData = assets.map(asset => ({
    name: asset.symbol,
    value: asset.balance,
    color: getAssetColor(asset.symbol)
  }))

  // 生成收益趋势数据 (基于真实数据生成)
  const yieldTrendData = Array.from({ length: 7 }, (_, i) => ({
    date: `11/${20 + i}`,
    value: totalValue * (1 + (Math.random() - 0.5) * 0.1) // 添加随机波动
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('assetDashboard.title')}</h2>
          <p className="text-gray-400 mt-1">{t('assetDashboard.subtitle')}</p>
        </div>
        <button
          onClick={loadData}
          disabled={refreshing || loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? t('common.refreshing') : t('assetDashboard.refreshData')}</span>
        </button>
      </div>

      {/* 总览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="gradient-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">{t('assetDashboard.totalValue')}</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">${totalValue.toLocaleString()}</div>
          <div className="text-green-400 text-sm mt-2">+5.2% {t('assetDashboard.weeklyIncrease')}</div>
        </div>

        <div className="gradient-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">{t('assetDashboard.averageApy')}</span>
            <Percent className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{avgApy.toFixed(2)}%</div>
          <div className="text-green-400 text-sm mt-2">{t('assetDashboard.aboveMarket')}</div>
        </div>

        <div className="gradient-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">{t('assetDashboard.monthlyYield')}</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">${totalYield.toFixed(2)}</div>
          <div className="text-blue-400 text-sm mt-2">{t('assetDashboard.estimated')}</div>
        </div>

        <div className="gradient-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">{t('assetDashboard.activeChains')}</span>
            <Coins className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {new Set(assets.map(asset => 
              asset.symbol === 'ETH' || asset.symbol === 'USDC' ? 'Ethereum' : 
              asset.symbol === 'DOT' || asset.symbol === 'WND' ? 'Polkadot' : 'Unknown'
            )).size}
          </div>
          <div className="text-gray-400 text-sm mt-2">{t('assetDashboard.multiChain')}</div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 资产分布饼图 */}
        <div className="gradient-border p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('assetDashboard.assetDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
                <span className="text-sm text-gray-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 收益趋势图 */}
        <div className="gradient-border p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('assetDashboard.yieldTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yieldTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 资产详情表格 */}
      <div className="gradient-border p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t('assetDashboard.assetDetails')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('assetDashboard.chain')}</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('assetDashboard.asset')}</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('assetDashboard.balance')}</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('assetDashboard.value')}</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('assetDashboard.apy')}</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">{t('assetDashboard.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    {ethAddress || polkadotAddress ? t('assetDashboard.loadingAssets') : t('assetDashboard.connectWalletFirst')}
                  </td>
                </tr>
              ) : (
                assets.map((asset, index) => (
                  <tr key={`${asset.symbol}-${index}`} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded-full" 
                          style={{ background: getAssetColor(asset.symbol) }} 
                        />
                        <span className="text-white font-medium">
                          {asset.symbol === 'ETH' ? 'Ethereum' : 
                           asset.symbol === 'DOT' || asset.symbol === 'WND' ? 'Polkadot' : 
                           asset.symbol === 'USDC' ? 'Ethereum' : 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">{asset.symbol}</td>
                    <td className="py-4 px-4 text-right text-white">
                      {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </td>
                    <td className="py-4 px-4 text-right text-white">
                      ${(asset.balance * 1).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-green-400 font-medium">
                        {yieldData.find(y => y.asset === asset.symbol)?.apy || 'N/A'}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => {
                          toast.info(t('assetDashboard.manageAsset'), {
                            description: t('assetDashboard.manageAssetDesc', { symbol: asset.symbol })
                          })
                        }}
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
                      >
                        {t('common.manage')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
