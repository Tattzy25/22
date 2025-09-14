"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Plus, Trash2, Bot, User } from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
}

interface PlaygroundSession {
  id: string
  name: string
  model: string
  messages: Message[]
  isActive: boolean
}

const DEFAULT_MODELS = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "claude-3-opus", name: "Claude 3 Opus" },
  { id: "gemini-pro", name: "Gemini Pro" }
]

export function PlaygroundContent() {
  const [chatSessions, setChatSessions] = useState<PlaygroundSession[]>([
    {
      id: "1",
      name: "Chat 1",
      model: "gpt-4",
      messages: [
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm GPT-4. How can I help you today?",
          timestamp: new Date(),
          model: "gpt-4"
        }
      ],
      isActive: true
    }
  ])
  const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS)
  const [activeTab, setActiveTab] = useState("1")
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      const response = await fetch('/api/models')
      if (response.ok) {
        const data = await response.json()
        setAvailableModels(data.models?.map((model: any) => ({
          id: model.id,
          name: model.name
        })) || DEFAULT_MODELS)
      }
    } catch (error) {
      console.error('Failed to load models:', error)
      // Keep default models on error
    }
  }

  const activeSession = chatSessions.find(session => session.id === activeTab)

  const createNewChat = () => {
    const newSession: PlaygroundSession = {
      id: Date.now().toString(),
      name: `Chat ${chatSessions.length + 1}`,
      model: "gpt-4",
      messages: [
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Hello! I'm ${availableModels.find(m => m.id === "gpt-4")?.name}. How can I help you today?`,
          timestamp: new Date(),
          model: "gpt-4"
        }
      ],
      isActive: false
    }
    setChatSessions([...chatSessions, newSession])
    setActiveTab(newSession.id)
  }

  const deleteChat = (chatId: string) => {
    if (chatSessions.length === 1) return // Don't delete the last chat

    const updatedSessions = chatSessions.filter(session => session.id !== chatId)
    setChatSessions(updatedSessions)

    if (activeTab === chatId) {
      setActiveTab(updatedSessions[0].id)
    }
  }

  const updateChatModel = (chatId: string, modelId: string) => {
    setChatSessions(sessions =>
      sessions.map(session =>
        session.id === chatId
          ? { ...session, model: modelId }
          : session
      )
    )
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeSession) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    }

    // Add user message
    setChatSessions(sessions =>
      sessions.map(session =>
        session.id === activeSession.id
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      )
    )

    setInputMessage("")
    setIsLoading(true)

    try {
      // Make API call to chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: activeSession.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: activeSession.model,
          userMessage: inputMessage,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        model: activeSession.model
      }

      setChatSessions(sessions =>
        sessions.map(session =>
          session.id === activeSession.id
            ? { ...session, messages: [...session.messages, userMessage, aiResponse] }
            : session
        )
      )
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date(),
        model: activeSession.model
      }

      setChatSessions(sessions =>
        sessions.map(session =>
          session.id === activeSession.id
            ? { ...session, messages: [...session.messages, userMessage, errorResponse] }
            : session
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Multi-Chat Playground</h2>
          <p className="text-muted-foreground">
            Chat with multiple AI models simultaneously
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Bot className="h-3 w-3" />
            {chatSessions.length} Active Chats
          </Badge>
          <Button onClick={createNewChat} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Chat Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b">
          <TabsList className="grid grid-cols-6 w-full max-w-none">
            {chatSessions.map(session => (
              <TabsTrigger
                key={session.id}
                value={session.id}
                className="flex items-center gap-2 relative"
              >
                <span className="truncate">{session.name}</span>
                {chatSessions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(session.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {chatSessions.map(session => (
          <TabsContent key={session.id} value={session.id} className="flex-1 flex flex-col mt-0">
            {/* Model Selector */}
            <div className="flex items-center gap-4 p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span className="text-sm font-medium">Model:</span>
              </div>
              <Select value={session.model} onValueChange={(value) => updateChatModel(session.id, value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <span>{model.icon}</span>
                        <span>{model.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {model.provider}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary">
                {availableModels.find(m => m.id === session.model)?.provider}
              </Badge>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {session.messages.map(message => (
                  <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {availableModels.find(m => m.id === message.model)?.icon || "🤖"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {message.role === 'assistant' && message.model && (
                          <Badge variant="outline" className="text-xs">
                            {availableModels.find(m => m.id === message.model)?.name}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8 order-2">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && activeTab === session.id && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {availableModels.find(m => m.id === session.model)?.icon || "🤖"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
              <div className="max-w-4xl mx-auto flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}