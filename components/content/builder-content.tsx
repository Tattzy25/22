"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Play,
  Save,
  Zap,
  Bot,
  MessageSquare,
  Image as ImageIcon,
  Music,
  Database,
  Webhook,
  Timer,
  Filter,
  Split,
  X,
  GripVertical,
  Eye
} from "lucide-react"

interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'filter' | 'delay' | 'webhook'
  name: string
  description: string
  icon: React.ReactNode
  config: Record<string, any>
  position: { x: number; y: number }
  connections: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: Array<{ from: string; to: string }>
  status: 'draft' | 'active' | 'paused'
  lastRun?: Date
  runCount: number
}

const nodeTypes = [
  {
    category: 'Triggers',
    nodes: [
      { type: 'trigger' as const, name: 'Schedule', description: 'Run on a schedule', icon: <Timer className="h-4 w-4" /> },
      { type: 'trigger' as const, name: 'Webhook', description: 'HTTP webhook trigger', icon: <Webhook className="h-4 w-4" /> },
      { type: 'trigger' as const, name: 'API Call', description: 'External API trigger', icon: <Database className="h-4 w-4" /> }
    ]
  },
  {
    category: 'Actions',
    nodes: [
      { type: 'action' as const, name: 'AI Chat', description: 'Send message to AI', icon: <MessageSquare className="h-4 w-4" /> },
      { type: 'action' as const, name: 'Generate Image', description: 'Create image with DALL-E', icon: <ImageIcon className="h-4 w-4" /> },
      { type: 'action' as const, name: 'Generate Music', description: 'Create music with AI', icon: <Music className="h-4 w-4" /> },
      { type: 'action' as const, name: 'Character Action', description: 'Use AI character', icon: <Bot className="h-4 w-4" /> }
    ]
  },
  {
    category: 'Logic',
    nodes: [
      { type: 'condition' as const, name: 'Condition', description: 'If/else logic', icon: <Split className="h-4 w-4" /> },
      { type: 'filter' as const, name: 'Filter', description: 'Filter data', icon: <Filter className="h-4 w-4" /> },
      { type: 'delay' as const, name: 'Delay', description: 'Wait for time', icon: <Timer className="h-4 w-4" /> }
    ]
  }
]

export function BuilderContent() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Content Generation Pipeline',
      description: 'Automated content creation workflow',
      nodes: [],
      connections: [],
      status: 'draft',
      runCount: 0
    }
  ])

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(workflows[0])
  const [draggedNode, setDraggedNode] = useState<any>(null)
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('')
  const canvasRef = useRef<HTMLDivElement>(null)

  const createWorkflow = () => {
    if (!newWorkflowName.trim()) return

    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflowName,
      description: newWorkflowDescription,
      nodes: [],
      connections: [],
      status: 'draft',
      runCount: 0
    }

    setWorkflows(prev => [...prev, newWorkflow])
    setSelectedWorkflow(newWorkflow)
    setIsCreatingWorkflow(false)
    setNewWorkflowName('')
    setNewWorkflowDescription('')
  }

  const addNodeToWorkflow = useCallback((nodeType: any, position: { x: number; y: number }) => {
    if (!selectedWorkflow) return

    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: nodeType.type,
      name: nodeType.name,
      description: nodeType.description,
      icon: nodeType.icon,
      config: {},
      position,
      connections: []
    }

    setSelectedWorkflow(prev => prev ? {
      ...prev,
      nodes: [...prev.nodes, newNode]
    } : null)
  }, [selectedWorkflow])

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedNode || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }

    addNodeToWorkflow(draggedNode, position)
    setDraggedNode(null)
  }, [draggedNode, addNodeToWorkflow])

  const handleDragStart = (nodeType: any) => {
    setDraggedNode(nodeType)
  }

  const deleteNode = (nodeId: string) => {
    if (!selectedWorkflow) return

    setSelectedWorkflow(prev => prev ? {
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => conn.from !== nodeId && conn.to !== nodeId)
    } : null)
  }

  const runWorkflow = async () => {
    if (!selectedWorkflow) return

    // Here you would integrate with the automation service
    console.log('Running workflow:', selectedWorkflow.name)

    setSelectedWorkflow(prev => prev ? {
      ...prev,
      status: 'active',
      lastRun: new Date(),
      runCount: prev.runCount + 1
    } : null)
  }

  const saveWorkflow = () => {
    if (!selectedWorkflow) return

    // Here you would save to database
    console.log('Saving workflow:', selectedWorkflow)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Automation Builder</h2>
          <p className="text-muted-foreground">
            Create powerful AI workflows with drag-and-drop simplicity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Dialog open={isCreatingWorkflow} onOpenChange={setIsCreatingWorkflow}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Set up a new automation workflow to streamline your AI tasks.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input
                    id="name"
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                    placeholder="My Awesome Workflow"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkflowDescription}
                    onChange={(e) => setNewWorkflowDescription(e.target.value)}
                    placeholder="What does this workflow do?"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreatingWorkflow(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createWorkflow}>Create Workflow</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar - Node Library */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Node Library</CardTitle>
              <CardDescription>
                Drag nodes onto the canvas to build your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {nodeTypes.map((category) => (
                    <div key={category.category}>
                      <h4 className="font-medium text-sm text-muted-foreground mb-3">
                        {category.category}
                      </h4>
                      <div className="space-y-2">
                        {category.nodes.map((nodeType) => (
                          <div
                            key={nodeType.name}
                            draggable
                            onDragStart={() => handleDragStart(nodeType)}
                            className="flex items-center gap-3 p-3 border rounded-lg cursor-move hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
                              {nodeType.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{nodeType.name}</p>
                              <p className="text-xs text-muted-foreground">{nodeType.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {selectedWorkflow?.name || 'Select a Workflow'}
                  </CardTitle>
                  {selectedWorkflow && (
                    <CardDescription className="mt-1">
                      {selectedWorkflow.description}
                    </CardDescription>
                  )}
                </div>
                {selectedWorkflow && (
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedWorkflow.status === 'active' ? 'default' : 'secondary'}>
                      {selectedWorkflow.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={saveWorkflow}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" onClick={runWorkflow}>
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedWorkflow ? (
                <div
                  ref={canvasRef}
                  className="relative h-[600px] border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/10 overflow-hidden"
                  onDrop={handleCanvasDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {/* Canvas Grid Background */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgb(229 231 235) 1px, transparent 1px),
                        linear-gradient(to bottom, rgb(229 231 235) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  />

                  {/* Workflow Nodes */}
                  {selectedWorkflow.nodes.map((node) => (
                    <div
                      key={node.id}
                      className="absolute bg-background border rounded-lg shadow-sm p-3 min-w-[200px] cursor-move"
                      style={{
                        left: `${node.position.x}px`,
                        top: `${node.position.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10">
                          {node.icon}
                        </div>
                        <span className="font-medium text-sm">{node.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-auto"
                          onClick={() => deleteNode(node.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{node.description}</p>

                      {/* Connection Points */}
                      <div className="flex justify-between mt-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full cursor-pointer" />
                        <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer" />
                      </div>
                    </div>
                  ))}

                  {/* Empty State */}
                  {selectedWorkflow.nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Start Building Your Workflow</h3>
                        <p className="text-muted-foreground">
                          Drag nodes from the library to create your automation
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Workflow Selected</h3>
                    <p className="text-muted-foreground">
                      Create or select a workflow to start building
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow List */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Your Workflows</CardTitle>
              <CardDescription>
                Manage and organize your automation workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWorkflow?.id === workflow.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                        {workflow.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {workflow.runCount} runs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}