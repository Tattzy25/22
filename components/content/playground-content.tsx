"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Plus, Bot, Settings, X } from "lucide-react"
import React from 'react'
import styled from 'styled-components'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
}

interface Character {
  id: string
  name: string
  description: string
  personality: string
  avatar: string
  model: string
}

interface PlaygroundSession {
  id: string
  name: string
  character: Character
  messages: Message[]
  inputMessage: string
  isLoading: boolean
}

const AVAILABLE_CHARACTERS: Character[] = [
  {
    id: "assistant",
    name: "Assistant",
    description: "Helpful AI assistant",
    personality: "Professional and helpful",
    avatar: "🤖",
    model: "gpt-4"
  },
  {
    id: "creative",
    name: "Creative Writer",
    description: "Creative storyteller and writer",
    personality: "Imaginative and artistic",
    avatar: "✍️",
    model: "claude-3-opus"
  },
  {
    id: "analyst",
    name: "Data Analyst",
    description: "Technical data analyst",
    personality: "Analytical and precise",
    avatar: "📊",
    model: "gemini-pro"
  },
  {
    id: "teacher",
    name: "Teacher",
    description: "Patient educator",
    personality: "Patient and educational",
    avatar: "👩‍🏫",
    model: "gpt-4"
  },
  {
    id: "coder",
    name: "Programmer",
    description: "Expert software developer",
    personality: "Technical and logical",
    avatar: "💻",
    model: "claude-3-opus"
  },
  {
    id: "philosopher",
    name: "Philosopher",
    description: "Deep thinker and questioner",
    personality: "Thoughtful and contemplative",
    avatar: "🤔",
    model: "gemini-pro"
  }
]

