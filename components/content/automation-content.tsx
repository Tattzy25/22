"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Play,
  Save,
  Plus,
  Trash2,
  Copy,
  Settings,
  Zap,
  MessageSquare,
  Database,
  Webhook,
  Mail,
  FileText,
  Image,
  Music,
  Bot,
  ArrowRight,
  GripVertical
} from "lucide-react"

interface Node {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'output'
  name: string
  icon: any
  position: { x: number; y: number }
  config: Record<string, any>
  connections: string[]
}

interface Connection {
  id: string
  from: string
  to: string
  fromHandle: string
  toHandle: string
}

const nodeTypes = {
  trigger: [
    { id: 'webhook', name: 'Webhook Trigger', icon: Webhook, description: 'HTTP webhook trigger' },
    { id: 'schedule', name: 'Schedule Trigger', icon: Zap, description: 'Time-based trigger' },
    { id: 'email', name: 'Email Trigger', icon: Mail, description: 'Email received trigger' },
    { id: 'form', name: 'Form Submission', icon: FileText, description: 'Form submission trigger' }
  ],
  action: [
    { id: 'ai-chat', name: 'AI Chat', icon: MessageSquare, description: 'Generate AI response' },
    { id: 'ai-image', name: 'Generate Image', icon: Image, description: 'Create AI image' },
    { id: 'ai-music', name: 'Generate Music', icon: Music, description: 'Create AI music' },
    { id: 'webhook-call', name: 'Call Webhook', icon: Webhook, description: 'Make HTTP request' },
    { id: 'email-send', name: 'Send Email', icon: Mail, description: 'Send email notification' },
    { id: 'database', name: 'Database Query', icon: Database, description: 'Query database' }
  ],
  condition: [
    { id: 'if-else', name: 'If/Else', icon: Settings, description: 'Conditional logic' },
    { id: 'switch', name: 'Switch', icon: Settings, description: 'Multi-condition switch' }
  ],
  output: [
    { id: 'response', name: 'API Response', icon: ArrowRight, description: 'Return API response' },
    { id: 'file', name: 'Save File', icon: FileText, description: 'Save to file' },
    { id: 'notification', name: 'Notification', icon: Zap, description: 'Send notification' }
  ]
}

export function AutomationContent() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [automationName, setAutomationName] = useState('New Automation')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const addNode = useCallback((type: keyof typeof nodeTypes, nodeType: any) => {
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

  const runAutomation = () => {
    console.log('Running automation:', { nodes, connections })
  }

  const saveAutomation = () => {
    console.log('Saving automation:', { name: automationName, nodes, connections })
  }

  const duplicateNode = (node: Node) => {
    const newNode: Node = {
      ...node,
      id: `node-${Date.now()}`,
      position: { x: node.position.x + 50, y: node.position.y + 50 }
    }
    setNodes(prev => [...prev, newNode])
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Automation Builder</h2>
            <p className="text-muted-foreground">
              Create AI workflows with drag-and-drop automation
            </p>
          </div>
          <Input
            value={automationName}
            onChange={(e) => setAutomationName(e.target.value)}
            className="w-64"
            placeholder="Automation name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveAutomation}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={runAutomation}>
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Toolbox */}
        <Card className="w-80 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Components
            </CardTitle>
            <CardDescription>
              Drag components to build your automation
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {Object.entries(nodeTypes).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-medium capitalize mb-3 text-sm text-muted-foreground">
                      {category}s
                    </h4>
                    <div className="space-y-2">
                      {items.map(item => {
                        const Icon = item.icon
                        return (
                          <div
                            key={item.id}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => addNode(category as keyof typeof nodeTypes, item)}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.description}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {category !== 'output' && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Workflow Canvas</CardTitle>
            <CardDescription>
              {nodes.length} nodes • {connections.length} connections
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative overflow-hidden">
            <div
              ref={canvasRef}
              className="relative w-full h-full bg-muted/20 cursor-crosshair"
              style={{
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Render connections */}
              <svg className="absolute inset-0 pointer-events-none">
                {connections.map(connection => {
                  const fromNode = nodes.find(n => n.id === connection.from)
                  const toNode = nodes.find(n => n.id === connection.to)
                  if (!fromNode || !toNode) return null

                  const fromX = fromNode.position.x + 120
                  const fromY = fromNode.position.y + 40
                  const toX = toNode.position.x
                  const toY = toNode.position.y + 40

                  return (
                    <path
                      key={connection.id}
                      d={`M ${fromX} ${fromY} C ${fromX + 50} ${fromY} ${toX - 50} ${toY} ${toX} ${toY}`}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                  )
                })}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7"
                    refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                  </marker>
                </defs>
              </svg>

              {/* Render nodes */}
              {nodes.map(node => {
                const Icon = node.icon
                return (
                  <div
                    key={node.id}
                    className={`absolute p-3 bg-background border rounded-lg shadow-sm cursor-move select-none transition-shadow min-w-[120px] ${
                      selectedNode?.id === node.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                    }`}
                    style={{
                      left: node.position.x,
                      top: node.position.y
                    }}
                    onMouseDown={(e) => handleMouseDown(e, node)}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium truncate">{node.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {node.type}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Properties Panel */}
        <Card className="w-80 flex flex-col">
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>
              {selectedNode ? `Configure ${selectedNode.name}` : 'Select a node to configure'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {selectedNode ? (
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{selectedNode.name}</h4>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateNode(selectedNode)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNode(selectedNode.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Node ID</label>
                      <Input value={selectedNode.id} readOnly className="mt-1" />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Badge variant="outline" className="mt-1 block w-fit">
                        {selectedNode.type}
                      </Badge>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Position</label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="number"
                          placeholder="X"
                          value={Math.round(selectedNode.position.x)}
                          onChange={(e) => updateNodePosition(selectedNode.id, {
                            ...selectedNode.position,
                            x: parseInt(e.target.value) || 0
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Y"
                          value={Math.round(selectedNode.position.y)}
                          onChange={(e) => updateNodePosition(selectedNode.id, {
                            ...selectedNode.position,
                            y: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>

                    {/* Node-specific configuration */}
                    {selectedNode.type === 'action' && selectedNode.name.includes('AI') && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">AI Model</label>
                          <Select defaultValue="gpt-4">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="claude-3">Claude 3</SelectItem>
                              <SelectItem value="gemini">Gemini Pro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Prompt</label>
                          <textarea
                            className="w-full mt-1 p-2 border rounded-md text-sm"
                            rows={3}
                            placeholder="Enter your AI prompt..."
                          />
                        </div>
                      </div>
                    )}

                    {selectedNode.type === 'trigger' && selectedNode.name.includes('Webhook') && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Webhook URL</label>
                          <Input
                            className="mt-1"
                            placeholder="https://your-app.com/webhook"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">HTTP Method</label>
                          <Select defaultValue="POST">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="DELETE">DELETE</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Select a node to view its properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}