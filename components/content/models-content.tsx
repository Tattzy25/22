"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Bot, Loader2 } from "lucide-react"
import { ModelCard } from "@/components/models/model-card"

interface APIModel {
  id: string
  name: string
  provider: string
  capabilities: string[]
  tooltip?: string
  status: string
  created_at: string
  updated_at: string
}

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
}

export function ModelsContent() {
  const [models, setModels] = useState<AIModel[]>([])
  const [providers, setProviders] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/models')
      if (!response.ok) {
        throw new Error('Failed to fetch models')
      }

      const modelsData = await response.json()

      // Transform to AIModel format
      const transformedModels: AIModel[] = modelsData.map((model: APIModel) => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        description: model.tooltip || '',
        capabilities: model.capabilities,
        pricing: { inputTokens: '', outputTokens: '' }, // Not in new schema
        rating: 4.5, // Default
        contextWindow: 0, // Not in new schema
        responseTime: '', // Not in new schema
        status: model.status === 'available' ? 'available' : 'unavailable' as const
      }))

      setModels(transformedModels)

      // Extract unique providers
      const uniqueProviders = ['all', ...new Set(transformedModels.map(m => m.provider))]
      setProviders(uniqueProviders)
    } catch (err) {
      console.error('Error loading models:', err)
      // Fallback to demo data
      const demoModels: AIModel[] = [
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
          status: "available" as const
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
          status: "available" as const
        }
      ]
      setModels(demoModels)
      setProviders(['all', 'OpenAI', 'Anthropic'])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.capabilities.some((cap: string) => cap.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <ModelCard
            key={model.id}
            name={model.name}
            provider={model.provider}
            capabilities={model.capabilities}
            tooltip={model.description}
            status={model.status === 'available' ? 'available' : 'unavailable'}
            onTry={() => {
              // TODO: Implement try model functionality
              console.log('Try model:', model.name)
            }}
          />
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