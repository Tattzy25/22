"use client"

import { useState, useRef } from "react"
import { GameTemplate, GameConfig, GameScene, GameElement } from "./types"

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

  const saveGame = async () => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameConfig),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save game');
      }

      const savedGame = await response.json();
      console.log('Game saved successfully:', savedGame.id);
      return savedGame;
    } catch (error) {
      console.error('Error saving game:', error);
      throw error;
    }
  }

  const previewGame = () => {
    setIsPreviewOpen(true)
  }

  const exportGame = async () => {
    try {
      const response = await fetch('/api/games/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: gameConfig.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export game');
      }

      const exportData = await response.json();
      
      // Download the generated code
      const blob = new Blob([exportData.code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${gameConfig.title || 'game'}.html`;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log('Game exported successfully');
    } catch (error) {
      console.error('Error exporting game:', error);
      throw error;
    }
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