import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifySessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { guestName?: unknown; attending?: unknown }
    const guestName = typeof body.guestName === 'string' ? body.guestName.trim() : ''
    const attending = body.attending

    if (!guestName) {
      return NextResponse.json({ error: 'guestName is required' }, { status: 400 })
    }
    if (typeof attending !== 'boolean') {
      return NextResponse.json({ error: 'attending must be a boolean' }, { status: 400 })
    }

    const response = await db.rSVPResponse.create({
      data: { guestName, attending },
    })
    return NextResponse.json(response, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save RSVP. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin_session')?.value

  if (!sessionCookie || !verifySessionCookie(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const responses = await db.rSVPResponse.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const attending = responses.filter((r) => r.attending).length
  return NextResponse.json({
    responses,
    summary: {
      total: responses.length,
      attending,
      notAttending: responses.length - attending,
    },
  })
}
