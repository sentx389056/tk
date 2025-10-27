import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Try to get user info from the cookie before clearing it
    const cookies = request.headers.get('cookie');
    let userId: number | null = null;
    
    if (cookies) {
      const tkUserCookie = cookies.split(';').find(c => c.trim().startsWith('tk_user='));
      if (tkUserCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(tkUserCookie.split('=')[1]));
          userId = userData.id;
        } catch (e) {
          console.error('Error parsing user cookie:', e);
        }
      }
    }

    // Create logout log if we have a user ID
    if (userId) {
      try {
        await prisma.log.create({
          data: {
            type: 'AUTH',
            action: 'ВЫХОД',
            userId: userId,
            metadata: JSON.stringify({
              success: true,
              timestamp: new Date().toISOString()
            })
          }
        });
      } catch (e) {
        // Log error but continue with logout
        console.error('Failed to create logout log:', e);
      }
    }

    const response = NextResponse.json({ success: true });
  
    // Clear the auth cookie
    response.cookies.set('tk_user', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0
    });

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    
    // Still try to clear the cookie even if there was an error
    const response = NextResponse.json({ 
      error: "Failed to logout properly", 
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined 
    }, { status: 500 });
    
    response.cookies.set('tk_user', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0
    });

    return response;
  }
}