import { NextRequest, NextResponse } from 'next/server'
import { AIChatService, ChatSession } from '@/lib/ai-chat'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model, userMessage, temperature = 0.7 } = body

    if (!userMessage || !model) {
      return NextResponse.json(
        { error: 'Missing required fields: userMessage and model' },
        { status: 400 }
      )
    }

    // Create session object for AI service
    const session: ChatSession = {
      id: `chat_${Date.now()}`,
      messages: messages || [],
      model,
      temperature
    }

    // Get AI response
    const aiResponse = await AIChatService.sendMessage(session, userMessage)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      model,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)

    // Determine error type and provide appropriate response
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }

      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please check your billing.' },
          { status: 402 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process chat request. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Chat API endpoint',
    supportedModels: AIChatService.getAvailableModels().map(m => m.id),
    version: '1.0.0'
  })
}