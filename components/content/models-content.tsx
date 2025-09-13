"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Bot, Zap, Star, ExternalLink } from "lucide-react"

interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  pricing: string
  rating: number
  image: string
  contextWindow: string
  responseTime: string
}

const models: AIModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Most advanced GPT model with superior reasoning and creativity",
    capabilities: ["Text Generation", "Code", "Analysis", "Creative Writing"],
    pricing: "$0.03/1K tokens",
    rating: 4.9,
    image: "🤖",
    contextWindow: "128K tokens",
    responseTime: "~2-3s"
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Most capable Claude model for complex tasks",
    capabilities: ["Analysis", "Research", "Long-form Content", "Math"],
    pricing: "$0.015/1K tokens",
    rating: 4.8,
    image: "🧠",
    contextWindow: "200K tokens",
    responseTime: "~1-2s"
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Multimodal AI with text and image understanding",
    capabilities: ["Multimodal", "Code", "Translation", "Analysis"],
    pricing: "$0.001/1K chars",
    rating: 4.7,
    image: "🌟",
    contextWindow: "32K tokens",
    responseTime: "~1-2s"
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    description: "Fast and efficient for everyday tasks",
    capabilities: ["Chat", "Writing", "Analysis", "Coding"],
    pricing: "$0.00025/1K tokens",
    rating: 4.6,
    image: "⚡",
    contextWindow: "200K tokens",
    responseTime: "~0.5-1s"
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Fast and cost-effective for most use cases",
    capabilities: ["Chat", "Writing", "Analysis", "Code"],
    pricing: "$0.002/1K tokens",
    rating: 4.5,
    image: "🚀",
    contextWindow: "16K tokens",
    responseTime: "~0.5-1s"
  },
  {
    id: "command-r",
    name: "Command R",
    provider: "Cohere",
    description: "Enterprise-focused AI with strong reasoning",
    capabilities: ["Business", "Analysis", "Research", "Automation"],
    pricing: "$0.002/1K tokens",
    rating: 4.4,
    image: "🏢",
    contextWindow: "128K tokens",
    responseTime: "~1-2s"
  }
]

export function ModelsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("all")
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvider = selectedProvider === "all" || model.provider.toLowerCase() === selectedProvider
    return matchesSearch && matchesProvider
  })

  const providers = ["all", ...Array.from(new Set(models.map(m => m.provider.toLowerCase())))]

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
          <Card key={model.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{model.image}</div>
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
                <span className="font-medium text-green-600">{model.pricing}</span>
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
                        <span className="text-2xl">{model.image}</span>
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
                          <p className="text-green-600 font-medium">{model.pricing}</p>
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