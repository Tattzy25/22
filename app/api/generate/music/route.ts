import { NextRequest, NextResponse } from 'next/server'
import { MediaGenerationService } from '@/lib/media-generation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, genre, mood, duration = 180 } = body

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: 'Description must be less than 500 characters' },
        { status: 400 }
      )
    }

    // Validate duration (30 seconds to 10 minutes)
    if (duration < 30 || duration > 600) {
      return NextResponse.json(
        { error: 'Duration must be between 30 and 600 seconds' },
        { status: 400 }
      )
    }

    // Generate music using the service
    const generation = await MediaGenerationService.generateMusic(description.trim())

    return NextResponse.json({
      success: true,
      generation: {
        ...generation,
        requestedDuration: duration,
        genre,
        mood
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Music generation API error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('content policy') || error.message.includes('safety')) {
        return NextResponse.json(
          { error: 'Content policy violation. Please modify your description.' },
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
      { error: 'Failed to generate music. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Music Generation API',
    supportedGenres: [
      'electronic', 'rock', 'pop', 'jazz', 'classical', 'hip-hop', 'ambient',
      'folk', 'country', 'r&b', 'reggae', 'blues', 'metal', 'punk', 'funk'
    ],
    supportedMoods: [
      'happy', 'sad', 'energetic', 'calm', 'mysterious', 'romantic',
      'epic', 'melancholic', 'upbeat', 'dreamy', 'dark', 'peaceful'
    ],
    durationRange: {
      min: 30, // seconds
      max: 600, // seconds (10 minutes)
      default: 180 // seconds (3 minutes)
    },
    maxDescriptionLength: 500,
    version: '1.0.0',
    note: 'Music generation uses AI to create detailed prompts for high-quality music synthesis'
  })
}