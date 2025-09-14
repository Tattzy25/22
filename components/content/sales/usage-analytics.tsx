"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, TrendingUp, Zap, Target, Users, AlertTriangle } from "lucide-react"

interface UsageStats {
  currentTokens: number
  totalTokens: number
  monthlyUsage: number
  apiCalls: number
  storageUsed: number
  activeProjects: number
}

interface UsageAnalyticsProps {
  usageStats: UsageStats
  getUsagePercentage: (current: number, total: number) => number
}

export function UsageAnalytics({ usageStats, getUsagePercentage }: UsageAnalyticsProps) {
  return (
    <>
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
    </>
  )
}