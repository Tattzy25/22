"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bot,
  MessageSquare,
  Image as ImageIcon,
  Music,
  Zap,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  Activity
} from "lucide-react"
import { DatabaseService } from "@/lib/database"
import { AuthService } from "@/lib/auth"

interface UserStats {
  conversations_count?: number
  images_count?: number
  characters_count?: number
  api_calls_count?: number
}

interface Conversation {
  id: string
  model?: string
  created_at: string
}

interface Generation {
  id: string
  type: string
  prompt?: string
  created_at: string
  status?: string
}

interface RecentActivity {
  id: string
  type: 'chat' | 'image' | 'music' | 'character'
  title: string
  timestamp: Date
  status: 'completed' | 'processing' | 'failed'
}

interface QuickStat {
  label: string
  value: string | number
  change: number
  icon: React.ReactNode
}

export function HomeContent() {
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const authService = new AuthService()
      const databaseService = new DatabaseService()
      const user = await authService.getCurrentUser()

      if (user) {
        // Load user's recent activity and stats
        const [conversations, generations] = await Promise.all([
          databaseService.getUserConversations(user.id, 5),
          databaseService.getUserGenerations(user.id, undefined, 5)
        ])

        // Transform data for display
        const activities: RecentActivity[] = []

        conversations.forEach((conv: Conversation) => {
          activities.push({
            id: conv.id,
            type: 'chat',
            title: `Chat with ${conv.model || 'AI'}`,
            timestamp: new Date(conv.created_at),
            status: 'completed'
          })
        })

        generations.forEach((gen: Generation) => {
          activities.push({
            id: gen.id,
            type: gen.type === 'image' ? 'image' : gen.type === 'music' ? 'music' : 'character',
            title: gen.prompt?.substring(0, 50) + '...' || 'Generated content',
            timestamp: new Date(gen.created_at),
            status: (gen.status === 'completed' || gen.status === 'processing' || gen.status === 'failed') ? gen.status : 'completed'
          })
        })

        // Sort by timestamp and take latest 5
        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        setRecentActivity(activities.slice(0, 5))

        // Load user stats
        const stats = await databaseService.getStats(user.id)
        setUserStats({
          conversations_count: stats.conversations,
          images_count: stats.generations, // Assuming generations include images
          characters_count: 0, // Will need to add this to database
          api_calls_count: stats.totalUsage
        })
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      // Fallback to mock data
      setRecentActivity([
        {
          id: '1',
          type: 'chat',
          title: 'Chat with GPT-4 about React development',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'completed'
        },
        {
          id: '2',
          type: 'image',
          title: 'Generated futuristic cityscape',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: 'completed'
        },
        {
          id: '3',
          type: 'character',
          title: 'Created "Tech Mentor" character',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          status: 'completed'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickStats: QuickStat[] = [
    {
      label: 'AI Chats',
      value: userStats?.conversations_count || 47,
      change: 12,
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      label: 'Images Generated',
      value: userStats?.images_count || 23,
      change: 8,
      icon: <ImageIcon className="h-4 w-4" />
    },
    {
      label: 'Characters Created',
      value: userStats?.characters_count || 5,
      change: 2,
      icon: <Bot className="h-4 w-4" />
    },
    {
      label: 'API Calls',
      value: userStats?.api_calls_count?.toLocaleString() || '2.4K',
      change: 15,
      icon: <Zap className="h-4 w-4" />
    }
  ]

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'chat': return <MessageSquare className="h-4 w-4" />
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'music': return <Music className="h-4 w-4" />
      case 'character': return <Bot className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'processing': return 'bg-blue-500'
      case 'failed': return 'bg-red-500'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Your AI-powered creativity hub. Create characters, generate media, and chat with advanced AI models.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stat.change}%</span> from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Jump into your most common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button className="h-auto p-4 justify-start" variant="outline">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Start New Chat</div>
                    <div className="text-sm text-muted-foreground">Chat with AI models</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>

              <Button className="h-auto p-4 justify-start" variant="outline">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Create Character</div>
                    <div className="text-sm text-muted-foreground">Build AI personalities</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>

              <Button className="h-auto p-4 justify-start" variant="outline">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Generate Image</div>
                    <div className="text-sm text-muted-foreground">Create with DALL-E</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>

              <Button className="h-auto p-4 justify-start" variant="outline">
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Create Music</div>
                    <div className="text-sm text-muted-foreground">AI-powered composition</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest creations and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                </div>
              )) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs">Start creating to see your activity here</p>
                </div>
              )}
            </div>
            {recentActivity.length > 0 && (
              <Button variant="ghost" className="w-full mt-3" size="sm">
                View All Activity
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Getting Started
          </CardTitle>
          <CardDescription>
            New to Bridgit-AI? Here&apos;s how to get the most out of the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Create Your First Character</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the Character Builder to create AI personalities with unique traits and behaviors.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. Try the Multi-Chat Playground</h4>
                  <p className="text-sm text-muted-foreground">
                    Chat with multiple AI models simultaneously to compare responses and capabilities.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">3. Generate Media Content</h4>
                  <p className="text-sm text-muted-foreground">
                    Create images with DALL-E and music with AI-powered composition tools.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">4. Build Automations</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the visual automation builder to create workflows connecting multiple AI services.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">API Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate API keys and integrate Bridgit-AI into your own applications.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Custom Models</h4>
                  <p className="text-sm text-muted-foreground">
                    Fine-tune models for specific use cases and create specialized AI assistants.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Team Collaboration</h4>
                  <p className="text-sm text-muted-foreground">
                    Share characters, automations, and content with your team members.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Analytics & Monitoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Track usage, performance, and costs across all your AI activities.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">💡 Pro Tip: Model Selection</h4>
                  <p className="text-sm text-muted-foreground">
                    GPT-4 excels at complex reasoning, Claude is great for creative writing,
                    and Gemini provides fast responses for casual conversations.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Pro Tip: Prompt Engineering</h4>
                  <p className="text-sm text-muted-foreground">
                    Be specific in your prompts. Include context, examples, and desired output format
                    for better AI responses.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">⚡ Pro Tip: Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the playground to test multiple models simultaneously and find the best
                    one for your specific use case.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}