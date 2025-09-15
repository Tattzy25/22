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
import {
  Play,
  Pause,
  Square,
  Settings,
  Share,
  Copy,
  Eye,
  MessageSquare,
  Users,
  BarChart3,
  Globe,
  Smartphone
} from "lucide-react"

interface AgentConfig {
  name: string
  description: string
  avatar: string
  personality: string
  baseModel: string
  systemPrompt: string
  welcomeMessage: string
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  showTypingIndicator: boolean
  allowFileUploads: boolean
  maxConversations: number
  responseDelay: number
}

interface LiveSession {
  id: string
  agentId: string
  status: 'active' | 'paused' | 'stopped' | 'error'
  startTime: Date
  visitorCount: number
  messageCount: number
  url: string
  character?: {
    name: string
    personality: string
    model: string
  }
  config?: {
    name: string
    personality: string
    model: string
    systemPrompt: string
    temperature: number
    maxTokens: number
    isPublic: boolean
  }
}

const personalities = [
  { id: 'helpful', name: 'Helpful Assistant', description: 'Friendly and supportive' },
  { id: 'professional', name: 'Professional Expert', description: 'Formal and knowledgeable' },
  { id: 'creative', name: 'Creative Thinker', description: 'Imaginative and innovative' },
  { id: 'casual', name: 'Casual Friend', description: 'Relaxed and conversational' }
]

const themes = [
  { id: 'light', name: 'Light', preview: 'bg-white text-black border' },
  { id: 'dark', name: 'Dark', preview: 'bg-gray-900 text-white border-gray-700' },
  { id: 'auto', name: 'Auto', preview: 'bg-gradient-to-r from-white to-gray-100 border' }
]

