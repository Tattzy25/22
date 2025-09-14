import { NextRequest, NextResponse } from 'next/server'

interface SharedContent {
  id: string
  userId: string
  type: 'character' | 'automation' | 'image' | 'music' | 'widget'
  title: string
  description: string
  content: Record<string, unknown> // The actual content data
  tags: string[]
  isPublic: boolean
  likes: number
  views: number
  createdAt: string
  updatedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      title,
      description,
      content,
      tags = [],
      isPublic = true
    } = body

    // Validate required fields
    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, content' },
        { status: 400 }
      )
    }

    // Validate content type
    const validTypes = ['character', 'automation', 'image', 'music', 'widget']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid content type. Supported: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // For now, simulate saving to database
    // In a real implementation, this would save to Supabase
    const sharedContent: SharedContent = {
      id: `share_${Date.now()}`,
      userId: 'user_123', // Would come from auth
      type,
      title: title.trim(),
      description: description?.trim() || '',
      content,
      tags: Array.isArray(tags) ? tags : [],
      isPublic,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      content: sharedContent,
      shareUrl: `https://bridgit-ai.com/community/${sharedContent.id}`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Community share API error:', error)

    return NextResponse.json(
      { error: 'Failed to share content. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // For now, return mock community content
    // In a real implementation, this would query Supabase
    const mockContent: SharedContent[] = [
      {
        id: 'share_1',
        userId: 'user_456',
        type: 'character',
        title: 'Creative Writing Assistant',
        description: 'A helpful AI character for creative writing tasks',
        content: { personality: 'creative', traits: ['imaginative', 'helpful'] },
        tags: ['writing', 'creative', 'assistant'],
        isPublic: true,
        likes: 42,
        views: 156,
        createdAt: '2025-09-10T10:00:00Z',
        updatedAt: '2025-09-10T10:00:00Z'
      },
      {
        id: 'share_2',
        userId: 'user_789',
        type: 'automation',
        title: 'Content Generation Workflow',
        description: 'Automated content creation pipeline',
        content: { steps: ['research', 'write', 'edit'] },
        tags: ['automation', 'content', 'workflow'],
        isPublic: true,
        likes: 28,
        views: 89,
        createdAt: '2025-09-12T14:30:00Z',
        updatedAt: '2025-09-12T14:30:00Z'
      }
    ]

    let filteredContent = mockContent

    // Filter by type
    if (type) {
      filteredContent = filteredContent.filter(item => item.type === type)
    }

    // Filter by tag
    if (tag) {
      filteredContent = filteredContent.filter(item =>
        item.tags.includes(tag)
      )
    }

    // Search by title or description
    if (search) {
      const searchLower = search.toLowerCase()
      filteredContent = filteredContent.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const paginatedContent = filteredContent.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      content: paginatedContent,
      total: filteredContent.length,
      limit,
      offset,
      hasMore: offset + limit < filteredContent.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Community content fetch error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch community content' },
      { status: 500 }
    )
  }
}