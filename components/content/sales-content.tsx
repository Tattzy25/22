"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Crown,
  Zap,
  TrendingUp,
  DollarSign,
  Calendar,
  Check,
  X,
  Star,
  Users,
  BarChart3,
  Receipt,
  Settings,
  AlertTriangle,
  Gift,
  Shield,
  Rocket,
  Target,
  Clock
} from "lucide-react"

interface SubscriptionPlan {
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

interface UsageStats {
  currentTokens: number
  totalTokens: number
  monthlyUsage: number
  apiCalls: number
  storageUsed: number
  activeProjects: number
}

interface BillingHistory {
  id: string
  date: Date
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
  invoiceUrl?: string
}

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
    id: 'pro',
    name: 'Professional',
    description: 'For serious creators and teams',
    price: 99,
    interval: 'month',
    tokens: 1000000,
    features: [
      '1,000,000 AI tokens/month',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
      'Custom branding',
      'API access',
      'White-label options'
    ],
    popular: true,
    icon: Crown,
    color: 'text-purple-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 299,
    interval: 'month',
    tokens: 10000000,
    features: [
      '10,000,000 AI tokens/month',
      'Dedicated support',
      'Custom integrations',
      'Advanced security',
      'SLA guarantee',
      'On-premise deployment',
      'Custom AI models'
    ],
    icon: Rocket,
    color: 'text-green-600'
  }
]

