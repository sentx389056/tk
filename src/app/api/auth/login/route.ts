import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log("[Login] Starting login attempt...");
    
    // Parse request body
    const body = await request.json();
    console.log("[Login] Request body:", { login: body.login });

    const login = String(body.login || "").trim();
    const password = String(body.password || "");

    if (!login || !password) {
      console.log("[Login] Missing credentials");
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    console.log("[Login] Looking up user:", login);

    // Basic user lookup first
    const user = await prisma.user.findUnique({
      where: { login },
      select: {
        id: true,
        login: true,
        password: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log("[Login] User lookup result:", user ? { id: user.id, login: user.login } : "not found");

    if (!user) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    // Check password
    console.log("[Login] Checking password");
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      console.log("[Login] Password mismatch");
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    // Success - just return basic user info for now
    const safeUser = {
      id: user.id,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // Create a log entry for successful login
    await prisma.log.create({
      data: {
        type: 'AUTH',
        action: 'ВХОД ',
        userId: user.id,
        metadata: JSON.stringify({
          success: true,
          timestamp: new Date().toISOString()
        })
      }
    });

    console.log("[Login] Success, returning user:", { id: safeUser.id, login: safeUser.login });

    const response = NextResponse.json({ 
      success: true, 
      user: safeUser 
    }, { status: 200 });

    // Set secure httpOnly cookie with user data (use tk_user to avoid collisions with older cookies)
    response.cookies.set('tk_user', JSON.stringify(safeUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return response;

  } catch (err) {
    // Log the full error
    console.error("[Login] Error:", err);

    return NextResponse.json({ 
      error: "Server error", 
      details: process.env.NODE_ENV === 'development' ? String(err) : undefined 
    }, { status: 500 });
  }
}
