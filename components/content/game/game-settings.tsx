"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GameConfig } from "./types"

interface GameSettingsProps {
  gameConfig: GameConfig
  onConfigUpdate: (updates: Partial<GameConfig>) => void
}

export function GameSettings({ gameConfig, onConfigUpdate }: GameSettingsProps) {
  const updateGlobalSettings = (updates: Partial<GameConfig['globalSettings']>) => {
    onConfigUpdate({
      globalSettings: { ...gameConfig.globalSettings, ...updates }
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Game Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="game-title">Game Title</Label>
            <Input
              id="game-title"
              value={gameConfig.title}
              onChange={(e) => onConfigUpdate({ title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="game-description">Description</Label>
            <Textarea
              id="game-description"
              value={gameConfig.description}
              onChange={(e) => onConfigUpdate({ description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={gameConfig.difficulty}
              onValueChange={(value) => onConfigUpdate({ difficulty: value as GameConfig['difficulty'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-score">Maximum Score</Label>
            <Input
              id="max-score"
              type="number"
              value={gameConfig.maxScore}
              onChange={(e) => onConfigUpdate({ maxScore: parseInt(e.target.value) || 100 })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={gameConfig.globalSettings.theme}
              onValueChange={(value) => updateGlobalSettings({ theme: value as GameConfig['globalSettings']['theme'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="colorful">Colorful</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={gameConfig.globalSettings.soundEnabled}
                onChange={(e) => updateGlobalSettings({ soundEnabled: e.target.checked })}
                aria-label="Enable sound effects"
              />
              <span className="text-sm">Enable Sound Effects</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={gameConfig.globalSettings.vibrationEnabled}
                onChange={(e) => updateGlobalSettings({ vibrationEnabled: e.target.checked })}
                aria-label="Enable vibration"
              />
              <span className="text-sm">Enable Vibration</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={gameConfig.globalSettings.autoSave}
                onChange={(e) => updateGlobalSettings({ autoSave: e.target.checked })}
                aria-label="Auto-save progress"
              />
              <span className="text-sm">Auto-save Progress</span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}