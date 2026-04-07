import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { emailService } from "@/lib/email-server";
import { forgotPasswordRateLimit } from "@/lib/rateLimit";
import { logForgotPasswordRequest } from "@/lib/auditLog";

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting for forgot password
    const rateLimitResult = forgotPasswordRateLimit(request);
    if (rateLimitResult.blocked) {
      await logForgotPasswordRequest(clientIP, request.headers.get('user-agent') || undefined, 'rate_limited');
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429, headers: { 'Retry-After': (rateLimitResult.retryAfter || 3600).toString() } }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find account by email
    const account = await prisma.account.findUnique({
      where: { email },
    });

    if (!account) {
      // Don't reveal whether account exists or not for security
      return NextResponse.json({
        message: "If an account with this email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update account with reset token
    await prisma.account.update({
      where: { id: account.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`;

    // Send reset email
    const emailContent = emailService.generatePasswordResetEmail(account.name, resetUrl);
    const emailSent = await emailService.sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (!emailSent) {
      // If email fails, clear the reset token
      await prisma.account.update({
        where: { id: account.id },
        data: {
          resetToken: null,
          resetTokenExpires: null,
        },
      });

      return NextResponse.json(
        { error: "Failed to send reset email. Please try again." },
        { status: 500 }
      );
    }

    await logForgotPasswordRequest(email, clientIP, request.headers.get('user-agent') || undefined, true);

    return NextResponse.json({
      message: "If an account with this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}