// Your EXACT styled card component adapted for chat UI
const ChatCard = ({ session, onSendMessage, onDeleteChat, onUpdateInput, chatSessions }: {
  session: PlaygroundSession
  onSendMessage: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onUpdateInput: (chatId: string, value: string) => void
  chatSessions: PlaygroundSession[]
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendMessage(session.id)
    }
  }

  return (
    <StyledWrapper>
      <div className="card-container">
        <div className="title-card">
          <div className="chat-info">
            <span className="character-avatar">{session.character.avatar}</span>
            <p>{session.character.name}</p>
          </div>
          <div className="status-icons">
            <div className="status-dot"></div>
            {chatSessions.length > 1 && (
              <button 
                className="delete-btn"
                onClick={() => onDeleteChat(session.id)}
                title="Delete chat"
                aria-label="Delete chat"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="card-content">
          <p className="title">{session.character.description}</p>
          <div className="messages-area">
            <ScrollArea className="h-full">
              <div className="messages-container">
                {session.messages.map(message => (
                  <div key={message.id} className={`message ${message.role}`}>
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="timestamp">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {session.isLoading && (
                  <div className="message assistant">
                    <div className="message-content loading">
                      <div className="typing-indicator">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="input-area">
            <Textarea
              value={session.inputMessage}
              onChange={(e) => onUpdateInput(session.id, e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="chat-input"
              disabled={session.isLoading}
            />
            <button 
              className="card-btn"
              onClick={() => onSendMessage(session.id)}
              disabled={session.isLoading || !session.inputMessage.trim()}
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card-container {
    width: 100%;
    max-width: 380px;
    background: linear-gradient(
      to top right,
      #975af4,
      #2f7cf8 40%,
      #78aafa 65%,
      #934cff 100%
    );
    padding: 4px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    height: 550px;
  }
  
  .card-container .title-card {
    display: flex;
    align-items: center;
    padding: 16px 18px;
    justify-content: space-between;
    color: #fff;
  }
  
  .chat-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .character-avatar {
    font-size: 24px;
  }
  
  .card-container .title-card p {
    font-size: 16px;
    font-weight: 600;
    font-style: italic;
    text-shadow: 2px 2px 6px #2975ee;
    margin: 0;
  }
  
  .status-icons {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .status-dot {
    width: 12px;
    height: 12px;
    background-color: #00ff88;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  .delete-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .delete-btn:hover {
    background: rgba(255, 68, 68, 0.8);
    transform: scale(1.1);
  }

  .card-container .card-content {
    width: 100%;
    height: 100%;
    background-color: #161a20;
    border-radius: 30px;
    color: #838383;
    font-size: 12px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
  }
  
  .card-container .card-content .title {
    font-weight: 600;
    color: #bab9b9;
    margin: 0;
    font-size: 14px;
  }
  
  .messages-area {
    flex: 1;
    overflow: hidden;
    margin: 8px 0;
  }
  
  .messages-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-right: 8px;
  }
  
  .message {
    display: flex;
    flex-direction: column;
  }
  
  .message.user {
    align-items: flex-end;
  }
  
  .message.assistant {
    align-items: flex-start;
  }
  
  .message-content {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 16px;
    word-wrap: break-word;
  }
  
  .message.user .message-content {
    background: linear-gradient(135deg, #975af4, #2f7cf8);
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  
  .message.assistant .message-content {
    background: #2a2f3a;
    color: #e5e5e5;
    border-bottom-left-radius: 4px;
  }
  
  .message-content p {
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    white-space: pre-wrap;
  }
  
  .timestamp {
    font-size: 10px;
    opacity: 0.7;
    margin-top: 4px;
    display: block;
  }
  
  .message.user .timestamp {
    text-align: right;
  }
  
  .loading {
    background: #2a2f3a !important;
  }
  
  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 4px 0;
  }
  
  .typing-indicator div {
    width: 6px;
    height: 6px;
    background-color: #838383;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
  }
  
  .typing-indicator div:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator div:nth-child(2) { animation-delay: -0.16s; }
  
  .input-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .chat-input {
    background: #2a2f3a !important;
    border: 1px solid #404040 !important;
    color: #e5e5e5 !important;
    border-radius: 12px !important;
    padding: 10px 14px !important;
    font-size: 13px !important;
    resize: none !important;
    min-height: 44px !important;
    max-height: 80px !important;
  }
  
  .chat-input:focus {
    border-color: #975af4 !important;
    box-shadow: 0 0 0 2px rgba(151, 90, 244, 0.2) !important;
  }
  
  .chat-input::placeholder {
    color: #838383 !important;
  }
  
  .card-container .card-content .card-btn {
    background: linear-gradient(
      4deg,
      #975af4,
      #2f7cf8 40%,
      #78aafa 65%,
      #934cff 100%
    );
    padding: 12px 16px;
    border: none;
    width: 100%;
    border-radius: 12px;
    color: white;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .card-container .card-content .card-btn:hover:not(:disabled) {
    color: #ffffff;
    text-shadow: 0 0 8px #fff;
    transform: scale(1.03);
  }
  
  .card-container .card-content .card-btn:active {
    transform: scale(1);
  }
  
  .card-container .card-content .card-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes typing {
    0%, 80%, 100% { 
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% { 
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const DEFAULT_MODELS = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" }
]

export function PlaygroundContent() {
  const [chatSessions, setChatSessions] = useState<PlaygroundSession[]>([
    {
      id: "1",
      name: "Chat 1",
      character: AVAILABLE_CHARACTERS[0],
      messages: [
        {
          id: "1",
          role: "assistant",
          content: `Hello! I'm ${AVAILABLE_CHARACTERS[0].name}. ${AVAILABLE_CHARACTERS[0].description}. How can I help you today?`,
          timestamp: new Date(),
          model: AVAILABLE_CHARACTERS[0].model
        }
      ],
      inputMessage: "",
      isLoading: false
    }
  ])
  const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      const response = await fetch('/api/models')
      if (response.ok) {
        const data = await response.json()
        setAvailableModels(data.models?.map((model: { id: string; name: string; provider: string }) => ({
          id: model.id,
          name: model.name,
          provider: model.provider
        })) || DEFAULT_MODELS)
      }
    } catch (error) {
      console.error('Failed to load models:', error)
      // Keep default models on error
    }
  }

  const createNewChat = (character: Character = AVAILABLE_CHARACTERS[0]) => {
    if (chatSessions.length >= 6) {
      alert('Maximum 6 chats allowed')
      return
    }

    const newSession: PlaygroundSession = {
      id: Date.now().toString(),
      name: `${character.name} ${chatSessions.length + 1}`,
      character: character,
      messages: [
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Hello! I'm ${character.name}. ${character.description}. How can I help you today?`,
          timestamp: new Date(),
          model: character.model
        }
      ],
      inputMessage: "",
      isLoading: false
    }

    setChatSessions([...chatSessions, newSession])
  }

  const deleteChat = (chatId: string) => {
    if (chatSessions.length === 1) return // Don't delete the last chat
    setChatSessions(chatSessions.filter(session => session.id !== chatId))
  }

  const updateInputMessage = (chatId: string, message: string) => {
    setChatSessions(sessions =>
      sessions.map(session =>
        session.id === chatId
          ? { ...session, inputMessage: message }
          : session
      )
    )
  }

  const sendMessage = async (chatId: string) => {
    const session = chatSessions.find(s => s.id === chatId)
    if (!session || !session.inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: session.inputMessage,
      timestamp: new Date()
    }

    // Add user message and clear input
    setChatSessions(sessions =>
      sessions.map(s =>
        s.id === chatId
          ? { 
              ...s, 
              messages: [...s.messages, userMessage], 
              inputMessage: "",
              isLoading: true 
            }
          : s
      )
    )

    try {
      // Make real API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: session.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: session.character.model,
          userMessage: session.inputMessage,
          personality: session.character.personality,
          character: session.character.name,
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
        content: data.response || data.message || "I apologize, but I couldn't process your request at the moment.",
        timestamp: new Date(),
        model: session.character.model
      }

      setChatSessions(sessions =>
        sessions.map(s =>
          s.id === chatId
            ? { 
                ...s, 
                messages: [...s.messages, aiResponse],
                isLoading: false 
              }
            : s
        )
      )
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date(),
        model: session.character.model
      }

      setChatSessions(sessions =>
        sessions.map(s =>
          s.id === chatId
            ? { 
                ...s, 
                messages: [...s.messages, errorResponse],
                isLoading: false 
              }
            : s
        )
      )
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Multi-Chat Playground</h2>
          <p className="text-muted-foreground">
            Chat with multiple AI characters simultaneously
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Bot className="h-3 w-3" />
            {chatSessions.length}/6 Active Chats
          </Badge>
          <Button onClick={() => setShowSettings(true)} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => createNewChat()} size="sm" disabled={chatSessions.length >= 6}>
            <Plus className="h-4 w-4 mr-2" />
            Add Chat
          </Button>
        </div>
      </div>

      {/* Chat Grid - Using Your EXACT Styled Card Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatSessions.map(session => (
          <ChatCard
            key={session.id}
            session={session}
            onSendMessage={sendMessage}
            onDeleteChat={deleteChat}
            onUpdateInput={updateInputMessage}
            chatSessions={chatSessions}
          />
        ))}
      </div>

      {/* Settings Overlay */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Character Selection</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {AVAILABLE_CHARACTERS.map(character => (
              <Card key={character.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{character.avatar}</span>
                    {character.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{character.description}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">{character.personality}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {availableModels.find(m => m.id === character.model)?.name || character.model}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        createNewChat(character)
                        setShowSettings(false)
                      }}
                      disabled={chatSessions.length >= 6}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}