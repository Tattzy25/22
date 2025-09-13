"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Play,
  Save,
  Plus,
  Trash2,
  Copy,
  Settings,
  Gamepad2,
  Puzzle,
  Target,
  Zap,
  Trophy,
  Star,
  Users,
  Eye,
  Code,
  Palette,
  Volume2,
  Share
} from "lucide-react"

interface GameTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: any
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
  features: string[]
}

interface GameElement {
  id: string
  type: 'text' | 'button' | 'image' | 'input' | 'choice' | 'timer' | 'score'
  content: string
  position: { x: number; y: number }
  style: Record<string, any>
  config: Record<string, any>
}

interface GameScene {
  id: string
  name: string
  elements: GameElement[]
  background: string
  music?: string
}

interface GameConfig {
  id: string
  title: string
  description: string
  template: string
  difficulty: 'easy' | 'medium' | 'hard'
  maxScore: number
  timeLimit?: number
  scenes: GameScene[]
  globalSettings: {
    theme: 'light' | 'dark' | 'colorful'
    soundEnabled: boolean
    vibrationEnabled: boolean
    autoSave: boolean
  }
}

const gameTemplates: GameTemplate[] = [
  {
    id: 'quiz',
    name: 'Interactive Quiz',
    description: 'Create engaging quizzes with multiple choice questions',
    category: 'Educational',
    icon: Target,
    difficulty: 'easy',
    estimatedTime: '15-30 min',
    features: ['Multiple Choice', 'Timer', 'Score Tracking', 'Instant Feedback']
  },
  {
    id: 'adventure',
    name: 'Text Adventure',
    description: 'Build choose-your-own-adventure style games',
    category: 'Story',
    icon: Puzzle,
    difficulty: 'medium',
    estimatedTime: '30-60 min',
    features: ['Branching Story', 'Character Choices', 'Multiple Endings', 'Inventory System']
  },
  {
    id: 'puzzle',
    name: 'Logic Puzzle',
    description: 'Design brain-teasing puzzles and riddles',
    category: 'Puzzle',
    icon: Gamepad2,
    difficulty: 'hard',
    estimatedTime: '45-90 min',
    features: ['Custom Logic', 'Hints System', 'Difficulty Levels', 'Progress Tracking']
  },
  {
    id: 'memory',
    name: 'Memory Game',
    description: 'Create memory matching and sequence games',
    category: 'Casual',
    icon: Zap,
    difficulty: 'easy',
    estimatedTime: '10-20 min',
    features: ['Card Matching', 'Sequence Memory', 'Time Challenges', 'High Scores']
  },
  {
    id: 'trivia',
    name: 'Trivia Challenge',
    description: 'Build trivia games with categories and scoring',
    category: 'Educational',
    icon: Trophy,
    difficulty: 'medium',
    estimatedTime: '20-40 min',
    features: ['Categories', 'Multiplayer', 'Leaderboards', 'Timed Rounds']
  }
]

const elementTypes = [
  { id: 'text', name: 'Text Block', icon: '📝', description: 'Display text content' },
  { id: 'button', name: 'Interactive Button', icon: '🔘', description: 'Clickable action button' },
  { id: 'image', name: 'Image Display', icon: '🖼️', description: 'Show images or graphics' },
  { id: 'input', name: 'Text Input', icon: '⌨️', description: 'Collect user input' },
  { id: 'choice', name: 'Multiple Choice', icon: '☑️', description: 'Present options to choose from' },
  { id: 'timer', name: 'Timer/Countdown', icon: '⏱️', description: 'Display time remaining' },
  { id: 'score', name: 'Score Display', icon: '🏆', description: 'Show current score' }
]

