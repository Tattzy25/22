"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Gamepad2 } from "lucide-react"
import { GameConfig, GameScene } from "./types"

interface GameScenesProps {
  gameConfig: GameConfig
  selectedScene: GameScene | null
  onSceneSelect: (scene: GameScene) => void
  onAddScene: () => void
}

export function GameScenes({
  gameConfig,
  selectedScene,
  onSceneSelect,
  onAddScene
}: GameScenesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Game Scenes</h3>
        <Button onClick={onAddScene}>
          <Plus className="h-4 w-4 mr-2" />
          Add Scene
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gameConfig.scenes.map(scene => (
          <Card
            key={scene.id}
            className={`cursor-pointer transition-colors ${
              selectedScene?.id === scene.id ? 'ring-2 ring-primary' : 'hover:bg-accent'
            }`}
            onClick={() => onSceneSelect(scene)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{scene.name}</h4>
                <Badge variant="secondary">
                  {scene.elements.length} elements
                </Badge>
              </div>
              <div
                className="w-full h-24 border rounded bg-muted/20 flex items-center justify-center"
                style={{ backgroundColor: scene.background }}
              >
                <Gamepad2 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}