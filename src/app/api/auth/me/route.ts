import { NextResponse, NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request as Request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error('GET /api/auth/me error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
