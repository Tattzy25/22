"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { GameTemplate, gameTemplates } from "./types"

interface GameTemplatesProps {
  onCreateGame: (template: GameTemplate) => void
}

export function GameTemplates({ onCreateGame }: GameTemplatesProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {gameTemplates.map(template => {
        // For now, we'll use a simple icon representation since we can't import the actual icons
        const getIcon = (iconName: string) => {
          const iconMap: Record<string, string> = {
            'Target': '🎯',
            'Puzzle': '🧩',
            'Gamepad2': '🎮',
            'Zap': '⚡',
            'Trophy': '🏆'
          }
          return iconMap[iconName] || '🎮'
        }

        return (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{getIcon(template.icon)}</span>
                <Badge variant={
                  template.difficulty === 'easy' ? 'secondary' :
                  template.difficulty === 'medium' ? 'default' : 'destructive'
                }>
                  {template.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{template.category}</span>
                  <span>•</span>
                  <span>{template.estimatedTime}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 3).map(feature => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={() => onCreateGame(template)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Game
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}