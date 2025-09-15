"use client"

import { useState, useEffect } from "react"
import type { HubModel } from "@/lib/ai-hub-models"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, Bot } from "lucide-react"
import { ModelCard } from "@/components/models/model-card"

// Simplified model type for the UI, derived from HubModel
interface UIModel extends HubModel {
  name: string;
  // Add any additional UI-specific properties here if needed in the future
  // For now, we'll add placeholder data required by ModelCard
  capabilities: string[];
  status: 'available' | 'unavailable' | 'idle';
}

export function ModelsContent() {
  const [models, setModels] = useState<UIModel[]>([])
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

      const response = await fetch('/api/v0/ai') // Fetch from the new central hub
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`)
      }

      const modelsData: HubModel[] = await response.json()

      // Transform HubModel to UIModel format, adding placeholder data
      const transformedModels: UIModel[] = modelsData.map((model) => ({
        ...model,
        name: model.model.split('/').pop() ?? model.model, // Extract simple name
        // Placeholder data as the new API doesn't provide this.
        // This can be expanded in the hub later.
        capabilities: ["Text Generation", "Chat", "Code"],
        status: 'available'
      }))

      setModels(transformedModels)

      // Extract unique providers
      const uniqueProviders = ['all', ...new Set(transformedModels.map(m => m.provider))]
      setProviders(uniqueProviders)
    } catch (err: any) {
      console.error('Error loading models:', err)
      setError(err.message || 'Failed to load AI models.')
      setModels([])
      setProviders(['all'])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModels = models.filter(model => {
    const modelName = model.model.split('/').pop() ?? model.model;
    const matchesSearch = modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredModels.map(model => (
          <ModelCard
            key={model.id}
            name={model.name}
            provider={model.provider}
            capabilities={model.capabilities}
            
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