import { Zap, TrendingUp, Shield, DollarSign, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRealData } from '../hooks/useRealData'
import { useWeb3 } from '../contexts/Web3Context'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

interface Strategy {
  name: string
  protocol: string
  chain: string
  asset_symbol: string
  apy: number
  risk_score: number
  gas_cost: number
  tvl_usd: number
  is_active: boolean
}

export default function YieldRouter() {
  const { ethAddress } = useWeb3()
  const { fetchYieldData, loading } = useRealData()
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { t } = useTranslation()

  const getRiskLabel = (score: number) => {
    if (score <= 2) return { label: t('yieldRouter.riskLow'), color: 'text-green-400', bg: 'bg-green-500/20' }
    if (score <= 4) return { label: t('yieldRouter.riskMedium'), color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
    return { label: t('yieldRouter.riskHigh'), color: 'text-red-400', bg: 'bg-red-500/20' }
  }

  const fetchStrategies = async () => {
    if (!ethAddress) {
      toast.info(t('yieldRouter.connectWalletPrompt'), {
        description: t('yieldRouter.connectWalletDesc')
      })
      return
    }

    setRefreshing(true)
    try {
      const data = await fetchYieldData()
      
      if (data && data.length > 0) {
        // 转换数据格式以匹配组件接口
        const formattedStrategies: Strategy[] = data.map((item: any, index: number) => ({
          name: `${item.protocol} ${item.asset} ${t('yieldRouter.yieldStrategy')}`,
          protocol: item.protocol,
          chain: 'Ethereum', // 假设都在以太坊上
          asset_symbol: item.asset,
          apy: item.apy,
          risk_score: item.riskLevel === 'low' ? 2 : item.riskLevel === 'medium' ? 3 : 4,
          gas_cost: 15 + Math.random() * 10, // 模拟Gas成本
          tvl_usd: item.tvl || (1000000 + Math.random() * 5000000), // 模拟TVL
          is_active: true,
        }))
        
        setStrategies(formattedStrategies)
        setLastUpdated(new Date())
        toast.success(t('yieldRouter.strategiesUpdated'), {
          description: t('yieldRouter.strategiesUpdatedDesc', { count: formattedStrategies.length })
        })
      } else {
        toast.warning(t('yieldRouter.noStrategies'), {
          description: t('yieldRouter.noStrategiesDesc')
        })
      }
    } catch (error: any) {
      console.error('获取收益策略失败:', error)
      toast.error(t('yieldRouter.fetchFailed'), {
        description: error.message || t('yieldRouter.fetchFailedDesc')
      })
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStrategies()
    // 每5分钟自动刷新
    const interval = setInterval(fetchStrategies, 300000)
    return () => clearInterval(interval)
  }, [ethAddress])

  // 找到APY最高的策略作为最优推荐
  const bestStrategy = strategies.length > 0 
    ? strategies.reduce((prev, current) => (prev.apy > current.apy) ? prev : current)
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('yieldRouter.title')}</h2>
          <p className="text-gray-400 mt-1">{t('yieldRouter.subtitle')}</p>
        </div>
        <button 
          onClick={fetchStrategies}
          disabled={refreshing || loading}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? t('common.updating') : t('yieldRouter.refreshStrategies')}</span>
        </button>
      </div>

      {lastUpdated && (
        <div className="text-sm text-gray-400">
          {t('yieldRouter.lastUpdated')}: {lastUpdated.toLocaleString()}
        </div>
      )}

      {/* 最优推荐 */}
      {bestStrategy && (
        <div className="gradient-border p-6 glow-effect">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">{t('yieldRouter.bestStrategy')}</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white">{bestStrategy.name}</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    {t('yieldRouter.protocolOnChain', { protocol: bestStrategy.protocol, chain: bestStrategy.chain, asset: bestStrategy.asset_symbol })}
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">{t('yieldRouter.protocolLabel')}</span>
                      <span className="text-white font-medium">{bestStrategy.protocol}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">{t('yieldRouter.chainLabel')}</span>
                      <span className="text-white font-medium">{bestStrategy.chain}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">TVL:</span>
                      <span className="text-white font-medium">${(bestStrategy.tvl_usd / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                <span className="text-gray-400">APY</span>
                <span className="text-2xl font-bold text-green-400">{bestStrategy.apy.toFixed(2)}%</span>
              </div>
              <button 
                onClick={() => {
                  toast.info(t('yieldRouter.executeStrategyTitle'), {
                    description: t('yieldRouter.executeStrategyDesc', { name: bestStrategy.name })
                  })
                }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-medium transition-all duration-200"
              >
                {t('yieldRouter.executeStrategy')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 所有策略列表 */}
      <div className="gradient-border p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t('yieldRouter.availableStrategies')}</h3>
        
        {(refreshing || loading) ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-gray-800/50 rounded-lg animate-pulse">
                <div className="h-20 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {strategies.map((strategy, index) => {
              const risk = getRiskLabel(strategy.risk_score)
              return (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-semibold">{strategy.name}</h4>
                        <span className={`px-2 py-1 ${risk.bg} ${risk.color} rounded text-xs font-medium`}>
                          {risk.label}
                        </span>
                        {strategy.is_active && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                            {t('yieldRouter.active')}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        {t('yieldRouter.protocolDash', { protocol: strategy.protocol, chain: strategy.chain })}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <div className="text-gray-400 text-xs mb-1">APY</div>
                          <div className="text-green-400 font-semibold">{strategy.apy.toFixed(2)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs mb-1">{t('yieldRouter.protocol')}</div>
                          <div className="text-white font-medium">{strategy.protocol}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs mb-1">{t('yieldRouter.chain')}</div>
                          <div className="text-white font-medium">{strategy.chain}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs mb-1">{t('yieldRouter.gasCost')}</div>
                          <div className="text-white font-medium">${strategy.gas_cost.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs mb-1">TVL</div>
                          <div className="text-white font-medium">${(strategy.tvl_usd / 1000000).toFixed(1)}M</div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <button 
                        onClick={() => {
                          toast.info(t('yieldRouter.viewDetailsTitle'), {
                            description: t('yieldRouter.viewDetailsDesc', { name: strategy.name })
                          })
                        }}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors whitespace-nowrap"
                      >
                        {t('common.details')}
                      </button>
                      <button 
                        onClick={() => {
                          toast.info(t('yieldRouter.executeStrategyTitle'), {
                            description: t('yieldRouter.executeStrategyDesc', { name: strategy.name })
                          })
                        }}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors whitespace-nowrap"
                      >
                        {t('common.execute')}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 策略对比 */}
      {!refreshing && !loading && strategies.length > 0 && (
        <div className="gradient-border p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('yieldRouter.strategyComparison')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('yieldRouter.strategyName')}</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">{t('assetDashboard.apy')}</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">{t('yieldRouter.riskLevel')}</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">{t('yieldRouter.gasCost')}</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">{t('yieldRouter.netYield')}</th>
                </tr>
              </thead>
              <tbody>
                {strategies.map((strategy, index) => {
                  const netYield = strategy.apy - (strategy.gas_cost / 10)
                  return (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-white">{strategy.name}</td>
                      <td className="py-3 px-4 text-center text-green-400 font-semibold">{strategy.apy.toFixed(2)}%</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Shield
                              key={i}
                              className={`w-4 h-4 ${i < strategy.risk_score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-white">${strategy.gas_cost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center text-green-400 font-semibold">{netYield.toFixed(2)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
