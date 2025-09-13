"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Play,
  Pause,
  Square,
  Settings,
  Plus,
  Trash2,
  Zap,
  MessageSquare,
  Users,
  Network,
  ArrowRight,
  Bot,
  Brain,
  Database,
  Globe,
  Cpu,
  Activity,
  Link,
  Unlink
} from "lucide-react"

interface Agent {
  id: string
  name: string
  role: string
  model: string
  capabilities: string[]
  status: 'idle' | 'active' | 'error'
  connections: string[]
  config: {
    temperature: number
    maxTokens: number
    systemPrompt: string
  }
}

interface MCPConnection {
  id: string
  name: string
  type: 'tool' | 'resource' | 'prompt'
  provider: string
  status: 'connected' | 'disconnected' | 'error'
  description: string
}

interface MultiAgentWorkflow {
  id: string
  name: string
  description: string
  agents: Agent[]
  connections: MCPConnection[]
  workflow: {
    steps: Array<{
      id: string
      agentId: string
      action: string
      inputs: Record<string, any>
      outputs: Record<string, any>
    }>
  }
  status: 'stopped' | 'running' | 'paused'
}

const availableModels = [
  'GPT-4', 'GPT-3.5', 'Claude-3', 'Claude-2', 'Gemini Pro', 'Gemini Ultra'
]

const agentRoles = [
  'Researcher', 'Writer', 'Analyst', 'Coder', 'Designer', 'Reviewer', 'Coordinator', 'Specialist'
]

const mcpProviders = [
  { id: 'github', name: 'GitHub', type: 'tool', description: 'Code repository access and management' },
  { id: 'slack', name: 'Slack', type: 'tool', description: 'Team communication and notifications' },
  { id: 'notion', name: 'Notion', type: 'resource', description: 'Document and knowledge base access' },
  { id: 'google-drive', name: 'Google Drive', type: 'resource', description: 'File storage and collaboration' },
  { id: 'stripe', name: 'Stripe', type: 'tool', description: 'Payment processing and subscriptions' },
  { id: 'sendgrid', name: 'SendGrid', type: 'tool', description: 'Email delivery and marketing' }
]

