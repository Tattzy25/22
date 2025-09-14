import { useState } from "react"
import { SubscriptionPlan, UsageStats, BillingHistory } from "./types"
import { Zap, Crown, Rocket, Star } from "lucide-react"

export function useSalesState() {
  const [currentPlan, setCurrentPlan] = useState('starter')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      interval: 'month',
      tokens: 10000,
      features: [
        '10,000 AI tokens/month',
        'Basic AI models',
        'Community support',
        '3 projects',
        'Standard templates'
      ],
      icon: Zap,
      color: 'text-gray-600'
    },
    {
      id: 'starter',
      name: 'Starter',
      description: 'Great for individual creators',
      price: 19,
      interval: 'month',
      tokens: 100000,
      features: [
        '100,000 AI tokens/month',
        'All AI models',
        'Email support',
        'Unlimited projects',
        'Premium templates',
        'Basic analytics'
      ],
      icon: Star,
      color: 'text-blue-600'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For growing businesses',
      price: 49,
      interval: 'month',
      tokens: 500000,
      features: [
        '500,000 AI tokens/month',
        'Priority support',
        'Advanced analytics',
        'Team collaboration',
        'Custom integrations',
        'API access'
      ],
      icon: Crown,
      color: 'text-purple-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 99,
      interval: 'month',
      tokens: 2000000,
      features: [
        '2,000,000 AI tokens/month',
        'Dedicated support',
        'Custom models',
        'Advanced security',
        'SLA guarantee',
        'White-label options'
      ],
      icon: Rocket,
      color: 'text-green-600'
    }
  ]

  const usageStats: UsageStats = {
    currentTokens: 45230,
    totalTokens: 100000,
    monthlyUsage: 45230,
    apiCalls: 1250,
    storageUsed: 2.4,
    activeProjects: 8
  }

  const billingHistory: BillingHistory[] = [
    {
      id: '1',
      date: new Date('2024-01-15'),
      amount: 19,
      status: 'paid',
      description: 'Starter Plan - January 2024',
      invoiceUrl: '#'
    },
    {
      id: '2',
      date: new Date('2023-12-15'),
      amount: 19,
      status: 'paid',
      description: 'Starter Plan - December 2023',
      invoiceUrl: '#'
    },
    {
      id: '3',
      date: new Date('2023-11-15'),
      amount: 19,
      status: 'paid',
      description: 'Starter Plan - November 2023',
      invoiceUrl: '#'
    }
  ]

  const getUsagePercentage = (current: number, total: number) => {
    return (current / total) * 100
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const currentPlanData = subscriptionPlans.find(plan => plan.id === currentPlan)
  const selectedPlanData = subscriptionPlans.find(plan => plan.id === selectedPlan)

  const upgradePlan = () => {
    if (selectedPlan) {
      setCurrentPlan(selectedPlan)
      setShowUpgradeDialog(false)
      setSelectedPlan('')
    }
  }

  return {
    currentPlan,
    selectedPlan,
    showUpgradeDialog,
    subscriptionPlans,
    usageStats,
    billingHistory,
    currentPlanData,
    selectedPlanData,
    setSelectedPlan,
    setShowUpgradeDialog,
    getUsagePercentage,
    formatCurrency,
    upgradePlan
  }
}