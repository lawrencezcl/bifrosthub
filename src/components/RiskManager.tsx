// @ts-nocheck
import { AlertTriangle, Shield, Activity, XCircle, RefreshCw } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'
import { useRealData } from '../hooks/useRealData'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export default function RiskManager() {
  const { t } = useTranslation()
  
  const getSeverityConfig = (severity: number) => {
    if (severity <= 2) return { label: t('riskManager.low'), color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Activity }
    if (severity === 3) return { label: t('riskManager.medium'), color: 'text-orange-400', bg: 'bg-orange-500/20', icon: AlertTriangle }
    return { label: t('riskManager.high'), color: 'text-red-400', bg: 'bg-red-500/20', icon: XCircle }
  }

  const { fetchRiskData, loading } = useRealData()
  const [riskData, setRiskData] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [activeAlerts, setActiveAlerts] = useState<any[]>([])

  const loadRiskData = async () => {
    setRefreshing(true)
    try {
      const data = await fetchRiskData()
      if (data) {
        setRiskData(data)
        
        // 生成基于真实数据的预警信息
        const alerts = []
        if (data.protocols) {
          data.protocols.forEach((protocol: any, index: number) => {
            if (protocol.activeAlerts > 0) {
              alerts.push({
                id: `alert-${index}`,
                asset: protocol.name,
                type: 'protocol_health',
                severity: protocol.health < 80 ? 3 : 2,
                message: t('riskManager.protocolHealthDown', { protocol: protocol.name, health: protocol.health, riskLevel: protocol.riskLevel }),
                timestamp: t('common.hoursAgo', { count: 1 })
              })
            }
          })
        }
        
        // 添加一些基于网络状态的模拟预警
        if (data.marketConditions?.volatility === 'high') {
          alerts.push({
            id: 'volatility-alert',
            asset: t('riskManager.overallMarket'),
            type: 'high_volatility',
            severity: 3,
            message: t('riskManager.highVolatilityAlert'),
            timestamp: t('common.minutesAgo', { count: 30 })
          })
        }
        
        setActiveAlerts(alerts)
        toast.success(t('riskManager.dataRefreshed'), {
          description: `${t('riskManager.portfolioRiskScore')}: ${data.overallScore}${t('common.points')}`
        })
      }
    } catch (error) {
      console.error('加载风险数据失败:', error)
      toast.error(t('riskManager.refreshFailed'))
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadRiskData()
    // 每5分钟自动刷新
    const interval = setInterval(loadRiskData, 300000)
    return () => clearInterval(interval)
  }, [])

  const totalAlerts = activeAlerts.length
  const avgHealth = riskData?.protocols 
    ? riskData.protocols.reduce((sum: number, p: any) => sum + p.healthScore, 0) / riskData.protocols.length 
    : 0

  // 生成风险雷达数据
  const riskRadarData = riskData?.marketConditions 
    ? [
        { metric: t('riskManager.metricProtocolSecurity'), value: riskData.overallScore || 75 },
        { metric: t('riskManager.metricLiquidity'), value: riskData.marketConditions.liquidity === 'high' ? 85 : 60 },
        { metric: t('riskManager.metricAuditStatus'), value: 90 },
        { metric: t('riskManager.metricCommunityActivity'), value: 80 },
        { metric: t('riskManager.metricTVLStability'), value: riskData.marketConditions.volatility === 'low' ? 88 : 65 },
        { metric: t('riskManager.metricPriceStability'), value: riskData.marketConditions.correlation === 'low' ? 92 : 70 },
      ]
    : [
        { metric: t('riskManager.metricProtocolSecurity'), value: 75 },
        { metric: t('riskManager.metricLiquidity'), value: 70 },
        { metric: t('riskManager.metricAuditStatus'), value: 80 },
        { metric: t('riskManager.metricCommunityActivity'), value: 75 },
        { metric: t('riskManager.metricTVLStability'), value: 70 },
        { metric: t('riskManager.metricPriceStability'), value: 75 },
      ]

  const protocolHealth = riskData?.protocols || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('riskManager.title')}</h2>
          <p className="text-gray-400 mt-1">{t('riskManager.subtitle')}</p>
        </div>
        <button
          onClick={loadRiskData}
          disabled={refreshing || loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? t('common.refreshing') : t('riskManager.refreshData')}</span>
        </button>
      </div>

      {/* 风险总览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="gradient-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">{t('riskManager.activeAlerts')}</span>
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totalAlerts}</div>
          <div className="text-yellow-400 text-sm mt-2">{t('riskManager.needsAttention')}</div>
        </div>

        <div className="gradient-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">{t('riskManager.protocolHealth')}</span>
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{avgHealth.toFixed(0)}%</div>
          <div className="text-green-400 text-sm mt-2">{t('riskManager.overallHealth')}</div>
        </div>

        <div className="gradient-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">{t('riskManager.riskLevelLabel')}</span>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{t('riskManager.low')}</div>
          <div className="text-gray-400 text-sm mt-2">{t('riskManager.withinControl')}</div>
        </div>
      </div>

      {/* 活跃预警 */}
      {activeAlerts.length > 0 && (
        <div className="gradient-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">活跃预警</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300">查看全部</button>
          </div>
          <div className="space-y-3">
            {activeAlerts.map((alert) => {
              const config = getSeverityConfig(alert.severity)
              const Icon = config.icon
              return (
                <div key={alert.id} className={`p-4 ${config.bg} rounded-lg border border-${config.color.replace('text-', '')}/30`}>
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-6 h-6 ${config.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{alert.asset}</span>
                          <span className={`px-2 py-0.5 ${config.bg} ${config.color} rounded text-xs font-medium`}>
                            {config.label}风险
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">{alert.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors">
                          查看详情
                        </button>
                        <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors">
                          执行对冲
                        </button>
                        <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors">
                          忽略
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 协议健康度和风险雷达 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 协议健康度评分 */}
        <div className="gradient-border p-6">
          <h3 className="text-lg font-semibold text-white mb-4">协议健康度评分</h3>
          <div className="space-y-4">
            {protocolHealth.map((protocol, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{protocol.protocol}</span>
                    {protocol.audited && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">已审计</span>
                    )}
                  </div>
                  <span className={`font-semibold ${protocol.health >= 90 ? 'text-green-400' : protocol.health >= 80 ? 'text-yellow-400' : 'text-orange-400'}`}>
                    {protocol.health}分
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${protocol.health >= 90 ? 'bg-green-500' : protocol.health >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                    style={{ width: `${protocol.health}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>TVL: ${(protocol.tvl / 1000000).toFixed(1)}M</span>
                  <span className={protocol.risk === 'low' ? 'text-green-400' : 'text-yellow-400'}>
                    {protocol.risk === 'low' ? '低风险' : '中风险'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 风险雷达图 */}
        <div className="gradient-border p-6">
          <h3 className="text-lg font-semibold text-white mb-4">风险雷达</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={riskRadarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
              <PolarRadiusAxis stroke="#9CA3AF" domain={[0, 100]} />
              <Radar name="风险指标" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-gray-400 text-sm mt-4">
            整体风险评估显示当前投资组合处于健康状态，各项指标均在安全范围内。
          </p>
        </div>
      </div>

      {/* 风险对冲工具 */}
      <div className="gradient-border p-6">
        <h3 className="text-lg font-semibold text-white mb-4">一键风险对冲</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">自动平衡</h4>
                <p className="text-gray-400 text-sm mb-3">
                  根据风险偏好自动调整资产配置
                </p>
                <button className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors">
                  启用
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">止损保护</h4>
                <p className="text-gray-400 text-sm mb-3">
                  设置自动止损触发条件
                </p>
                <button className="w-full py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors">
                  配置
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">紧急退出</h4>
                <p className="text-gray-400 text-sm mb-3">
                  一键退出所有高风险仓位
                </p>
                <button className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors">
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