export function MultiAgentContent() {
  const [workflows, setWorkflows] = useState<MultiAgentWorkflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<MultiAgentWorkflow | null>(null)
  const [activeTab, setActiveTab] = useState('workflows')
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)

  // New agent form state
  const [newAgent, setNewAgent] = useState({
    name: '',
    role: '',
    model: '',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 1000
  })

  const createNewWorkflow = () => {
    const workflow: MultiAgentWorkflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Multi-Agent Workflow',
      description: 'A collaborative AI workflow with multiple agents',
      agents: [],
      connections: [],
      workflow: { steps: [] },
      status: 'stopped'
    }
    setWorkflows(prev => [...prev, workflow])
    setSelectedWorkflow(workflow)
    setActiveTab('builder')
  }

  const addAgentToWorkflow = () => {
    if (!selectedWorkflow || !newAgent.name.trim()) return

    const agent: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgent.name,
      role: newAgent.role,
      model: newAgent.model,
      capabilities: [],
      status: 'idle',
      connections: [],
      config: {
        temperature: newAgent.temperature,
        maxTokens: newAgent.maxTokens,
        systemPrompt: newAgent.systemPrompt
      }
    }

    setSelectedWorkflow(prev => prev ? {
      ...prev,
      agents: [...prev.agents, agent]
    } : null)

    setNewAgent({
      name: '',
      role: '',
      model: '',
      systemPrompt: '',
      temperature: 0.7,
      maxTokens: 1000
    })
    setIsCreatingAgent(false)
  }

  const connectMCP = (providerId: string) => {
    if (!selectedWorkflow) return

    const provider = mcpProviders.find(p => p.id === providerId)
    if (!provider) return

    const connection: MCPConnection = {
      id: `mcp-${Date.now()}`,
      name: provider.name,
      type: provider.type as any,
      provider: providerId,
      status: 'connected',
      description: provider.description
    }

    setSelectedWorkflow(prev => prev ? {
      ...prev,
      connections: [...prev.connections, connection]
    } : null)
  }

  const runWorkflow = () => {
    if (!selectedWorkflow) return

    setSelectedWorkflow(prev => prev ? {
      ...prev,
      status: 'running',
      agents: prev.agents.map(agent => ({ ...agent, status: 'active' }))
    } : null)

    // Simulate workflow execution
    setTimeout(() => {
      setSelectedWorkflow(prev => prev ? {
        ...prev,
        status: 'stopped',
        agents: prev.agents.map(agent => ({ ...agent, status: 'idle' }))
      } : null)
    }, 5000)
  }

  const stopWorkflow = () => {
    if (!selectedWorkflow) return

    setSelectedWorkflow(prev => prev ? {
      ...prev,
      status: 'stopped',
      agents: prev.agents.map(agent => ({ ...agent, status: 'idle' }))
    } : null)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Multi-Agent Automations</h2>
          <p className="text-muted-foreground">
            Create collaborative AI workflows with MCP-connected agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Network className="h-3 w-3" />
            MCP Connected
          </Badge>
          <Button onClick={createNewWorkflow}>
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="builder" disabled={!selectedWorkflow}>Builder</TabsTrigger>
          <TabsTrigger value="agents" disabled={!selectedWorkflow}>Agents</TabsTrigger>
          <TabsTrigger value="connections" disabled={!selectedWorkflow}>MCP Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map(workflow => (
              <Card
                key={workflow.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedWorkflow?.id === workflow.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <Badge variant={
                      workflow.status === 'running' ? 'default' :
                      workflow.status === 'paused' ? 'secondary' : 'outline'
                    }>
                      {workflow.status}
                    </Badge>
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bot className="h-4 w-4" />
                        {workflow.agents.length} agents
                      </span>
                      <span className="flex items-center gap-1">
                        <Link className="h-4 w-4" />
                        {workflow.connections.length} connections
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedWorkflow(workflow)
                          setActiveTab('builder')
                        }}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (workflow.status === 'running') {
                            stopWorkflow()
                          } else {
                            runWorkflow()
                          }
                        }}
                      >
                        {workflow.status === 'running' ? (
                          <Square className="h-4 w-4 mr-1" />
                        ) : (
                          <Play className="h-4 w-4 mr-1" />
                        )}
                        {workflow.status === 'running' ? 'Stop' : 'Run'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {workflows.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="text-center py-12">
                  <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first multi-agent workflow to get started
                  </p>
                  <Button onClick={createNewWorkflow}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6 mt-6">
          {selectedWorkflow && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Workflow Canvas */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Workflow Builder</CardTitle>
                  <CardDescription>
                    Design your multi-agent collaboration flow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        Drag agents and connections here to build your workflow
                      </p>
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        {selectedWorkflow.agents.slice(0, 4).map(agent => (
                          <div key={agent.id} className="p-3 border rounded-lg text-center">
                            <Bot className="h-6 w-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">{agent.name}</div>
                            <div className="text-xs text-muted-foreground">{agent.role}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow-name">Name</Label>
                    <Input
                      id="workflow-name"
                      value={selectedWorkflow.name}
                      onChange={(e) => setSelectedWorkflow(prev => prev ? {
                        ...prev,
                        name: e.target.value
                      } : null)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workflow-description">Description</Label>
                    <Textarea
                      id="workflow-description"
                      value={selectedWorkflow.description}
                      onChange={(e) => setSelectedWorkflow(prev => prev ? {
                        ...prev,
                        description: e.target.value
                      } : null)}
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Status</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        selectedWorkflow.status === 'running' ? 'default' :
                        selectedWorkflow.status === 'paused' ? 'secondary' : 'outline'
                      }>
                        {selectedWorkflow.status}
                      </Badge>
                      {selectedWorkflow.status === 'running' && (
                        <Button variant="outline" size="sm" onClick={stopWorkflow}>
                          <Square className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="agents" className="space-y-6 mt-6">
          {selectedWorkflow && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Agents ({selectedWorkflow.agents.length})</h3>
                <Button onClick={() => setIsCreatingAgent(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Agent
                </Button>
              </div>

              {isCreatingAgent && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Agent</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agent-name">Name</Label>
                        <Input
                          id="agent-name"
                          value={newAgent.name}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={newAgent.role} onValueChange={(value) => setNewAgent(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {agentRoles.map(role => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Select value={newAgent.model} onValueChange={(value) => setNewAgent(prev => ({ ...prev, model: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map(model => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="system-prompt">System Prompt</Label>
                      <Textarea
                        id="system-prompt"
                        value={newAgent.systemPrompt}
                        onChange={(e) => setNewAgent(prev => ({ ...prev, systemPrompt: e.target.value }))}
                        placeholder="Define the agent's role and behavior..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={addAgentToWorkflow} disabled={!newAgent.name.trim()}>
                        Add Agent
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreatingAgent(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {selectedWorkflow.agents.map(agent => (
                  <Card key={agent.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">{agent.role}</div>
                          </div>
                        </div>
                        <Badge variant={
                          agent.status === 'active' ? 'default' :
                          agent.status === 'error' ? 'destructive' : 'secondary'
                        }>
                          {agent.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>Model: {agent.model}</div>
                        <div>Temperature: {agent.config.temperature}</div>
                        <div>Max Tokens: {agent.config.maxTokens}</div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="connections" className="space-y-6 mt-6">
          {selectedWorkflow && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">MCP Connections ({selectedWorkflow.connections.length})</h3>
                <Select onValueChange={connectMCP}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Add connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {mcpProviders
                      .filter(provider => !selectedWorkflow.connections.some(conn => conn.provider === provider.id))
                      .map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedWorkflow.connections.map(connection => (
                  <Card key={connection.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Globe className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{connection.name}</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {connection.type}
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          connection.status === 'connected' ? 'default' :
                          connection.status === 'error' ? 'destructive' : 'secondary'
                        }>
                          {connection.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {connection.description}
                      </p>

                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedWorkflow.connections.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Link className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No MCP connections</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect external services and tools to enhance your multi-agent workflows
                    </p>
                    <Select onValueChange={connectMCP}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Add your first connection" />
                      </SelectTrigger>
                      <SelectContent>
                        {mcpProviders.map(provider => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}