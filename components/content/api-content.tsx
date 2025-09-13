"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Key,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Shield,
  CreditCard,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Lock,
  Unlock,
  Zap,
  DollarSign,
  Activity,
  TrendingUp,
  Calendar,
  Clock
} from "lucide-react"

interface APIKey {
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

interface BillingInfo {
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

const aiProviders = [
  { id: 'openai', name: 'OpenAI', icon: '🤖', models: ['GPT-4', 'GPT-3.5', 'DALL-E'] },
  { id: 'anthropic', name: 'Anthropic', icon: '🧠', models: ['Claude-3', 'Claude-2'] },
  { id: 'google', name: 'Google AI', icon: '🔍', models: ['Gemini Pro', 'Gemini Ultra'] },
  { id: 'cohere', name: 'Cohere', icon: '💭', models: ['Command', 'Base'] },
  { id: 'stability', name: 'Stability AI', icon: '🎨', models: ['Stable Diffusion'] },
  { id: 'replicate', name: 'Replicate', icon: '🔄', models: ['Various'] }
]

const billingPlans = [
  { id: 'free', name: 'Free', price: 0, limits: { requests: 1000, tokens: 10000, budget: 0 } },
  { id: 'starter', name: 'Starter', price: 19, limits: { requests: 10000, tokens: 100000, budget: 10 } },
  { id: 'pro', name: 'Professional', price: 99, limits: { requests: 100000, tokens: 1000000, budget: 50 } },
  { id: 'enterprise', name: 'Enterprise', price: 299, limits: { requests: 1000000, tokens: 10000000, budget: 200 } }
]

export function ApiContent() {
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

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    plan: 'pro',
    status: 'active',
    currentUsage: { requests: 2450, tokens: 125000, cost: 12.50 },
    limits: { monthlyRequests: 100000, monthlyTokens: 1000000, monthlyBudget: 50 },
    nextBillingDate: new Date('2024-02-01'),
    paymentMethod: { type: 'card', last4: '4242' }
  })

