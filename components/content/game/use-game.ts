"use client"

import { useState, useRef } from "react"
import { GameTemplate, GameConfig, GameScene, GameElement, gameTemplates } from "./types"

export function useGame() {
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
  }

  const addElementToScene = (elementType: string) => {
    if (!selectedScene) return

    const newElement: GameElement = {
      id: `element-${Date.now()}`,
      type: elementType as GameElement['type'],
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

  return {
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
    updateElement,
    deleteElement,
    addNewScene,
    saveGame,
    previewGame,
    exportGame
  }
}