import { NextResponse } from 'next/server'
import { databaseService, Conversation, Generation } from '@/lib/database'
import { authService } from '@/lib/auth'

interface Activity {
  id: string
  type: string
  title: string
  timestamp: string
  status: string
}

export async function GET() {
  try {
    const user = await authService.getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Load user's recent activity and stats
    const [conversations, generations, stats] = await Promise.all([
      databaseService.getUserConversations(user.id, 5),
      databaseService.getUserGenerations(user.id, undefined, 5),
      databaseService.getStats(user.id)
    ])

    // Transform data for display
    const activities: Activity[] = []

    conversations.forEach((conv: Conversation) => {
      activities.push({
        id: conv.id,
        type: 'chat',
        title: `Chat with ${conv.model || 'AI'}`,
        timestamp: conv.created_at,
        status: 'completed'
      })
    })

    generations.forEach((gen: Generation) => {
      activities.push({
        id: gen.id,
        type: gen.type === 'image' ? 'image' : gen.type === 'music' ? 'music' : 'character',
        title: gen.prompt?.substring(0, 50) + '...' || 'Generated content',
        timestamp: gen.created_at,
        status: 'completed'
      })
    })

    // Sort activities by timestamp
    activities.sort((a: Activity, b: Activity) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      activities: activities.slice(0, 10), // Limit to 10 most recent
      stats
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}