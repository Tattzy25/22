"use client"

import { useState, useRef, useCallback } from "react"
import { Node, Connection, nodeTypes, NodeType } from "./types"

export function useAutomation() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [automationName, setAutomationName] = useState('New Automation')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const addNode = useCallback((type: keyof typeof nodeTypes, nodeType: NodeType) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      name: nodeType.name,
      icon: nodeType.icon,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      config: {},
      connections: []
    }
    setNodes(prev => [...prev, newNode])
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setConnections(prev => prev.filter(conn => conn.from !== nodeId && conn.to !== nodeId))
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }, [selectedNode])

  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, position } : node
    ))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent, node: Node) => {
    setIsDragging(true)
    setSelectedNode(node)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - node.position.x,
        y: e.clientY - rect.top - node.position.y
      })
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedNode || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const newPosition = {
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    }

    updateNodePosition(selectedNode.id, newPosition)
  }, [isDragging, selectedNode, dragOffset, updateNodePosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const runAutomation = useCallback(async () => {
    setIsRunning(true)
    console.log('Running automation:', { nodes, connections })

    // Simulate running time
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsRunning(false)
  }, [nodes, connections])

  const saveAutomation = useCallback(async () => {
    setIsSaving(true)
    console.log('Saving automation:', { name: automationName, nodes, connections })

    // Simulate save time
    await new Promise(resolve => setTimeout(resolve, 500))

    setLastSaved(new Date().toLocaleTimeString())
    setIsSaving(false)
  }, [automationName, nodes, connections])

  const duplicateNode = (node: Node) => {
    const newNode: Node = {
      ...node,
      id: `node-${Date.now()}`,
      position: { x: node.position.x + 50, y: node.position.y + 50 }
    }
    setNodes(prev => [...prev, newNode])
  }

  return {
    nodes,
    connections,
    selectedNode,
    automationName,
    isDragging,
    dragOffset,
    isRunning,
    isSaving,
    lastSaved,
    canvasRef,
    setAutomationName,
    setSelectedNode,
    addNode,
    deleteNode,
    updateNodePosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    runAutomation,
    saveAutomation,
    duplicateNode
  }
}