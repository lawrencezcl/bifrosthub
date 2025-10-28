import { Activity, Wallet, LogOut, Check, AlertCircle, Languages, ChevronDown } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const { 
    ethAddress, 
    polkadotAddress, 
    ethConnected, 
    polkadotConnected,
    connectEth,
    connectPolkadot,
    disconnectEth,
    disconnectPolkadot,
    isConnecting
  } = useWeb3()

  const { t, i18n } = useTranslation()
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    setLanguageDropdownOpen(false)
    toast.success(
      lang === 'zh-CN' ? '语言已切换为中文' : 'Language switched to English',
      {
        description: lang === 'zh-CN' ? '界面语言已更新' : 'Interface language updated'
      }
    )
  }

  // 点击外部关闭dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'zh-CN' ? '中文' : 'English'
  }

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t('header.title')}</h1>
              <p className="text-xs text-gray-400">{t('header.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* 语言切换下拉菜单 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
                title={t('header.language')}
              >
                <Languages className="w-4 h-4" />
                <span className="text-sm">{getCurrentLanguageLabel()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown菜单 */}
              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50">
                  <button
                    onClick={() => changeLanguage('zh-CN')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      i18n.language === 'zh-CN' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>中文</span>
                      {i18n.language === 'zh-CN' && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                  <button
                    onClick={() => changeLanguage('en-US')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      i18n.language === 'en-US' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>English</span>
                      {i18n.language === 'en-US' && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* MetaMask连接按钮 */}
            {!ethConnected ? (
              <button 
                onClick={async () => {
                  try {
                    await connectEth()
                  } catch (error) {
                    console.error('MetaMask连接错误:', error)
                  }
                }}
                disabled={isConnecting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 ${
                  isConnecting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-orange-500/25'
                }`}
              >
                <Wallet className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
                <span>{isConnecting ? t('common.connecting') : t('header.connectMetaMask')}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30 animate-pulse">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    {shortenAddress(ethAddress!)}
                  </span>
                </div>
                <button
                  onClick={disconnectEth}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                  title={t('header.disconnectTooltip')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Polkadot.js连接按钮 */}
            {!polkadotConnected ? (
              <button 
                onClick={async () => {
                  try {
                    await connectPolkadot()
                  } catch (error) {
                    console.error('Polkadot连接错误:', error)
                  }
                }}
                disabled={isConnecting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 ${
                  isConnecting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-pink-500/25'
                }`}
              >
                <Wallet className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
                <span>{isConnecting ? t('common.connecting') : t('header.connectPolkadot')}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-4 py-2 bg-pink-500/20 rounded-lg border border-pink-500/30 animate-pulse">
                  <Check className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-400 text-sm font-medium">
                    {shortenAddress(polkadotAddress!)}
                  </span>
                </div>
                <button
                  onClick={disconnectPolkadot}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                  title={t('header.disconnectTooltip')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
