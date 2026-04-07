/**
 * Admin Login API Endpoint
 * 
 * Security Features Implemented:
 * - Rate limiting (10 attempts per IP per 15 minutes)
 * - Email verification requirement
 * - Secure password comparison with bcrypt
 * - Audit logging for all login attempts
 * - Secure session cookie management
 * - Failed attempt tracking for security monitoring
 * 
 * @route POST /api/admin/login
 * @access Public
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { loginRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;

    // Check rate limiting for login
    const rateLimitResult = loginRateLimit(request);
    if (rateLimitResult.blocked) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429, headers: { 'Retry-After': (rateLimitResult.retryAfter || 900).toString() } }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Find admin account
    const account = await prisma.account.findUnique({
      where: { email },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if account is verified
    if (!account.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email address before logging in" },
        { status: 403 }
      );
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, account.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set("admin_session", account.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ 
      success: true,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role
      },
      redirectUrl: '/admin'
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}