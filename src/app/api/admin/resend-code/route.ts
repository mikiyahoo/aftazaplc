import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { emailService } from "@/lib/email-server";
import { checkEmailRateLimit } from "@/lib/rateLimit";
import { logRegistration } from "@/lib/auditLog";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    // Find account
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Invalid verification request" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (account.emailVerified) {
      return NextResponse.json(
        { error: "Account is already verified" },
        { status: 400 }
      );
    }

    // Check email rate limiting
    const rateLimitResult = checkEmailRateLimit(account.email);
    if (rateLimitResult.blocked) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      );
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update account with new verification code
    await prisma.account.update({
      where: { id: accountId },
      data: {
        verificationCode,
        verificationExpires,
      },
    });

    // Send verification email
    const emailContent = emailService.generateVerificationEmail(account.name, verificationCode, account.role);
    const emailSent = await emailService.sendEmail({
      to: account.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully. Please check your email.",
    });
  } catch (error) {
    console.error("Resend verification code error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}