import { NextRequest, NextResponse } from 'next/server'
import { turso } from '@/lib/turso'

export async function GET() {
  try {
    const result = await turso.execute({
      sql: `SELECT id, name, provider, capability1, capability2, capability3, capability4, tooltip, status, created_at, updated_at
            FROM models
            WHERE publish = true
            ORDER BY created_at DESC`,
      args: []
    })

    const models = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      provider: row.provider,
      capabilities: [row.capability1, row.capability2, row.capability3, row.capability4].filter(Boolean),
      tooltip: row.tooltip,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at
    }))

    return NextResponse.json(models)
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, provider, capability1, capability2, capability3, capability4, tooltip, status, publish } = body

    if (!name || !provider) {
      return NextResponse.json({ error: 'Name and provider are required' }, { status: 400 })
    }

    if (id) {
      // Update existing
      await turso.execute({
        sql: `UPDATE models
              SET name = ?, provider = ?, capability1 = ?, capability2 = ?, capability3 = ?, capability4 = ?,
                  tooltip = ?, status = ?, publish = ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?`,
        args: [name, provider, capability1 || null, capability2 || null, capability3 || null, capability4 || null, tooltip || null, status || 'available', publish || false, id]
      })
    } else {
      // Insert new
      await turso.execute({
        sql: `INSERT INTO models (name, provider, capability1, capability2, capability3, capability4, tooltip, status, publish)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [name, provider, capability1 || null, capability2 || null, capability3 || null, capability4 || null, tooltip || null, status || 'available', publish || false]
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving model:', error)
    return NextResponse.json({ error: 'Failed to save model' }, { status: 500 })
  }
}