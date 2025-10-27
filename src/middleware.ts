import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of paths that require authentication
const PROTECTED_PATHS = [
  '/securearea',
  '/api/standards/add',
  '/api/meetings/add',
  '/api/protocols/add',
  '/api/provisions/add'
];

export function middleware(request: NextRequest) {
  // Check if the path requires authentication
  const isProtectedPath = PROTECTED_PATHS.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Check for tk_user cookie
    const tkUser = request.cookies.get('tk_user');

    if (!tkUser || !tkUser.value) {
      // For API routes, return 401 response
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ 
          error: 'Пожалуйста, войдите в систему', 
          code: 'AUTH_REQUIRED' 
        }, { status: 401 });
      }
      
      // For page routes, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify cookie contains valid JSON with user data
      const userData = JSON.parse(tkUser.value);
      if (!userData?.id) {
        throw new Error('Invalid user data');
      }
    } catch (e) {
      // Clear invalid cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('tk_user');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/securearea/:path*',
    '/api/:path*'
  ]
}