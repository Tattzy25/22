"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Code, Save } from "lucide-react"
import { useGame } from "./game/use-game"
import { GameTemplates } from "./game/game-templates"
import { GameBuilder } from "./game/game-builder"
import { GameScenes } from "./game/game-scenes"
import { GameSettings } from "./game/game-settings"
import { GamePreview } from "./game/game-preview"
import { GameConfig, GameTemplate, GameScene } from "./game/types"

export function GameContent() {
  const [activeTab, setActiveTab] = useState('templates')
  const {
    selectedTemplate,
    gameConfig,
    setGameConfig,
    selectedScene,
    setSelectedScene,
    isPreviewOpen,
    setIsPreviewOpen,
    canvasRef,
    createNewGame,
    addElementToScene,
    deleteElement,
    addNewScene,
    saveGame,
    previewGame,
    exportGame
  } = useGame()

  const handleCreateGame = (template: GameTemplate) => {
    createNewGame(template)
    setActiveTab('builder')
  }

  const handleSceneSelect = (scene: GameScene | null) => {
    setSelectedScene(scene)
  }

  const handleConfigUpdate = (updates: Partial<GameConfig>) => {
    setGameConfig(prev => ({ ...prev, ...updates }))
  }

  const handleAddScene = () => {
    addNewScene()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mini Game Builder</h2>
          <p className="text-muted-foreground">
            Create interactive games with AI-powered content generation
          </p>
        </div>
        {gameConfig.title && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={previewGame}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={exportGame}>
              <Code className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={saveGame}>
              <Save className="h-4 w-4 mr-2" />
              Save Game
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="builder" disabled={!selectedTemplate}>Builder</TabsTrigger>
          <TabsTrigger value="scenes" disabled={!selectedTemplate}>Scenes</TabsTrigger>
          <TabsTrigger value="settings" disabled={!selectedTemplate}>Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6 mt-6">
          <GameTemplates onCreateGame={handleCreateGame} />
        </TabsContent>

        <TabsContent value="builder" className="space-y-6 mt-6">
          <GameBuilder
            gameConfig={gameConfig}
            selectedScene={selectedScene}
            onSceneSelect={handleSceneSelect}
            onAddElement={addElementToScene}
            onDeleteElement={deleteElement}
            canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
          />
        </TabsContent>

        <TabsContent value="scenes" className="space-y-6 mt-6">
          <GameScenes
            gameConfig={gameConfig}
            selectedScene={selectedScene}
            onSceneSelect={setSelectedScene}
            onAddScene={handleAddScene}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <GameSettings
            gameConfig={gameConfig}
            onConfigUpdate={handleConfigUpdate}
          />
        </TabsContent>
      </Tabs>

      <GamePreview
        gameConfig={gameConfig}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}