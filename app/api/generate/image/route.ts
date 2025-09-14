import { NextRequest, NextResponse } from 'next/server'
import { MediaGenerationService } from '@/lib/media-generation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      prompt,
      model = 'dall-e-3'
    } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt must be less than 1000 characters' },
        { status: 400 }
      )
    }

    // Validate model
    if (!['dall-e-3', 'dall-e-2'].includes(model)) {
      return NextResponse.json(
        { error: 'Invalid model. Supported: dall-e-3, dall-e-2' },
        { status: 400 }
      )
    }

    // Generate image using the service
    const generation = await MediaGenerationService.generateImage(prompt.trim(), model)

    return NextResponse.json({
      success: true,
      generation,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Image generation API error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('content policy') || error.message.includes('safety')) {
        return NextResponse.json(
          { error: 'Content policy violation. Please modify your prompt.' },
          { status: 400 }
        )
      }

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
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'DALL-E Image Generation API',
    supportedModels: ['dall-e-3', 'dall-e-2'],
    modelDetails: {
      'dall-e-3': {
        sizes: ['1024x1024'],
        quality: 'higher quality, more detailed'
      },
      'dall-e-2': {
        sizes: ['256x256', '512x512', '1024x1024'],
        quality: 'standard quality'
      }
    },
    maxPromptLength: 1000,
    version: '1.0.0'
  })
}