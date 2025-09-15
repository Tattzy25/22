import { NextRequest, NextResponse } from 'next/server'
import { turso } from '@/lib/turso'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await turso.execute({
      sql: `SELECT id, name, provider, capability1, capability2, capability3, capability4, tooltip, status, publish, created_at, updated_at
            FROM models
            WHERE id = ?`,
      args: [id]
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    const row = result.rows[0]
    const model = {
      id: row.id,
      name: row.name,
      provider: row.provider,
      capability1: row.capability1,
      capability2: row.capability2,
      capability3: row.capability3,
      capability4: row.capability4,
      tooltip: row.tooltip,
      status: row.status,
      publish: row.publish,
      created_at: row.created_at,
      updated_at: row.updated_at
    }

    return NextResponse.json(model)
  } catch (error) {
    console.error('Error fetching model:', error)
    return NextResponse.json({ error: 'Failed to fetch model' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { publish } = body

    if (typeof publish !== 'boolean') {
      return NextResponse.json({ error: 'publish must be a boolean' }, { status: 400 })
    }

    await turso.execute({
      sql: `UPDATE models SET publish = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [publish, id]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating model:', error)
    return NextResponse.json({ error: 'Failed to update model' }, { status: 500 })
  }
}