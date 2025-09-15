import { NextRequest, NextResponse } from 'next/server'
import { AIChatService, ChatSession } from '@/lib/ai-chat'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model, userMessage, temperature = 0.7, personality, character } = body

    if (!userMessage || !model) {
      return NextResponse.json(
        { error: 'Missing required fields: userMessage and model' },
        { status: 400 }
      )
    }

    // Create system message for character personality
    const systemMessage = personality && character ? {
      role: 'system' as const,
      content: `You are ${character}. ${personality}. Always respond in character and maintain this personality throughout the conversation. Be helpful while staying true to your character.`
    } : null

    // Prepare messages with system prompt if character is specified
    const chatMessages = [
      ...(systemMessage ? [systemMessage] : []),
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    // Create session object for AI service
    const session: ChatSession = {
      id: `chat_${Date.now()}`,
      messages: chatMessages,
      model,
      temperature
    }

    try {
      // Get AI response
      const aiResponse = await AIChatService.sendMessage(session, userMessage)

      return NextResponse.json({
        success: true,
        response: aiResponse,
        model,
        character: character || 'Assistant',
        timestamp: new Date().toISOString()
      })
    } catch (aiError) {
      console.error('AI Service error:', aiError)
      
      // Fallback response if AI service fails
      const fallbackResponses = [
        "I apologize, but I'm having trouble processing your request right now. Could you please try again?",
        "I'm experiencing some technical difficulties at the moment. Please try your message again.",
        "Sorry, I couldn't process that request. Please try again in a moment.",
        "I'm having some connectivity issues. Could you please resend your message?"
      ]
      
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      
      return NextResponse.json({
        success: true,
        response: fallbackResponse,
        model,
        character: character || 'Assistant',
        timestamp: new Date().toISOString(),
        fallback: true
      })
    }

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
    message: 'Multi-Chat API endpoint - Real functionality enabled',
    supportedModels: AIChatService.getAvailableModels().map(m => ({ 
      id: m.id, 
      name: m.name, 
      provider: m.provider 
    })),
    features: [
      'Character personalities',
      'Real AI responses',
      'Multiple simultaneous chats',
      'Fallback responses'
    ],
    version: '2.0.0'
  })
}