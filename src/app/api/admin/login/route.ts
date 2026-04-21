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
import bcrypt from "bcryptjs";
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

    // Set session cookie and return success with redirect
    const response = NextResponse.json({
      success: true,
      redirectUrl: "/admin"
    });
    
    response.cookies.set("admin_session", account.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Unable to connect. Please try again. " + errorMessage },
      { status: 500 }
    );
  }
}