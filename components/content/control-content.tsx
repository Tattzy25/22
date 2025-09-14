"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Activity,
  Users,
  Server,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Eye,
  UserCheck,
  UserX,
  BarChart3
} from "lucide-react"

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

interface UserActivity {
  id: string
  user: string
  action: string
  timestamp: string
  status: 'success' | 'failed' | 'pending'
}

interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info'
  message: string
  timestamp: string
  resolved: boolean
}

const systemMetrics: SystemMetric[] = [
  { name: 'CPU Usage', value: 45, unit: '%', status: 'good', trend: 'stable' },
  { name: 'Memory Usage', value: 67, unit: '%', status: 'warning', trend: 'up' },
  { name: 'Disk Usage', value: 23, unit: '%', status: 'good', trend: 'down' },
  { name: 'Network I/O', value: 12, unit: 'MB/s', status: 'good', trend: 'stable' },
  { name: 'Active Users', value: 1247, unit: '', status: 'good', trend: 'up' },
  { name: 'API Requests', value: 8920, unit: '/min', status: 'good', trend: 'up' }
]

const recentActivity: UserActivity[] = [
  { id: '1', user: 'john.doe@example.com', action: 'Created new automation flow', timestamp: '2 minutes ago', status: 'success' },
  { id: '2', user: 'jane.smith@example.com', action: 'Updated API settings', timestamp: '5 minutes ago', status: 'success' },
  { id: '3', user: 'admin@bridgit.ai', action: 'System backup completed', timestamp: '10 minutes ago', status: 'success' },
  { id: '4', user: 'mike.wilson@example.com', action: 'Failed login attempt', timestamp: '15 minutes ago', status: 'failed' },
  { id: '5', user: 'sarah.jones@example.com', action: 'Generated AI content', timestamp: '20 minutes ago', status: 'success' }
]

const systemAlerts: SystemAlert[] = [
  { id: '1', type: 'warning', message: 'High memory usage detected', timestamp: '5 minutes ago', resolved: false },
  { id: '2', type: 'info', message: 'Scheduled maintenance completed', timestamp: '1 hour ago', resolved: true },
  { id: '3', type: 'error', message: 'API rate limit exceeded', timestamp: '2 hours ago', resolved: true },
  { id: '4', type: 'warning', message: 'Disk space running low', timestamp: '3 hours ago', resolved: false }
]

export function ControlContent() {
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedTab, setSelectedTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <XCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />
      case 'down': return <TrendingDown className="h-3 w-3" />
      default: return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Control Panel</h2>
          <p className="text-muted-foreground">
            System administration and analytics dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {systemMetrics.map(metric => (
              <Card key={metric.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  <div className={`flex items-center gap-1 ${getStatusColor(metric.status)}`}>
                    {getStatusIcon(metric.status)}
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.value}{metric.unit}
                  </div>
                  <Progress
                    value={metric.unit === '%' ? metric.value : 0}
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest user actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Alerts</CardTitle>
                <CardDescription>Important system notifications and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {systemAlerts.map(alert => (
                      <div key={alert.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.type === 'error' ? 'bg-red-500' :
                          alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={alert.resolved ? 'secondary' : 'destructive'} className="text-xs">
                              {alert.resolved ? 'Resolved' : alert.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Server Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Server Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="bg-yellow-100" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} />
                </div>
              </CardContent>
            </Card>

            {/* Network Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Network Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      <Upload className="h-6 w-6 mx-auto mb-1" />
                      2.4 GB
                    </div>
                    <div className="text-xs text-muted-foreground">Upload</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      <Download className="h-6 w-6 mx-auto mb-1" />
                      8.7 GB
                    </div>
                    <div className="text-xs text-muted-foreground">Download</div>
                  </div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-lg font-semibold">99.9%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Services</CardTitle>
              <CardDescription>Status of critical system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: 'API Gateway', status: 'running', uptime: '99.9%' },
                  { name: 'Database', status: 'running', uptime: '99.8%' },
                  { name: 'AI Engine', status: 'running', uptime: '99.7%' },
                  { name: 'File Storage', status: 'running', uptime: '99.9%' }
                ].map(service => (
                  <div key={service.name} className="flex items-center gap-3 p-3 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">{service.name}</div>
                      <div className="text-xs text-muted-foreground">{service.uptime} uptime</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* User Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Total Users</span>
                  </div>
                  <span className="font-bold">12,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Active Users</span>
                  </div>
                  <span className="font-bold">8,432</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Inactive Users</span>
                  </div>
                  <span className="font-bold">4,415</span>
                </div>
              </CardContent>
            </Card>

            {/* User Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View All Users
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Permissions
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  User Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Registrations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {[
                      { email: 'new.user1@example.com', time: '2 hours ago' },
                      { email: 'new.user2@example.com', time: '4 hours ago' },
                      { email: 'new.user3@example.com', time: '6 hours ago' },
                      { email: 'new.user4@example.com', time: '8 hours ago' }
                    ].map((user, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{user.email}</div>
                          <div className="text-xs text-muted-foreground">{user.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Usage Analytics
                </CardTitle>
                <CardDescription>Platform usage statistics and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Generations</span>
                    <span>45,231</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Calls</span>
                    <span>128,947</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Workflows</span>
                    <span>1,247</span>
                  </div>
                  <Progress value={78} />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>System performance and response times</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0.23s</div>
                    <div className="text-xs text-muted-foreground">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">99.7%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span className="text-red-600">0.3%</span>
                  </div>
                  <Progress value={3} className="bg-red-100" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Features Used</CardTitle>
              <CardDescription>Most popular platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { feature: 'AI Chat Generation', usage: 89, users: '8,432' },
                  { feature: 'Image Generation', usage: 76, users: '6,543' },
                  { feature: 'Automation Builder', usage: 65, users: '5,231' },
                  { feature: 'Code Generation', usage: 54, users: '4,321' },
                  { feature: 'Data Analysis', usage: 43, users: '3,456' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.feature}</div>
                      <div className="text-sm text-muted-foreground">{item.users} users</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.usage}%</div>
                      <Progress value={item.usage} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}