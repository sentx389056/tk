import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect /securearea routes
  if (request.nextUrl.pathname.startsWith('/securearea')) {
    const cookie = request.cookies.get('tk_user')

    if (!cookie) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/securearea/:path*'
}
