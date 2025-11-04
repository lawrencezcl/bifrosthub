import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { toast } from 'sonner'
import { TESTNET_CONFIG, switchToTestnet } from '../config/testnet'

interface Web3ContextType {
  // Ethereum/EVM
  ethAddress: string | null
  ethSigner: JsonRpcSigner | null
  connectEth: () => Promise<void>
  disconnectEth: () => void
  ethConnected: boolean
  
  // Polkadot
  polkadotAddress: string | null
  polkadotApi: ApiPromise | null
  connectPolkadot: () => Promise<void>
  disconnectPolkadot: () => void
  polkadotConnected: boolean
  
  // Loading states
  isConnecting: boolean
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  // Ethereum state
  const [ethAddress, setEthAddress] = useState<string | null>(null)
  const [ethSigner, setEthSigner] = useState<JsonRpcSigner | null>(null)
  const [ethConnected, setEthConnected] = useState(false)

  // Polkadot state
  const [polkadotAddress, setPolkadotAddress] = useState<string | null>(null)
  const [polkadotApi, setPolkadotApi] = useState<ApiPromise | null>(null)
  const [polkadotConnected, setPolkadotConnected] = useState(false)

  const [isConnecting, setIsConnecting] = useState(false)

  // Connect to MetaMask
  const connectEth = async () => {
    try {
      setIsConnecting(true)
      
      if (typeof window.ethereum === 'undefined') {
        toast.error('请安装MetaMask钱包', {
          description: '访问 https://metamask.io 下载并安装MetaMask钱包扩展',
          action: {
            label: '访问官网',
            onClick: () => window.open('https://metamask.io', '_blank')
          }
        })
        return
      }

      // 检查钱包是否已解锁
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length === 0) {
        // 请求连接
        await window.ethereum.request({ method: 'eth_requestAccounts' })
      }

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      // 获取当前网络ID
      const network = await provider.getNetwork()
      console.log('当前网络ID:', network.chainId.toString())

      // 如果不是Sepolia测试网，提示切换
      if (network.chainId.toString() !== '11155111') { // Sepolia的chainId是11155111
        toast.info('建议切换到Sepolia测试网', {
          description: '当前不在测试网环境，点击切换到Sepolia测试网',
          action: {
            label: '切换网络',
            onClick: async () => {
              try {
                await switchToTestnet(window.ethereum)
                toast.success('已切换到Sepolia测试网')
              } catch (error) {
                toast.error('网络切换失败')
              }
            }
          }
        })
      }

      setEthAddress(address)
      setEthSigner(signer)
      setEthConnected(true)

      // Save to localStorage
      localStorage.setItem('ethConnected', 'true')
      localStorage.setItem('ethAddress', address)
      
      toast.success('MetaMask连接成功', {
        description: `已连接到地址: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      })
      
    } catch (error: any) {
      console.error('连接MetaMask失败:', error)
      
      let errorMessage = '连接MetaMask失败'
      let description = '请重试或检查钱包状态'
      
      if (error.code === 4001) {
        errorMessage = '连接被用户拒绝'
        description = '请在MetaMask中允许连接此网站'
      } else if (error.message?.includes('No Ethereum provider')) {
        errorMessage = '未检测到以太坊钱包'
        description = '请确保已安装MetaMask或兼容的钱包扩展'
      } else if (error.message?.includes('User rejected')) {
        errorMessage = '连接请求被拒绝'
        description = '请在钱包中确认连接请求'
      }
      
      toast.error(errorMessage, { description })
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect Ethereum
  const disconnectEth = () => {
    setEthAddress(null)
    setEthSigner(null)
    setEthConnected(false)
    localStorage.removeItem('ethConnected')
    localStorage.removeItem('ethAddress')
    
    toast.success('MetaMask已断开连接')
  }

  // Connect to Polkadot.js extension
  const connectPolkadot = async () => {
    try {
      setIsConnecting(true)
      
      // Enable Polkadot extension
      const extensions = await web3Enable('Bifrost LSTfi Hub')
      if (extensions.length === 0) {
        toast.error('请安装Polkadot.js钱包扩展', {
          description: '访问 https://polkadot.js.org/extension 下载并安装Polkadot.js钱包扩展',
          action: {
            label: '访问官网',
            onClick: () => window.open('https://polkadot.js.org/extension', '_blank')
          }
        })
        return
      }

      // Get accounts
      const allAccounts = await web3Accounts()
      if (allAccounts.length === 0) {
        toast.error('未找到Polkadot账户', {
          description: '请在Polkadot.js扩展中创建或导入账户'
        })
        return
      }

      // Use first account
      const account = allAccounts[0]
      setPolkadotAddress(account.address)

      // 使用测试网端点 (Westend)
      const endpoints = TESTNET_CONFIG.polkadot.endpoints

      let api = null
      let connected = false
      
      // 尝试连接各个端点
      for (const endpoint of endpoints) {
        try {
          console.log(`尝试连接到: ${endpoint}`)
          const wsProvider = new WsProvider(endpoint)
          const testApi = await ApiPromise.create({ 
            provider: wsProvider
          })
          
          // 测试连接 - 等待ready状态但有超时
          await Promise.race([
            testApi.isReady,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('连接超时')), 15000)
            )
          ])
          
          api = testApi
          connected = true
          console.log(`成功连接到: ${endpoint}`)
          break
          
        } catch (endpointError: any) {
          console.warn(`端点 ${endpoint} 连接失败:`, endpointError?.message || endpointError)
          continue
        }
      }

      if (!connected || !api) {
        // 即使API连接失败，仍然可以显示钱包地址
        setPolkadotConnected(true)
        localStorage.setItem('polkadotConnected', 'true')
        localStorage.setItem('polkadotAddress', account.address)
        
        toast.warning('Polkadot钱包连接成功', {
          description: `已连接账户: ${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4)} (网络连接暂时不可用)`,
          duration: 5000
        })
        return
      }

      setPolkadotApi(api)
      setPolkadotConnected(true)

      // Save to localStorage
      localStorage.setItem('polkadotConnected', 'true')
      localStorage.setItem('polkadotAddress', account.address)
      
      toast.success('Polkadot连接成功', {
        description: `已连接到${TESTNET_CONFIG.polkadot.networkName}: ${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4)}`
      })
      
    } catch (error: any) {
      console.error('连接Polkadot失败:', error)
      
      let errorMessage = '连接Polkadot失败'
      let description = '请重试或检查网络连接'
      
      if (error.message?.includes('No extension found')) {
        errorMessage = '未检测到Polkadot扩展'
        description = '请确保已安装Polkadot.js钱包扩展'
      } else if (error.message?.includes('No accounts found')) {
        errorMessage = '未找到账户'
        description = '请在Polkadot.js扩展中创建账户'
      } else if (error.message?.includes('timeout') || error.message?.includes('超时')) {
        errorMessage = '连接超时'
        description = '网络连接较慢，请稍后重试'
      } else if (error.message?.includes('WebSocket')) {
        errorMessage = '网络连接失败'
        description = '请检查网络连接或稍后重试'
      }
      
      toast.error(errorMessage, { description })
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect Polkadot
  const disconnectPolkadot = async () => {
    if (polkadotApi) {
      await polkadotApi.disconnect()
    }
    setPolkadotAddress(null)
    setPolkadotApi(null)
    setPolkadotConnected(false)
    localStorage.removeItem('polkadotConnected')
    localStorage.removeItem('polkadotAddress')
    
    toast.success('Polkadot已断开连接')
  }

  // Auto-reconnect on page load
  useEffect(() => {
    const autoConnect = async () => {
      // Eth auto-reconnect
      if (localStorage.getItem('ethConnected') === 'true') {
        await connectEth()
      }

      // Polkadot auto-reconnect
      if (localStorage.getItem('polkadotConnected') === 'true') {
        await connectPolkadot()
      }
    }

    autoConnect()
  }, [])

  const value = {
    ethAddress,
    ethSigner,
    connectEth,
    disconnectEth,
    ethConnected,
    polkadotAddress,
    polkadotApi,
    connectPolkadot,
    disconnectPolkadot,
    polkadotConnected,
    isConnecting,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}
