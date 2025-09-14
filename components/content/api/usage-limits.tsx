"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Activity } from "lucide-react"
import { BillingInfo } from "./types"

interface UsageLimitsProps {
  billingInfo: BillingInfo
  getUsagePercentage: (current: number, limit: number) => number
}

export function UsageLimits({ billingInfo, getUsagePercentage }: UsageLimitsProps) {
  return (
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
  )
}