  const [activeTab, setActiveTab] = useState('keys')
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [newKey, setNewKey] = useState({
    provider: '',
    name: '',
    key: '',
    monthlyRequests: 1000,
    monthlyTokens: 10000,
    monthlyBudget: 5
  })
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const addApiKey = () => {
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
    setNewKey({
      provider: '',
      name: '',
      key: '',
      monthlyRequests: 1000,
      monthlyTokens: 10000,
      monthlyBudget: 5
    })
    setShowKeyDialog(false)
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getProviderInfo = (providerId: string) => {
    return aiProviders.find(p => p.id === providerId)
  }

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Management</h2>
          <p className="text-muted-foreground">
            Manage API keys, monitor usage, and control billing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {apiKeys.filter(k => k.isActive).length} Active Keys
          </Badge>
          <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New API Key</DialogTitle>
                <DialogDescription>
                  Add an API key for a new AI provider
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select value={newKey.provider} onValueChange={(value) => setNewKey(prev => ({ ...prev, provider: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiProviders.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex items-center gap-2">
                            <span>{provider.icon}</span>
                            {provider.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    value={newKey.name}
                    onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., OpenAI Production"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={newKey.key}
                    onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="Enter your API key"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthly-requests">Monthly Requests</Label>
                    <Input
                      id="monthly-requests"
                      type="number"
                      value={newKey.monthlyRequests}
                      onChange={(e) => setNewKey(prev => ({ ...prev, monthlyRequests: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-tokens">Monthly Tokens</Label>
                    <Input
                      id="monthly-tokens"
                      type="number"
                      value={newKey.monthlyTokens}
                      onChange={(e) => setNewKey(prev => ({ ...prev, monthlyTokens: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-budget">Monthly Budget ($)</Label>
                    <Input
                      id="monthly-budget"
                      type="number"
                      value={newKey.monthlyBudget}
                      onChange={(e) => setNewKey(prev => ({ ...prev, monthlyBudget: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={addApiKey} disabled={!newKey.provider || !newKey.name || !newKey.key}>
                    Add Key
                  </Button>
                  <Button variant="outline" onClick={() => setShowKeyDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6 mt-6">
          <div className="grid gap-4">
            {apiKeys.map(key => {
              const provider = getProviderInfo(key.provider)
              return (
                <Card key={key.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{provider?.icon}</div>
                        <div>
                          <h3 className="font-semibold text-lg">{key.name}</h3>
                          <p className="text-muted-foreground">{provider?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={key.isActive ? 'default' : 'secondary'}>
                          {key.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={key.isActive}
                          onCheckedChange={() => toggleKeyStatus(key.id)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">API Key</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {visibleKeys.has(key.id) ? key.key : key.maskedKey}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">Created</Label>
                        <p className="text-sm mt-1">{key.createdAt.toLocaleDateString()}</p>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">Last Used</Label>
                        <p className="text-sm mt-1">
                          {key.lastUsed ? key.lastUsed.toLocaleDateString() : 'Never'}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">Usage</Label>
                        <p className="text-sm mt-1">
                          {key.usage.requests.toLocaleString()} requests
                        </p>
                      </div>
                    </div>

                    <Separator className="mb-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span>Requests: {key.usage.requests}/{key.limits.monthlyRequests}</span>
                        <span>Tokens: {key.usage.tokens.toLocaleString()}/{key.limits.monthlyTokens.toLocaleString()}</span>
                        <span>Cost: ${key.usage.cost}/${key.limits.monthlyBudget}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteKey(key.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Requests</span>
                    <span>{billingInfo.currentUsage.requests.toLocaleString()} / {billingInfo.limits.monthlyRequests.toLocaleString()}</span>
                  </div>
                  <Progress value={getUsagePercentage(billingInfo.currentUsage.requests, billingInfo.limits.monthlyRequests)} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Tokens</span>
                    <span>{billingInfo.currentUsage.tokens.toLocaleString()} / {billingInfo.limits.monthlyTokens.toLocaleString()}</span>
                  </div>
                  <Progress value={getUsagePercentage(billingInfo.currentUsage.tokens, billingInfo.limits.monthlyTokens)} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Budget</span>
                    <span>${billingInfo.currentUsage.cost} / ${billingInfo.limits.monthlyBudget}</span>
                  </div>
                  <Progress value={getUsagePercentage(billingInfo.currentUsage.cost, billingInfo.limits.monthlyBudget)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {[
                      { action: 'API call to OpenAI GPT-4', cost: 0.02, time: '2 minutes ago' },
                      { action: 'Image generation with DALL-E', cost: 0.08, time: '15 minutes ago' },
                      { action: 'Claude-3 API request', cost: 0.01, time: '1 hour ago' },
                      { action: 'Bulk token usage', cost: 1.50, time: '3 hours ago' },
                      { action: 'Music generation', cost: 0.50, time: '5 hours ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant="outline">${activity.cost}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {billingPlans.find(p => p.id === billingInfo.plan)?.name}
                    </h3>
                    <p className="text-muted-foreground">
                      ${billingPlans.find(p => p.id === billingInfo.plan)?.price}/month
                    </p>
                  </div>
                  <Badge variant={billingInfo.status === 'active' ? 'default' : 'destructive'}>
                    {billingInfo.status}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monthly Requests</span>
                    <span>{billingInfo.limits.monthlyRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Tokens</span>
                    <span>{billingInfo.limits.monthlyTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Budget</span>
                    <span>${billingInfo.limits.monthlyBudget}</span>
                  </div>
                </div>

                <Button className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Billing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>•••• •••• •••• {billingInfo.paymentMethod.last4}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Next Billing Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{billingInfo.nextBillingDate.toLocaleDateString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current Month Cost</span>
                    <span>${billingInfo.currentUsage.cost}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Estimated Total</span>
                    <span>${billingPlans.find(p => p.id === billingInfo.plan)?.price}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Update Payment
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <div className="grid gap-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your API keys are encrypted and stored securely. We recommend rotating keys regularly and using separate keys for different environments.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Key Rotation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Automatically rotate API keys to maintain security
                  </p>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Rotate All Keys
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Get notified of suspicious API usage
                  </p>
                  <Switch defaultChecked />
                  <Label className="ml-2">Enable alerts</Label>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Key Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map(key => (
                    <div key={key.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">{key.name}</h4>
                        <p className="text-sm text-muted-foreground">{key.provider}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {key.permissions.map(permission => (
                          <Badge key={permission} variant="outline">
                            {permission}
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}