export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  tokens: number
  features: string[]
  popular?: boolean
  icon: any
  color: string
}

export interface UsageStats {
  currentTokens: number
  totalTokens: number
  monthlyUsage: number
  apiCalls: number
  storageUsed: number
  activeProjects: number
}

export interface BillingHistory {
  id: string
  date: Date
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
  invoiceUrl?: string
}