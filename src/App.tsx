import { useState } from 'react'
import { LayoutDashboard, TrendingUp, Fuel, Shield, Coins, Brain } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Web3Provider } from './contexts/Web3Context'
import Header from './components/Header'
import AssetDashboard from './components/AssetDashboard'
import YieldRouter from './components/YieldRouter'
import GasOptimizer from './components/GasOptimizer'
import RiskManager from './components/RiskManager'
import BifrostMintInterface from './components/BifrostMintInterface'
import BifrostRedeemInterface from './components/BifrostRedeemInterface'
import IntelligentStakingAssistant from './components/IntelligentStakingAssistant'
import './App.css'

type TabType = 'dashboard' | 'yield' | 'gas' | 'risk' | 'bifrost-mint' | 'bifrost-redeem' | 'ai-assistant'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const { t } = useTranslation()

  const tabs = [
    { id: 'dashboard' as TabType, labelKey: 'nav.dashboard', icon: LayoutDashboard },
    { id: 'yield' as TabType, labelKey: 'nav.yieldRouter', icon: TrendingUp },
    { id: 'gas' as TabType, labelKey: 'nav.gasOptimizer', icon: Fuel },
    { id: 'risk' as TabType, labelKey: 'nav.riskManager', icon: Shield },
    { id: 'bifrost-mint' as TabType, labelKey: 'nav.bifrostMint', icon: Coins },
    { id: 'bifrost-redeem' as TabType, labelKey: 'nav.bifrostRedeem', icon: Coins },
    { id: 'ai-assistant' as TabType, labelKey: 'nav.aiAssistant', icon: Brain },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AssetDashboard />
      case 'yield':
        return <YieldRouter />
      case 'gas':
        return <GasOptimizer />
      case 'risk':
        return <RiskManager />
      case 'bifrost-mint':
        return <BifrostMintInterface />
      case 'bifrost-redeem':
        return <BifrostRedeemInterface />
      case 'ai-assistant':
        return <IntelligentStakingAssistant />
      default:
        return <AssetDashboard />
    }
  }

  return (
    <Web3Provider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        
        <div className="container mx-auto px-4 py-6">
          {/* 导航标签 */}
          <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{t(tab.labelKey)}</span>
              </button>
            ))}
          </div>

          {/* 内容区域 */}
          <div className="animate-fadeIn">
            {renderContent()}
          </div>
        </div>

        {/* 页脚 */}
        <footer className="border-t border-gray-800 mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                {t('footer.copyright')}
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">{t('footer.docs')}</a>
                <a href="#" className="hover:text-white transition-colors">{t('footer.community')}</a>
                <a href="#" className="hover:text-white transition-colors">{t('footer.support')}</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Web3Provider>
  )
}

export default App
