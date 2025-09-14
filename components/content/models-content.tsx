"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Bot, Zap, Star, ExternalLink, Loader2, Settings, Palette, Type, Image, Eye, X } from "lucide-react"

interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  pricing: {
    inputTokens: string
    outputTokens: string
    monthlyFee?: string
  }
  rating: number
  contextWindow: number
  responseTime: string
  status: 'available' | 'beta' | 'deprecated'
  icon: string
}

export function ModelsContent() {
  const [models, setModels] = useState<AIModel[]>([])
  const [providers, setProviders] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Admin panel state
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  
  // Card customization state
  const [cardDesign, setCardDesign] = useState({
    // Typography
    titleFont: 'Inter',
    titleSize: '18px',
    titleColor: '#1f2937',
    titleWeight: '600',
    
    subtitleFont: 'Inter',
    subtitleSize: '14px',
    subtitleColor: '#6b7280',
    
    descriptionFont: 'Inter',
    descriptionSize: '14px',
    descriptionColor: '#4b5563',
    
    // Layout
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    borderColor: '#e5e7eb',
    borderWidth: '1px',
    
    // Spacing
    padding: '16px',
    
    // Effects
    shadow: 'shadow-md',
    hoverEffect: true,
    
    // Content placeholders
    placeholders: {
      icon: '🤖',
      title: 'Model Name',
      subtitle: 'Provider',
      description: 'Model description goes here...',
      rating: '4.5',
      pricing: '$0.02/1K in',
      responseTime: '~2-3s',
      capabilities: ['Text', 'Code', 'Analysis']
    }
  })

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/models')
      if (response.ok) {
        const data = await response.json()
        setModels(data.models || [])
        setProviders(['all', ...(data.providers || [])])
      } else if (response.status === 404 || response.status >= 500) {
        // API not available - show demo data
        const demoModels = [
          {
            id: "gpt-4",
            name: "GPT-4",
            provider: "OpenAI",
            description: "Most advanced GPT model with superior reasoning and creativity",
            capabilities: ["Text Generation", "Code", "Analysis", "Creative Writing"],
            pricing: { inputTokens: "$0.03/1K", outputTokens: "$0.06/1K" },
            rating: 4.9,
            contextWindow: 128000,
            responseTime: "~2-3s",
            status: "available",
            icon: "🤖"
          },
          {
            id: "claude-3-opus",
            name: "Claude 3 Opus",
            provider: "Anthropic",
            description: "Most capable Claude model for complex tasks and analysis",
            capabilities: ["Analysis", "Research", "Long-form Content", "Math"],
            pricing: { inputTokens: "$0.015/1K", outputTokens: "$0.075/1K" },
            rating: 4.8,
            contextWindow: 200000,
            responseTime: "~2-4s",
            status: "available",
            icon: "🧠"
          },
          {
            id: "gemini-pro",
            name: "Gemini Pro",
            provider: "Google",
            description: "Google's advanced multimodal model",
            capabilities: ["Text Generation", "Code", "Analysis", "Multi-modal"],
            pricing: { inputTokens: "$0.00025/1K", outputTokens: "$0.0005/1K" },
            rating: 4.7,
            contextWindow: 1000000,
            responseTime: "~1-2s",
            status: "available",
            icon: "🚀"
          },
          {
            id: "command-r",
            name: "Command R",
            provider: "Cohere",
            description: "Cohere's advanced language model for enterprise applications",
            capabilities: ["Text Generation", "Analysis", "Tool Use"],
            pricing: { inputTokens: "$0.00015/1K", outputTokens: "$0.0006/1K" },
            rating: 4.3,
            contextWindow: 128000,
            responseTime: "~1-2s",
            status: "available",
            icon: "🏢"
          }
        ]
        setModels(demoModels)
        setProviders(['all', 'OpenAI', 'Anthropic', 'Google', 'Cohere'])
      } else {
        setError('Failed to load models')
      }
    } catch (err) {
      // Network error - show demo data
      const demoModels = [
        {
          id: "gpt-4",
          name: "GPT-4",
          provider: "OpenAI",
          description: "Most advanced GPT model with superior reasoning and creativity",
          capabilities: ["Text Generation", "Code", "Analysis", "Creative Writing"],
          pricing: { inputTokens: "$0.03/1K", outputTokens: "$0.06/1K" },
          rating: 4.9,
          contextWindow: 128000,
          responseTime: "~2-3s",
          status: "available",
          icon: "🤖"
        },
        {
          id: "claude-3-opus",
          name: "Claude 3 Opus",
          provider: "Anthropic",
          description: "Most capable Claude model for complex tasks and analysis",
          capabilities: ["Analysis", "Research", "Long-form Content", "Math"],
          pricing: { inputTokens: "$0.015/1K", outputTokens: "$0.075/1K" },
          rating: 4.8,
          contextWindow: 200000,
          responseTime: "~2-4s",
          status: "available",
          icon: "🧠"
        }
      ]
      setModels(demoModels)
      setProviders(['all', 'OpenAI', 'Anthropic'])
      console.error('Error loading models:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesProvider = selectedProvider === "all" || model.provider.toLowerCase() === selectedProvider
    return matchesSearch && matchesProvider
  })

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading AI models...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <Button onClick={loadModels} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Models Marketplace</h2>
          <p className="text-muted-foreground">
            Discover and test AI models from leading providers
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Bot className="h-3 w-3" />
          {models.length} Models Available
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map(provider => (
              <SelectItem key={provider} value={provider}>
                {provider === "all" ? "All Providers" : provider.charAt(0).toUpperCase() + provider.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Models Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredModels.map(model => (
          <Card key={model.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{model.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription className="text-sm">{model.provider}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{model.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {model.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {model.capabilities.slice(0, 3).map(capability => (
                  <Badge key={capability} variant="secondary" className="text-xs">
                    {capability}
                  </Badge>
                ))}
                {model.capabilities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{model.capabilities.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-green-600">
                  {model.pricing.inputTokens} in / {model.pricing.outputTokens} out
                </span>
                <span className="text-muted-foreground">{model.responseTime}</span>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <span className="text-2xl">{model.icon}</span>
                        {model.name}
                        <Badge variant="secondary">{model.provider}</Badge>
                      </DialogTitle>
                      <DialogDescription>{model.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Context Window:</span>
                          <p className="text-muted-foreground">{model.contextWindow}</p>
                        </div>
                        <div>
                          <span className="font-medium">Response Time:</span>
                          <p className="text-muted-foreground">{model.responseTime}</p>
                        </div>
                        <div>
                          <span className="font-medium">Pricing:</span>
                          <p className="text-green-600 font-medium">
                            {model.pricing.inputTokens} input / {model.pricing.outputTokens} output
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Rating:</span>
                          <p className="text-muted-foreground">{model.rating}/5.0</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium">Capabilities:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {model.capabilities.map(capability => (
                            <Badge key={capability} variant="secondary">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1">
                          <Zap className="h-4 w-4 mr-2" />
                          Try Model
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Documentation
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" className="flex-1">
                  <Zap className="h-4 w-4 mr-2" />
                  Try Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No models found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}