export function AgentLiveContent() {
  const [config, setConfig] = useState<AgentConfig>({
    name: 'AI Assistant',
    description: 'Your intelligent AI assistant',
    avatar: '🤖',
    personality: 'helpful',
    baseModel: 'gpt-4',
    systemPrompt: 'You are a helpful AI assistant. Be friendly, accurate, and concise in your responses.',
    welcomeMessage: 'Hello! How can I help you today?',
    theme: 'auto',
    primaryColor: '#3b82f6',
    showTypingIndicator: true,
    allowFileUploads: false,
    maxConversations: 10,
    responseDelay: 1000
  })

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [activeTab, setActiveTab] = useState('config')

  const startLiveSession = () => {
    const newSession: LiveSession = {
      id: `session-${Date.now()}`,
      agentId: config.name.toLowerCase().replace(/\s+/g, '-'),
      status: 'active',
      startTime: new Date(),
      visitorCount: 0,
      messageCount: 0,
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}/live/${config.name.toLowerCase().replace(/\s+/g, '-')}`
    }
    setLiveSessions(prev => [newSession, ...prev])
    
    // Start the actual live session
    initializeLiveSession(newSession);
  }

  const initializeLiveSession = async (session: LiveSession) => {
    try {
      const response = await fetch('/api/live-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          character: session.character,
          config: session.config
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize live session');
      }

      const sessionData = await response.json();
      console.log('Live session initialized:', sessionData);
    } catch (error) {
      console.error('Error initializing live session:', error);
      // Update session status to error
      setLiveSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, status: 'error' } : s
      ));
    }
  }

  const stopLiveSession = () => {
    setLiveSessions(prev => prev.map(session =>
      session.status === 'active' ? { ...session, status: 'stopped' } : session
    ))
  }

  const pauseLiveSession = () => {
    setLiveSessions(prev => prev.map(session =>
      session.status === 'active' ? { ...session, status: 'paused' } : session
    ))
  }

  const resumeLiveSession = () => {
    setLiveSessions(prev => prev.map(session =>
      session.status === 'paused' ? { ...session, status: 'active' } : session
    ))
  }

  const generateEmbedCode = () => {
    const embedCode = `<iframe
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed/agent/${config.name.toLowerCase().replace(/\s+/g, '-')}"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="${config.name} Live Chat"
></iframe>`
    return embedCode
  }

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode())
  }

  const activeSession = liveSessions.find(session => session.status === 'active')
  const isLive = activeSession?.status === 'active'

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Agent Live</h2>
          <p className="text-muted-foreground">
            Create and manage live AI chat interfaces
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLive ? (
            <>
              <Button variant="outline" onClick={pauseLiveSession}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button variant="destructive" onClick={stopLiveSession}>
                <Square className="h-4 w-4 mr-2" />
                Stop Live
              </Button>
            </>
          ) : activeSession?.status === 'paused' ? (
            <Button onClick={resumeLiveSession}>
              <Play className="h-4 w-4 mr-2" />
              Resume Live
            </Button>
          ) : (
            <Button onClick={startLiveSession}>
              <Play className="h-4 w-4 mr-2" />
              Go Live
            </Button>
          )}
        </div>
      </div>

      {/* Live Status */}
      {isLive && activeSession && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-700 dark:text-green-300">LIVE</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {activeSession.visitorCount} visitors
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {activeSession.messageCount} messages
                  </span>
                  <span>
                    Started {activeSession.startTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.open(activeSession.url, '_blank')}>
                <Eye className="h-4 w-4 mr-2" />
                View Live
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input
                    id="agent-name"
                    value={config.name}
                    onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar Emoji</Label>
                  <Input
                    id="avatar"
                    value={config.avatar}
                    onChange={(e) => setConfig(prev => ({ ...prev, avatar: e.target.value }))}
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Personality</Label>
                  <Select value={config.personality} onValueChange={(value) => setConfig(prev => ({ ...prev, personality: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {personalities.map(personality => (
                        <SelectItem key={personality.id} value={personality.id}>
                          <div>
                            <div className="font-medium">{personality.name}</div>
                            <div className="text-sm text-muted-foreground">{personality.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>AI Model</Label>
                  <Select value={config.baseModel} onValueChange={(value) => setConfig(prev => ({ ...prev, baseModel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* System Prompt */}
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={config.systemPrompt}
                    onChange={(e) => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    rows={6}
                    placeholder="Define how your AI agent should behave..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Input
                    id="welcome-message"
                    value={config.welcomeMessage}
                    onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-conversations">Max Conversations</Label>
                    <Input
                      id="max-conversations"
                      type="number"
                      value={config.maxConversations}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxConversations: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response-delay">Response Delay (ms)</Label>
                    <Input
                      id="response-delay"
                      type="number"
                      value={config.responseDelay}
                      onChange={(e) => setConfig(prev => ({ ...prev, responseDelay: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Toggles */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.showTypingIndicator}
                    onChange={(e) => setConfig(prev => ({ ...prev, showTypingIndicator: e.target.checked }))}
                  />
                  <span className="text-sm">Show typing indicator</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.allowFileUploads}
                    onChange={(e) => setConfig(prev => ({ ...prev, allowFileUploads: e.target.checked }))}
                  />
                  <span className="text-sm">Allow file uploads</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Theme & Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map(theme => (
                      <div
                        key={theme.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          config.theme === theme.id ? 'border-primary' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, theme: theme.id as 'light' | 'dark' | 'auto' }))}
                      >
                        <div className={`w-full h-12 rounded ${theme.preview} mb-2`}></div>
                        <div className="text-sm font-medium">{theme.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg p-4 ${themes.find(t => t.id === config.theme)?.preview}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{config.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{config.name}</div>
                      <div className="text-sm opacity-70">{config.description}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-3 py-2 max-w-xs">
                        {config.welcomeMessage}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="rounded-lg px-3 py-2 max-w-xs text-white bg-primary">
                        Hello! How can I help?
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="embed" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Embed Code</CardTitle>
                <Button variant="outline" size="sm" onClick={copyEmbedCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
              <CardDescription>
                Copy this code to embed your live AI agent on any website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generateEmbedCode()}
                readOnly
                rows={8}
                className="font-mono text-sm"
              />

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Integration Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">Website Embed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm">Mobile Responsive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share className="h-4 w-4" />
                    <span className="text-sm">Shareable Link</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Live Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Live Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {liveSessions.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No live sessions yet
                      </div>
                    ) : (
                      liveSessions.map(session => (
                        <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full ${
                              session.status === 'active' ? 'bg-green-500' :
                              session.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                            }"></div>
                            <div>
                              <div className="font-medium">{config.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {session.startTime.toLocaleDateString()} • {session.visitorCount} visitors
                              </div>
                            </div>
                          </div>
                          <Badge variant={
                            session.status === 'active' ? 'default' :
                            session.status === 'paused' ? 'secondary' : 'destructive'
                          }>
                            {session.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {liveSessions.reduce((sum, session) => sum + session.visitorCount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Visitors</div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {liveSessions.reduce((sum, session) => sum + session.messageCount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Messages</div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {liveSessions.filter(s => s.status === 'active').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Sessions</div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(liveSessions.reduce((sum, session) => sum + session.messageCount, 0) /
                        Math.max(liveSessions.reduce((sum, session) => sum + session.visitorCount, 0), 1) * 10) / 10}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Messages/User</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}