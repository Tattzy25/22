"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Key,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  AlertTriangle,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Zap,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Download
} from "lucide-react"

interface APIKey {
  id: string
  name: string
  key: string
  provider: 'openai' | 'anthropic' | 'google' | 'cohere' | 'bridgit'
  status: 'active' | 'inactive' | 'expired' | 'revoked'
  createdAt: Date
  lastUsed?: Date
  usage: {
    requests: number
    tokens: number
    cost: number
  }
  limits: {
    requestsPerDay: number
    tokensPerMonth: number
    costPerMonth: number
  }
  permissions: string[]
}

interface BillingInfo {
  currentPlan: string
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate: Date
  currentUsage: {
    requests: number
    tokens: number
    cost: number
  }
  limits: {
    requests: number
    tokens: number
    cost: number
  }
  paymentMethod: {
    type: 'card' | 'paypal' | 'bank'
    last4: string
    expiryMonth: number
    expiryYear: number
  }
  invoices: Array<{
    id: string
    date: Date
    amount: number
    status: 'paid' | 'pending' | 'failed'
    downloadUrl: string
  }>
}

interface UsageAnalytics {
  period: '7d' | '30d' | '90d'
  totalRequests: number
  totalTokens: number
  totalCost: number
  dailyUsage: Array<{
    date: string
    requests: number
    tokens: number
    cost: number
  }>
  topEndpoints: Array<{
    endpoint: string
    requests: number
    avgResponseTime: number
  }>
  errorRate: number
  avgResponseTime: number
}