export function SalesContent() {
  const [activeTab, setActiveTab] = useState('plans')
  const [currentPlan, setCurrentPlan] = useState('pro')
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const [usageStats] = useState<UsageStats>({
    currentTokens: 75000,
    totalTokens: 1000000,
    monthlyUsage: 250000,
    apiCalls: 15420,
    storageUsed: 2.4,
    activeProjects: 12
  })

  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: '1',
      date: new Date('2024-01-01'),
      amount: 99,
      status: 'paid',
      description: 'Professional Plan - January 2024',
      invoiceUrl: '#'
    },
    {
      id: '2',
      date: new Date('2023-12-01'),
      amount: 99,
      status: 'paid',
      description: 'Professional Plan - December 2023',
      invoiceUrl: '#'
    },
    {
      id: '3',
      date: new Date('2023-11-01'),
      amount: 99,
      status: 'paid',
      description: 'Professional Plan - November 2023',
      invoiceUrl: '#'
    }
  ])

  const currentPlanData = subscriptionPlans.find(p => p.id === currentPlan)
  const selectedPlanData = selectedPlan ? subscriptionPlans.find(p => p.id === selectedPlan) : null

  const upgradePlan = () => {
    if (selectedPlan) {
      setCurrentPlan(selectedPlan)
      setShowUpgradeDialog(false)
      setSelectedPlan(null)
      // In a real implementation, this would call an API
    }
  }

  const getUsagePercentage = (current: number, total: number) => {
    return Math.min((current / total) * 100, 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
    const Icon = plan.icon
    const isCurrentPlan = plan.id === currentPlan

    return (
      <Card className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
          </div>
        )}

        <CardHeader className="text-center">
          <div className={`mx-auto mb-2 ${plan.color}`}>
            <Icon className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-4">
            <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
            <span className="text-muted-foreground">/{plan.interval}</span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              {plan.tokens.toLocaleString()} AI tokens per month
            </div>

            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="pt-4">
              {isCurrentPlan ? (
                <Button className="w-full" disabled>
                  <Check className="h-4 w-4 mr-2" />
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedPlan(plan.id)
                    setShowUpgradeDialog(true)
                  }}
                >
                  {plan.price === 0 ? 'Get Started' : 'Upgrade'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscription & Billing</h2>
          <p className="text-muted-foreground">
            Manage your subscription, track usage, and handle billing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            {currentPlanData?.name} Plan
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {usageStats.currentTokens.toLocaleString()} tokens left
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6 mt-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Choose Your Plan</h3>
            <p className="text-muted-foreground">
              Select the perfect plan for your AI creation needs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {subscriptionPlans.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          <Alert>
            <Gift className="h-4 w-4" />
            <AlertDescription>
              <strong>Special Offer:</strong> Get 20% off your first year with annual billing.
              All plans include a 14-day free trial.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Token Usage
                </CardTitle>
                <CardDescription>
                  Your AI token consumption this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Tokens</span>
                    <span>{usageStats.currentTokens.toLocaleString()} / {usageStats.totalTokens.toLocaleString()}</span>
                  </div>
                  <Progress value={getUsagePercentage(usageStats.currentTokens, usageStats.totalTokens)} />
                  <p className="text-xs text-muted-foreground">
                    {usageStats.monthlyUsage.toLocaleString()} tokens used this month
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{usageStats.apiCalls.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">API Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{usageStats.activeProjects}</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{usageStats.storageUsed}GB</div>
                  <div className="text-sm text-muted-foreground">Storage Used</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Usage Analytics
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of your AI usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Text Generation</div>
                        <div className="text-sm text-muted-foreground">GPT models</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">45,230 tokens</div>
                      <div className="text-sm text-muted-foreground">68% of usage</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded">
                          <Target className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Image Generation</div>
                          <div className="text-sm text-muted-foreground">DALL-E, Stable Diffusion</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">18,450 tokens</div>
                        <div className="text-sm text-muted-foreground">28% of usage</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Multi-Agent</div>
                        <div className="text-sm text-muted-foreground">Collaborative workflows</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">3,200 tokens</div>
                      <div className="text-sm text-muted-foreground">4% of usage</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {getUsagePercentage(usageStats.currentTokens, usageStats.totalTokens) > 80 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You're approaching your monthly token limit. Consider upgrading your plan to avoid service interruptions.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Manage your payment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-muted-foreground">Expires 12/26</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Primary</Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Update Card
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Add Card
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Next Billing
                </CardTitle>
                <CardDescription>
                  Your upcoming subscription charges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{currentPlanData?.name} Plan</div>
                    <div className="text-sm text-muted-foreground">
                      Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(currentPlanData?.price || 0)}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(currentPlanData?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatCurrency((currentPlanData?.price || 0) * 0.08)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency((currentPlanData?.price || 0) * 1.08)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {billingHistory.map(invoice => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded ${
                          invoice.status === 'paid' ? 'bg-green-100' :
                          invoice.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {invoice.status === 'paid' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : invoice.status === 'pending' ? (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{invoice.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {invoice.date.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                          <Badge variant={
                            invoice.status === 'paid' ? 'default' :
                            invoice.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {invoice.status}
                          </Badge>
                        </div>
                        {invoice.invoiceUrl && (
                          <Button variant="outline" size="sm">
                            <Receipt className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Subscription Settings
                </CardTitle>
                <CardDescription>
                  Manage your subscription preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Billing Cycle</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly (Save 20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Usage Alerts</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Email when 80% of tokens used</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Email when 90% of tokens used</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Email billing receipts</span>
                    </label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Download Data
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Referral Program
                </CardTitle>
                <CardDescription>
                  Earn free months by referring friends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">2</div>
                  <div className="text-sm text-muted-foreground">Friends referred</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">$38</div>
                  <div className="text-sm text-muted-foreground">Credits earned</div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Referral Link</Label>
                  <div className="flex gap-2">
                    <Input value="https://bridgit.ai/ref/john-doe-123" readOnly />
                    <Button variant="outline">
                      Copy
                    </Button>
                  </div>
                </div>

                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Friends
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              {selectedPlanData && (
                <>Upgrade to the {selectedPlanData.name} plan for {formatCurrency(selectedPlanData.price)}/{selectedPlanData.interval}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPlanData && (
              <div className="p-4 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{selectedPlanData.name} Plan</h4>
                  <span className="text-lg font-bold">{formatCurrency(selectedPlanData.price)}/{selectedPlanData.interval}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedPlanData.tokens.toLocaleString()} AI tokens per month
                </p>
                <ul className="space-y-1">
                  {selectedPlanData.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={upgradePlan} className="flex-1">
                Confirm Upgrade
              </Button>
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}