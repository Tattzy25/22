"use client"

import { useState } from "react"
import { APIKey, BillingInfo } from "./types"

export function useApi() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      provider: 'openai',
      name: 'OpenAI Production',
      key: 'sk-1234567890abcdef',
      maskedKey: 'sk-1234...cdef',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastUsed: new Date('2024-01-15'),
      usage: { requests: 2450, tokens: 125000, cost: 12.50 },
      limits: { monthlyRequests: 10000, monthlyTokens: 100000, monthlyBudget: 20 },
      permissions: ['read', 'write', 'billing']
    },
    {
      id: '2',
      provider: 'anthropic',
      name: 'Anthropic Development',
      key: 'sk-ant-1234567890abcdef',
      maskedKey: 'sk-ant-1234...cdef',
      isActive: false,
      createdAt: new Date('2024-01-05'),
      usage: { requests: 0, tokens: 0, cost: 0 },
      limits: { monthlyRequests: 1000, monthlyTokens: 10000, monthlyBudget: 5 },
      permissions: ['read']
    }
  ])

  const [billingInfo] = useState<BillingInfo>({
    plan: 'pro',
    status: 'active',
    currentUsage: { requests: 2450, tokens: 125000, cost: 12.50 },
    limits: { monthlyRequests: 100000, monthlyTokens: 1000000, monthlyBudget: 50 },
    nextBillingDate: new Date('2024-02-01'),
    paymentMethod: { type: 'card', last4: '4242' }
  })

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const addApiKey = (newKey: {
    provider: string
    name: string
    key: string
    monthlyRequests: number
    monthlyTokens: number
    monthlyBudget: number
  }) => {
    if (!newKey.provider || !newKey.name || !newKey.key) return

    const key: APIKey = {
      id: `key-${Date.now()}`,
      provider: newKey.provider,
      name: newKey.name,
      key: newKey.key,
      maskedKey: `${newKey.key.slice(0, 8)}...${newKey.key.slice(-4)}`,
      isActive: true,
      createdAt: new Date(),
      usage: { requests: 0, tokens: 0, cost: 0 },
      limits: {
        monthlyRequests: newKey.monthlyRequests,
        monthlyTokens: newKey.monthlyTokens,
        monthlyBudget: newKey.monthlyBudget
      },
      permissions: ['read']
    }

    setApiKeys(prev => [...prev, key])
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const toggleKeyStatus = (keyId: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === keyId ? { ...key, isActive: !key.isActive } : key
    ))
  }

  const deleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  return {
    apiKeys,
    billingInfo,
    visibleKeys,
    addApiKey,
    toggleKeyVisibility,
    toggleKeyStatus,
    deleteKey,
    copyToClipboard,
    getUsagePercentage
  }
}