export interface Asset {
  id: string
  user_id: string
  chain: string
  asset_symbol: string
  balance: number
  value_usd: number
  apy: number
  last_updated: string
}

export interface YieldStrategy {
  id: string
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

export interface Transaction {
  id: string
  user_id: string
  tx_hash: string
  chain: string
  action: string
  amount: number
  asset_symbol: string
  status: string
  gas_fee: number
  created_at: string
}

export interface RiskAlert {
  id: string
  user_id: string
  asset_symbol: string
  alert_type: string
  severity: number
  message: string
  is_read: boolean
  created_at: string
}

export interface GasPrice {
  chain: string
  gas_price: number
  gas_price_gwei: number
  timestamp: string
}