export function GameContent() {
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null)
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    id: '',
    title: '',
    description: '',
    template: '',
    difficulty: 'easy',
    maxScore: 100,
    scenes: [],
    globalSettings: {
      theme: 'light',
      soundEnabled: true,
      vibrationEnabled: false,
      autoSave: true
    }
  })

  const [activeTab, setActiveTab] = useState('templates')
  const [selectedScene, setSelectedScene] = useState<GameScene | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const createNewGame = (template: GameTemplate) => {
    const newGame: GameConfig = {
      id: `game-${Date.now()}`,
      title: `${template.name} Game`,
      description: template.description,
      template: template.id,
      difficulty: template.difficulty,
      maxScore: 100,
      scenes: [{
        id: 'scene-1',
        name: 'Main Scene',
        elements: [],
        background: '#ffffff'
      }],
      globalSettings: {
        theme: 'light',
        soundEnabled: true,
        vibrationEnabled: false,
        autoSave: true
      }
    }
    setGameConfig(newGame)
    setSelectedTemplate(template)
    setActiveTab('builder')
  }

  const addElementToScene = (elementType: string) => {
    if (!selectedScene) return

    const newElement: GameElement = {
      id: `element-${Date.now()}`,
      type: elementType as any,
      content: `New ${elementType}`,
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 },
      style: {},
      config: {}
    }

    setSelectedScene(prev => prev ? {
      ...prev,
      elements: [...prev.elements, newElement]
    } : null)
  }

  const updateElement = (elementId: string, updates: Partial<GameElement>) => {
    if (!selectedScene) return

    setSelectedScene(prev => prev ? {
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    } : null)
  }

  const deleteElement = (elementId: string) => {
    if (!selectedScene) return

    setSelectedScene(prev => prev ? {
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    } : null)
  }

  const addNewScene = () => {
    const newScene: GameScene = {
      id: `scene-${Date.now()}`,
      name: `Scene ${gameConfig.scenes.length + 1}`,
      elements: [],
      background: '#ffffff'
    }

    setGameConfig(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene]
    }))

    setSelectedScene(newScene)
  }

  const saveGame = () => {
    console.log('Saving game:', gameConfig)
    // In a real implementation, this would save to a database
  }

  const previewGame = () => {
    setIsPreviewOpen(true)
  }

  const exportGame = () => {
    console.log('Exporting game code...')
    // In a real implementation, this would generate embeddable code
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gameTemplates.map(template => {
              const Icon = template.icon
              return (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-primary" />
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
                        onClick={() => createNewGame(template)}
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
        </TabsContent>

        <TabsContent value="builder" className="space-y-6 mt-6">
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
                        onClick={() => addElementToScene(element.id)}
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
                      setSelectedScene(scene || null)
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
                          deleteElement(element.id)
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
        </TabsContent>

        <TabsContent value="scenes" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Game Scenes</h3>
            <Button onClick={addNewScene}>
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
                onClick={() => setSelectedScene(scene)}
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
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
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
                    onChange={(e) => setGameConfig(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game-description">Description</Label>
                  <Textarea
                    id="game-description"
                    value={gameConfig.description}
                    onChange={(e) => setGameConfig(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={gameConfig.difficulty}
                    onValueChange={(value) => setGameConfig(prev => ({ ...prev, difficulty: value as any }))}
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
                    onChange={(e) => setGameConfig(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
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
                    onValueChange={(value) => setGameConfig(prev => ({
                      ...prev,
                      globalSettings: { ...prev.globalSettings, theme: value as any }
                    }))}
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
                      onChange={(e) => setGameConfig(prev => ({
                        ...prev,
                        globalSettings: { ...prev.globalSettings, soundEnabled: e.target.checked }
                      }))}
                    />
                    <span className="text-sm">Enable Sound Effects</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={gameConfig.globalSettings.vibrationEnabled}
                      onChange={(e) => setGameConfig(prev => ({
                        ...prev,
                        globalSettings: { ...prev.globalSettings, vibrationEnabled: e.target.checked }
                      }))}
                    />
                    <span className="text-sm">Enable Vibration</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={gameConfig.globalSettings.autoSave}
                      onChange={(e) => setGameConfig(prev => ({
                        ...prev,
                        globalSettings: { ...prev.globalSettings, autoSave: e.target.checked }
                      }))}
                    />
                    <span className="text-sm">Auto-save Progress</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Game Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Game Preview: {gameConfig.title}</DialogTitle>
            <DialogDescription>
              Test your game before publishing
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-96 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Game preview would render here</p>
              <p className="text-sm text-muted-foreground mt-2">
                In a full implementation, this would show the actual playable game
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}