export function APIManagerContent() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'OpenAI Production',
      key: 'sk-proj-...abcd',
      provider: 'openai',
      status: 'active',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
      usage: {
        requests: 15420,
        tokens: 2847391,
        cost: 142.37
      },
      limits: {
        requestsPerDay: 10000,
        tokensPerMonth: 2000000,
        costPerMonth: 200
      },
      permissions: ['chat', 'completions', 'embeddings']
    },
    {
      id: '2',
      name: 'Anthropic Claude',
      key: 'sk-ant-...efgh',
      provider: 'anthropic',
      status: 'active',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 6),
      usage: {
        requests: 8750,
        tokens: 1928473,
        cost: 96.42
      },
      limits: {
        requestsPerDay: 5000,
        tokensPerMonth: 1500000,
        costPerMonth: 150
      },
      permissions: ['chat', 'completions']
    }
  ])

  const [billingInfo] = useState<BillingInfo>({
    currentPlan: 'Pro',
    billingCycle: 'monthly',
    nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    currentUsage: {
      requests: 24170,
      tokens: 4775864,
      cost: 238.79
    },
    limits: {
      requests: 50000,
      tokens: 5000000,
      cost: 500
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025
    },
    invoices: [
      {
        id: 'inv-001',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        amount: 49.99,
        status: 'paid',
        downloadUrl: '#'
      },
      {
        id: 'inv-002',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
        amount: 49.99,
        status: 'paid',
        downloadUrl: '#'
      }
    ]
  })

  const [analytics, setAnalytics] = useState<UsageAnalytics>({
    period: '30d',
    totalRequests: 24170,
    totalTokens: 4775864,
    totalCost: 238.79,
    dailyUsage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (29 - i)).toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 1000) + 500,
      tokens: Math.floor(Math.random() * 200000) + 100000,
      cost: Math.random() * 10 + 5
    })),
    topEndpoints: [
      { endpoint: '/api/chat', requests: 15240, avgResponseTime: 1.2 },
      { endpoint: '/api/generate/image', requests: 4560, avgResponseTime: 3.8 },
      { endpoint: '/api/generate/music', requests: 2340, avgResponseTime: 2.1 },
      { endpoint: '/api/models', requests: 2030, avgResponseTime: 0.8 }
    ],
    errorRate: 0.023,
    avgResponseTime: 1.8
  })

  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null)
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [showKeyValue, setShowKeyValue] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState('keys')

  const providers = [
    { id: 'openai', name: 'OpenAI', color: 'bg-blue-500' },
    { id: 'anthropic', name: 'Anthropic', color: 'bg-orange-500' },
    { id: 'google', name: 'Google AI', color: 'bg-green-500' },
    { id: 'cohere', name: 'Cohere', color: 'bg-purple-500' },
    { id: 'bridgit', name: 'Bridgit AI', color: 'bg-pink-500' }
  ]

  const getStatusColor = (status: APIKey['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'expired': return 'bg-red-500'
      case 'revoked': return 'bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeyValue(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const createNewKey = () => {
    setSelectedKey(null)
    setIsCreatingKey(true)
  }

  const saveKey = (keyData: Partial<APIKey>) => {
    if (selectedKey) {
      // Update existing key
      setApiKeys(prev => prev.map(k =>
        k.id === selectedKey.id ? { ...k, ...keyData } : k
      ))
    } else {
      // Create new key
      const newKey: APIKey = {
        id: `key-${Date.now()}`,
        name: keyData.name || 'New API Key',
        key: `sk-${keyData.provider}-${Math.random().toString(36).substring(2, 15)}`,
        provider: keyData.provider || 'openai',
        status: 'active',
        createdAt: new Date(),
        usage: { requests: 0, tokens: 0, cost: 0 },
        limits: {
          requestsPerDay: 1000,
          tokensPerMonth: 100000,
          costPerMonth: 10
        },
        permissions: ['chat']
      }
      setApiKeys(prev => [...prev, newKey])
    }
    setIsCreatingKey(false)
  }

  const deleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== keyId))
  }

  const regenerateKey = (keyId: string) => {
    setApiKeys(prev => prev.map(k =>
      k.id === keyId
        ? { ...k, key: `sk-${k.provider}-${Math.random().toString(36).substring(2, 15)}` }
        : k
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Manager</h2>
          <p className="text-muted-foreground">
            Manage your API keys, monitor usage, and track billing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={createNewKey}>
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total Requests</span>
            </div>
            <div className="text-2xl font-bold">{billingInfo.currentUsage.requests.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              of {billingInfo.limits.requests.toLocaleString()} limit
            </div>
            <Progress
              value={getUsagePercentage(billingInfo.currentUsage.requests, billingInfo.limits.requests)}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Tokens Used</span>
            </div>
            <div className="text-2xl font-bold">{billingInfo.currentUsage.tokens.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              of {billingInfo.limits.tokens.toLocaleString()} limit
            </div>
            <Progress
              value={getUsagePercentage(billingInfo.currentUsage.tokens, billingInfo.limits.tokens)}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Current Cost</span>
            </div>
            <div className="text-2xl font-bold">${billingInfo.currentUsage.cost.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              of ${billingInfo.limits.cost.toFixed(2)} limit
            </div>
            <Progress
              value={getUsagePercentage(billingInfo.currentUsage.cost, billingInfo.limits.cost)}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Next Billing</span>
            </div>
            <div className="text-2xl font-bold">
              {billingInfo.nextBillingDate.toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {billingInfo.currentPlan} plan
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for different providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          <span className="font-medium">{key.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${providers.find(p => p.id === key.provider)?.color}`} />
                          {providers.find(p => p.id === key.provider)?.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getStatusColor(key.status)} text-white`}>
                          {key.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{key.usage.requests.toLocaleString()} requests</div>
                          <div className="text-muted-foreground">
                            ${key.usage.cost.toFixed(2)} spent
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {key.lastUsed ? (
                          <div className="text-sm">
                            {key.lastUsed.toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {showKeyValue[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedKey(key)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => regenerateKey(key.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteKey(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {apiKeys.length === 0 && (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No API keys yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first API key to start using AI services
                  </p>
                  <Button onClick={createNewKey}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add API Key
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{billingInfo.currentPlan}</span>
                  <Badge variant="secondary">{billingInfo.billingCycle}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Next billing date</span>
                    <span>{billingInfo.nextBillingDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment method</span>
                    <span>•••• {billingInfo.paymentMethod.last4}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Plan Limits</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Requests per month</span>
                      <span>{billingInfo.limits.requests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tokens per month</span>
                      <span>{billingInfo.limits.tokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost limit</span>
                      <span>${billingInfo.limits.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Plan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8" />
                  <div>
                    <div className="font-medium">
                      •••• •••• •••• {billingInfo.paymentMethod.last4}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires {billingInfo.paymentMethod.expiryMonth}/{billingInfo.paymentMethod.expiryYear}
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Update Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingInfo.invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date.toLocaleDateString()}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Usage Analytics</h3>
              <p className="text-muted-foreground">Monitor your API usage and performance</p>
            </div>
            <Select value={analytics.period} onValueChange={(value) => setAnalytics(prev => ({ ...prev, period: value as UsageAnalytics['period'] }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Analytics Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Total Requests</span>
                </div>
                <div className="text-2xl font-bold">{analytics.totalRequests.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Total Tokens</span>
                </div>
                <div className="text-2xl font-bold">{analytics.totalTokens.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +8.2% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">Avg Response Time</span>
                </div>
                <div className="text-2xl font-bold">{analytics.avgResponseTime}s</div>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <TrendingDown className="h-3 w-3" />
                  +0.3s from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">Error Rate</span>
                </div>
                <div className="text-2xl font-bold">{(analytics.errorRate * 100).toFixed(2)}%</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingDown className="h-3 w-3" />
                  -0.5% from last period
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Top Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topEndpoints.map((endpoint, index) => (
                  <div key={endpoint.endpoint} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{endpoint.endpoint}</div>
                        <div className="text-sm text-muted-foreground">
                          {endpoint.requests.toLocaleString()} requests
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{endpoint.avgResponseTime}s</div>
                      <div className="text-sm text-muted-foreground">avg response</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Key Dialog */}
      <Dialog open={isCreatingKey || !!selectedKey} onOpenChange={(open) => {
        if (!open) {
          setIsCreatingKey(false)
          setSelectedKey(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedKey ? 'Edit API Key' : 'Create New API Key'}
            </DialogTitle>
            <DialogDescription>
              Configure your API key settings and permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Production OpenAI Key"
                defaultValue={selectedKey?.name || ''}
              />
            </div>

            <div className="space-y-2">
              <Label>Provider</Label>
              <Select defaultValue={selectedKey?.provider || 'openai'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${provider.color}`} />
                        {provider.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2">
                {['chat', 'completions', 'embeddings', 'images', 'audio', 'moderation'].map(permission => (
                  <label key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={selectedKey?.permissions.includes(permission)}
                      aria-label={`Allow ${permission} permission`}
                    />
                    <span className="text-sm capitalize">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsCreatingKey(false)
                setSelectedKey(null)
              }}>
                Cancel
              </Button>
              <Button onClick={() => saveKey({ name: 'New Key', provider: 'openai' })}>
                {selectedKey ? 'Update Key' : 'Create Key'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}