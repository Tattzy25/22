"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  Square,
  Users,
  Zap,
  Brain,
  Activity,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  Copy,
  BarChart3,
  Clock,
  CheckCircle,
  Network,
  GitBranch,
  Target,
  Workflow
} from "lucide-react"

interface Agent {
  id: string
  name: string
  type: 'llm' | 'tool' | 'coordinator' | 'specialist'
  model?: string
  status: 'idle' | 'running' | 'completed' | 'error'
  capabilities: string[]
  currentTask?: string
  progress: number
  lastActive: Date
}

interface Workflow {
  id: string
  name: string
  description: string
  agents: Agent[]
  connections: Array<{
    from: string
    to: string
    condition?: string
  }>
  status: 'draft' | 'running' | 'completed' | 'paused' | 'error'
  createdAt: Date
  lastRun?: Date
  executionTime?: number
}

export function AutomationContent() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Content Generation Pipeline',
      description: 'Multi-agent workflow for creating blog posts and social media content',
      agents: [
        {
          id: 'agent-1',
          name: 'Research Agent',
          type: 'specialist',
          model: 'GPT-4',
          status: 'idle',
          capabilities: ['research', 'data-collection'],
          progress: 0,
          lastActive: new Date()
        },
        {
          id: 'agent-2',
          name: 'Content Writer',
          type: 'llm',
          model: 'Claude-3',
          status: 'idle',
          capabilities: ['writing', 'editing'],
          progress: 0,
          lastActive: new Date()
        },
        {
          id: 'agent-3',
          name: 'Social Media Optimizer',
          type: 'tool',
          status: 'idle',
          capabilities: ['optimization', 'analytics'],
          progress: 0,
          lastActive: new Date()
        }
      ],
      connections: [
        { from: 'agent-1', to: 'agent-2' },
        { from: 'agent-2', to: 'agent-3' }
      ],
      status: 'draft',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    },
    {
      id: '2',
      name: 'Code Review Assistant',
      description: 'Automated code review and improvement suggestions',
      agents: [
        {
          id: 'agent-4',
          name: 'Code Analyzer',
          type: 'specialist',
          model: 'GPT-4-Turbo',
          status: 'running',
          capabilities: ['code-analysis', 'security'],
          currentTask: 'Analyzing pull request #123',
          progress: 65,
          lastActive: new Date()
        },
        {
          id: 'agent-5',
          name: 'Review Coordinator',
          type: 'coordinator',
          status: 'idle',
          capabilities: ['coordination', 'scheduling'],
          progress: 0,
          lastActive: new Date()
        }
      ],
      connections: [
        { from: 'agent-4', to: 'agent-5', condition: 'analysis_complete' }
      ],
      status: 'running',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      lastRun: new Date(Date.now() - 1000 * 60 * 30)
    }
  ])

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
  const [activeTab, setActiveTab] = useState('workflows')

  const getAgentTypeIcon = (type: Agent['type']) => {
    switch (type) {
      case 'llm': return <Brain className="h-4 w-4" />
      case 'tool': return <Zap className="h-4 w-4" />
      case 'coordinator': return <Network className="h-4 w-4" />
      case 'specialist': return <Target className="h-4 w-4" />
    }
  }

  const getAgentTypeColor = (type: Agent['type']) => {
    switch (type) {
      case 'llm': return 'bg-blue-500'
      case 'tool': return 'bg-green-500'
      case 'coordinator': return 'bg-purple-500'
      case 'specialist': return 'bg-orange-500'
    }
  }

  const getStatusColor = (status: Agent['status'] | Workflow['status']) => {
    switch (status) {
      case 'idle':
      case 'draft': return 'bg-gray-500'
      case 'running': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const handleRunWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(wf =>
      wf.id === workflowId
        ? { ...wf, status: 'running' as const, lastRun: new Date() }
        : wf
    ))

    // Simulate workflow execution
    setTimeout(() => {
      setWorkflows(prev => prev.map(wf =>
        wf.id === workflowId
          ? { ...wf, status: 'completed' as const, executionTime: Math.random() * 300 + 60 }
          : wf
      ))
    }, 3000)
  }

  const handlePauseWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(wf =>
      wf.id === workflowId ? { ...wf, status: 'paused' as const } : wf
    ))
  }

  const handleStopWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(wf =>
      wf.id === workflowId ? { ...wf, status: 'draft' as const } : wf
    ))
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const WorkflowCard = ({ workflow }: { workflow: Workflow }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{workflow.name}</h3>
              <Badge variant="outline" className={`text-white ${getStatusColor(workflow.status)}`}>
                {workflow.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3">{workflow.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {workflow.agents.length} agents
              </div>
              <div className="flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                {workflow.connections.length} connections
              </div>
              {workflow.executionTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(workflow.executionTime)}
                </div>
              )}
            </div>

            {/* Agent Avatars */}
            <div className="flex items-center gap-2 mb-4">
              {workflow.agents.slice(0, 5).map((agent) => (
                <div key={agent.id} className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`} />
                </div>
              ))}
              {workflow.agents.length > 5 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  +{workflow.agents.length - 5}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant={workflow.status === 'running' ? 'secondary' : 'default'}
              onClick={(e) => {
                e.stopPropagation()
                if (workflow.status === 'running') {
                  handlePauseWorkflow(workflow.id)
                } else {
                  handleRunWorkflow(workflow.id)
                }
              }}
            >
              {workflow.status === 'running' ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                handleStopWorkflow(workflow.id)
              }}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress for running workflows */}
        {workflow.status === 'running' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(workflow.agents.reduce((acc, agent) => acc + agent.progress, 0) / workflow.agents.length)}%</span>
            </div>
            <Progress value={workflow.agents.reduce((acc, agent) => acc + agent.progress, 0) / workflow.agents.length} />
          </div>
        )}
      </CardContent>
    </Card>
  )

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getAgentTypeColor(agent.type)}`}>
            {getAgentTypeIcon(agent.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{agent.name}</h4>
              <Badge variant="outline" className="text-xs">
                {agent.type}
              </Badge>
            </div>

            {agent.model && (
              <p className="text-xs text-muted-foreground mb-1">{agent.model}</p>
            )}

            {agent.currentTask && (
              <p className="text-xs text-muted-foreground truncate mb-2">
                {agent.currentTask}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                <span className="text-xs text-muted-foreground capitalize">
                  {agent.status}
                </span>
              </div>

              {agent.status === 'running' && (
                <div className="flex items-center gap-1">
                  <Progress value={agent.progress} className="w-16 h-1" />
                  <span className="text-xs text-muted-foreground">{agent.progress}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Multi-Agent Orchestration</h2>
          <p className="text-muted-foreground">
            Coordinate AI agents for complex workflow automation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreatingWorkflow} onOpenChange={setIsCreatingWorkflow}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Set up a new multi-agent orchestration workflow
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input id="workflow-name" placeholder="Enter workflow name" />
                </div>
                <div>
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea id="workflow-description" placeholder="Describe the workflow purpose" />
                </div>
                <div>
                  <Label htmlFor="workflow-type">Workflow Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workflow type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="content">Content Generation</SelectItem>
                      <SelectItem value="analysis">Data Analysis</SelectItem>
                      <SelectItem value="automation">Process Automation</SelectItem>
                      <SelectItem value="custom">Custom Workflow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Create Workflow</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="agents">Agent Pool</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} onClick={() => setSelectedWorkflow(workflow)}>
                <WorkflowCard workflow={workflow} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows.flatMap(wf => wf.agents).map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {/* Agent Marketplace */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Agent Marketplace
              </CardTitle>
              <CardDescription>
                Discover and add pre-built agents to your workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: 'Web Scraper Agent', type: 'tool', description: 'Extract data from websites' },
                  { name: 'Email Assistant', type: 'specialist', description: 'Handle email automation' },
                  { name: 'Data Analyzer', type: 'llm', description: 'Process and analyze datasets' },
                  { name: 'Image Processor', type: 'tool', description: 'Manipulate and analyze images' }
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded ${getAgentTypeColor(agent.type as Agent['type'])}`}>
                        {getAgentTypeIcon(agent.type as Agent['type'])}
                      </div>
                      <div>
                        <h4 className="font-medium">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Workflow className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Active Workflows</span>
                </div>
                <div className="text-2xl font-bold">
                  {workflows.filter(wf => wf.status === 'running').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Total Agents</span>
                </div>
                <div className="text-2xl font-bold">
                  {workflows.reduce((acc, wf) => acc + wf.agents.length, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Completed Tasks</span>
                </div>
                <div className="text-2xl font-bold">1,247</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">Avg. Execution Time</span>
                </div>
                <div className="text-2xl font-bold">4.2m</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
              <CardDescription>
                Execution times and success rates over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Performance analytics chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Workflow Detail Modal */}
      <Dialog open={!!selectedWorkflow} onOpenChange={() => setSelectedWorkflow(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedWorkflow && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  {selectedWorkflow.name}
                </DialogTitle>
                <DialogDescription>{selectedWorkflow.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Workflow Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${getStatusColor(selectedWorkflow.status)} text-white`}>
                      {selectedWorkflow.status}
                    </Badge>
                    {selectedWorkflow.lastRun && (
                      <span className="text-sm text-muted-foreground">
                        Last run: {selectedWorkflow.lastRun.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Agents */}
                <div>
                  <h4 className="font-medium mb-3">Agents ({selectedWorkflow.agents.length})</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedWorkflow.agents.map((agent) => (
                      <AgentCard key={agent.id} agent={agent} />
                    ))}
                  </div>
                </div>

                {/* Connections */}
                <div>
                  <h4 className="font-medium mb-3">Workflow Connections</h4>
                  <div className="space-y-2">
                    {selectedWorkflow.connections.map((connection, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                        <span className="text-sm font-medium">
                          {selectedWorkflow.agents.find(a => a.id === connection.from)?.name}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {selectedWorkflow.agents.find(a => a.id === connection.to)?.name}
                        </span>
                        {connection.condition && (
                          <Badge variant="secondary" className="text-xs">
                            {connection.condition}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Log */}
                <div>
                  <h4 className="font-medium mb-3">Execution Log</h4>
                  <ScrollArea className="h-48 border rounded-lg">
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Workflow started at {new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span>Research Agent: Gathering data from sources...</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span>Content Writer: Processing research data...</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Social Media Optimizer: Content optimization completed</span>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}