import { NextRequest, NextResponse } from 'next/server'
import { AIChatService } from '@/lib/ai-chat'

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

// Real model data with current pricing (as of September 2025)
const models: AIModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Most advanced GPT model with superior reasoning and creativity",
    capabilities: ["Text Generation", "Code", "Analysis", "Creative Writing", "Multi-modal"],
    pricing: {
      inputTokens: "$0.03/1K",
      outputTokens: "$0.06/1K"
    },
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
    capabilities: ["Analysis", "Research", "Long-form Content", "Math", "Coding"],
    pricing: {
      inputTokens: "$0.015/1K",
      outputTokens: "$0.075/1K"
    },
    rating: 4.8,
    contextWindow: 200000,
    responseTime: "~1-2s",
    status: "available",
    icon: "🧠"
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Google's advanced multimodal model with strong reasoning",
    capabilities: ["Multi-modal", "Reasoning", "Code", "Creative Tasks"],
    pricing: {
      inputTokens: "$0.001/1K",
      outputTokens: "$0.002/1K"
    },
    rating: 4.6,
    contextWindow: 32768,
    responseTime: "~1-2s",
    status: "available",
    icon: "🌟"
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    description: "Fast and efficient model for everyday tasks",
    capabilities: ["Text Generation", "Analysis", "Coding", "Quick Responses"],
    pricing: {
      inputTokens: "$0.00025/1K",
      outputTokens: "$0.00125/1K"
    },
    rating: 4.5,
    contextWindow: 200000,
    responseTime: "~0.5-1s",
    status: "available",
    icon: "⚡"
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Fast and cost-effective model for most use cases",
    capabilities: ["Text Generation", "Code", "Analysis", "Conversational AI"],
    pricing: {
      inputTokens: "$0.0005/1K",
      outputTokens: "$0.0015/1K"
    },
    rating: 4.4,
    contextWindow: 16384,
    responseTime: "~1-2s",
    status: "available",
    icon: "🚀"
  },
  {
    id: "command-r",
    name: "Command R",
    provider: "Cohere",
    description: "Cohere's advanced language model for enterprise applications",
    capabilities: ["Text Generation", "Analysis", "Tool Use", "RAG"],
    pricing: {
      inputTokens: "$0.00015/1K",
      outputTokens: "$0.0006/1K"
    },
    rating: 4.3,
    contextWindow: 128000,
    responseTime: "~1-2s",
    status: "available",
    icon: "🏢"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let filteredModels = models

    // Filter by provider
    if (provider) {
      filteredModels = filteredModels.filter(model =>
        model.provider.toLowerCase() === provider.toLowerCase()
      )
    }

    // Filter by status
    if (status) {
      filteredModels = filteredModels.filter(model => model.status === status)
    }

    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase()
      filteredModels = filteredModels.filter(model =>
        model.name.toLowerCase().includes(searchLower) ||
        model.description.toLowerCase().includes(searchLower) ||
        model.capabilities.some(cap => cap.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json({
      success: true,
      models: filteredModels,
      total: filteredModels.length,
      providers: [...new Set(models.map(m => m.provider))],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Models API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelId, testMessage = "Hello, can you help me with a simple task?" } = body

    if (!modelId) {
      return NextResponse.json(
        { error: 'Missing required field: modelId' },
        { status: 400 }
      )
    }

    // Check if model exists
    const model = models.find(m => m.id === modelId)
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Test the model with a simple message
    const session = {
      id: `test_${Date.now()}`,
      messages: [],
      model: modelId,
      temperature: 0.7
    }

    const testResponse = await AIChatService.sendMessage(session, testMessage)

    return NextResponse.json({
      success: true,
      model: modelId,
      testMessage,
      response: testResponse,
      responseLength: testResponse.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Model test error:', error)

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Model not supported or unavailable' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to test model. Please try again.' },
      { status: 500 }
    )
  }
}