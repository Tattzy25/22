"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Clock, Eye, Globe, Monitor, MousePointer, Smartphone } from "lucide-react"
import type { WidgetAnalytics } from "./types"

type Props = {
  analytics: WidgetAnalytics
}

export function AnalyticsView({ analytics }: Props) {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total Views</span>
            </div>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Interactions</span>
            </div>
            <div className="text-2xl font-bold">{analytics.totalInteractions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Conversion Rate</span>
            </div>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Avg. Session</span>
            </div>
            <div className="text-2xl font-bold">{Math.floor(analytics.avgSessionDuration / 60)}m {Math.floor(analytics.avgSessionDuration % 60)}s</div>
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Device Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-500" />
                <span>Mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={analytics.deviceBreakdown.mobile} className="w-24" />
                <span className="text-sm font-medium">{analytics.deviceBreakdown.mobile}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-green-500" />
                <span>Desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={analytics.deviceBreakdown.desktop} className="w-24" />
                <span className="text-sm font-medium">{analytics.deviceBreakdown.desktop}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-500" />
                <span>Tablet</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={analytics.deviceBreakdown.tablet} className="w-24" />
                <span className="text-sm font-medium">{analytics.deviceBreakdown.tablet}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="font-medium">{page.page}</span>
                </div>
                <Badge variant="secondary">{page.views} views</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

