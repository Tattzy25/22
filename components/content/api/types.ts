export interface APIKey {
  id: string
  provider: string
  name: string
  key: string
  maskedKey: string
  isActive: boolean
  createdAt: Date
  lastUsed?: Date
  usage: {
    requests: number
    tokens: number
    cost: number
  }
  limits: {
    monthlyRequests: number
    monthlyTokens: number
    monthlyBudget: number
  }
  permissions: string[]
}

export interface BillingInfo {
  plan: string
  status: 'active' | 'inactive' | 'overdue'
  currentUsage: {
    requests: number
    tokens: number
    cost: number
  }
  limits: {
    monthlyRequests: number
    monthlyTokens: number
    monthlyBudget: number
  }
  nextBillingDate: Date
  paymentMethod: {
    type: string
    last4: string
  }
}

export interface AIProvider {
  id: string
  name: string
  icon: string
  models: string[]
}

export interface BillingPlan {
  id: string
  name: string
  price: number
  limits: {
    requests: number
    tokens: number
    budget: number
  }
}

export const aiProviders: AIProvider[] = [
  { id: 'openai', name: 'OpenAI', icon: '🤖', models: ['GPT-4', 'GPT-3.5', 'DALL-E'] },
  { id: 'anthropic', name: 'Anthropic', icon: '🧠', models: ['Claude-3', 'Claude-2'] },
  { id: 'google', name: 'Google AI', icon: '🔍', models: ['Gemini Pro', 'Gemini Ultra'] },
  { id: 'cohere', name: 'Cohere', icon: '💭', models: ['Command', 'Base'] },
  { id: 'stability', name: 'Stability AI', icon: '🎨', models: ['Stable Diffusion'] },
  { id: 'replicate', name: 'Replicate', icon: '🔄', models: ['Various'] }
]

export const billingPlans: BillingPlan[] = [
  { id: 'free', name: 'Free', price: 0, limits: { requests: 1000, tokens: 10000, budget: 0 } },
  { id: 'starter', name: 'Starter', price: 19, limits: { requests: 10000, tokens: 100000, budget: 10 } },
  { id: 'pro', name: 'Professional', price: 99, limits: { requests: 100000, tokens: 1000000, budget: 50 } },
  { id: 'enterprise', name: 'Enterprise', price: 299, limits: { requests: 1000000, tokens: 10000000, budget: 200 } }
]