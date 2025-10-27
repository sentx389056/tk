import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
  const cookie = request.cookies.get('tk_user')
    if (!cookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // cookie.value contains the JSON string we stored, but older/stale cookies
    // might contain a plain string. Handle both.
    const raw = cookie.value;
  console.log('GET /api/auth/me - cookie value:', raw);

    let user: any = null
    try {
      if (raw && (raw.startsWith('{') || raw.startsWith('['))) {
        user = JSON.parse(raw)
      } else if (raw) {
        // plain string, treat as login
        user = { login: raw }
      }
    } catch (e) {
      console.error('Failed to parse user cookie', e)
      return NextResponse.json({ error: 'Invalid cookie' }, { status: 400 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error('GET /api/auth/me error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
