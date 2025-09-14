"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, Copy, Gamepad2 } from "lucide-react"
import { GameConfig, GameScene, elementTypes } from "./types"

interface GameBuilderProps {
  gameConfig: GameConfig
  selectedScene: GameScene | null
  onSceneSelect: (scene: GameScene | null) => void
  onAddElement: (elementType: string) => void
  onDeleteElement: (elementId: string) => void
  canvasRef: React.RefObject<HTMLDivElement>
}

export function GameBuilder({
  gameConfig,
  selectedScene,
  onSceneSelect,
  onAddElement,
  onDeleteElement,
  canvasRef
}: GameBuilderProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Element Toolbox */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Elements
          </CardTitle>
          <CardDescription>
            Drag elements to build your game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {elementTypes.map(element => (
                <div
                  key={element.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onAddElement(element.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{element.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{element.name}</div>
                      <div className="text-xs text-muted-foreground">{element.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Game Canvas */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Game Canvas</CardTitle>
            <Select
              value={selectedScene?.id || ''}
              onValueChange={(sceneId) => {
                const scene = gameConfig.scenes.find(s => s.id === sceneId)
                onSceneSelect(scene || null)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select scene" />
              </SelectTrigger>
              <SelectContent>
                {gameConfig.scenes.map(scene => (
                  <SelectItem key={scene.id} value={scene.id}>
                    {scene.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={canvasRef}
            className="relative w-full h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/20"
            style={{
              backgroundColor: selectedScene?.background || '#ffffff'
            }}
          >
            {selectedScene?.elements.map(element => (
              <div
                key={element.id}
                className="absolute p-2 bg-background border rounded shadow-sm cursor-move select-none hover:shadow-md transition-shadow min-w-20"
                style={{
                  left: element.position.x,
                  top: element.position.y
                }}
                onClick={() => {/* Handle element selection */}}
              >
                <div className="text-xs font-medium mb-1">{element.type}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {element.content}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteElement(element.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {(!selectedScene || selectedScene.elements.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Gamepad2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a scene and add elements to start building</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Element Properties */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <CardDescription>
            Configure selected element
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              <div>
                <Label htmlFor="element-content">Content</Label>
                <Textarea
                  id="element-content"
                  placeholder="Enter element content..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="element-x">X Position</Label>
                  <Input
                    id="element-x"
                    type="number"
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="element-y">Y Position</Label>
                  <Input
                    id="element-y"
                    type="number"
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Element Type</Label>
                <Select defaultValue="text">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {elementTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}