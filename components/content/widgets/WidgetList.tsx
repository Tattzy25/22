"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BarChart3, Code, ExternalLink, MessageSquare, Monitor, Trash2, Zap, Bot, Edit } from "lucide-react"
import type { Widget } from "./types"

type Props = {
  widgets: Widget[]
  onEdit: (widget: Widget) => void
  onAnalytics: (widgetId: string) => void
  onDelete: (widgetId: string) => void
}

export function WidgetList({ widgets, onEdit, onAnalytics, onDelete }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {widgets.map((widget) => (
        <Card key={widget.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  widget.type === 'chat' ? 'bg-blue-500' :
                  widget.type === 'form' ? 'bg-green-500' :
                  widget.type === 'button' ? 'bg-orange-500' :
                  widget.type === 'embed' ? 'bg-purple-500' :
                  widget.type === 'popup' ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  {widget.type === 'chat' && <MessageSquare className="h-5 w-5 text-white" />}
                  {widget.type === 'form' && <Bot className="h-5 w-5 text-white" />}
                  {widget.type === 'button' && <Zap className="h-5 w-5 text-white" />}
                  {widget.type === 'embed' && <Code className="h-5 w-5 text-white" />}
                  {widget.type === 'popup' && <ExternalLink className="h-5 w-5 text-white" />}
                  {widget.type === 'sidebar' && <Monitor className="h-5 w-5 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold">{widget.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{widget.type} Widget</p>
                </div>
              </div>
              <Badge variant={widget.status === 'published' ? 'default' : 'secondary'}>
                {widget.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Views</span>
                <span className="font-medium">{widget.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interactions</span>
                <span className="font-medium">{widget.interactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Modified</span>
                <span className="font-medium">{new Date(widget.lastModified).toLocaleDateString()}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(widget)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => onAnalytics(widget.id)}>
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </Button>
              <Button size="sm" variant="outline" onClick={() => onDelete(widget.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

