import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Community sharing feature not yet implemented' },
    { status: 501 }
  )
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Community content feature not yet implemented' },
    { status: 501 }
  )
}