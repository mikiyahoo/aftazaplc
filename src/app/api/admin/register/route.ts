/**
 * Admin Registration API Endpoint
 * 
 * Security Features Implemented:
 * - Rate limiting (5 attempts per IP per hour)
 * - Password strength validation (8+ chars, uppercase, lowercase, number, special char)
 * - Email domain validation (@aftaza.com or admin email)
 * - Audit logging for security monitoring
 * - Secure password hashing with bcrypt
 * - Email verification with 6-digit code (10-minute expiry)
 * 
 * @route POST /api/admin/register
 * @access Public
 */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { emailService } from "@/lib/email-server";
import { registrationRateLimit, checkEmailRateLimit } from "@/lib/rateLimit";
import { validatePassword, logPasswordValidationAttempt } from "@/lib/passwordValidation";
import { logRegistration, logRateLimitViolation } from "@/lib/auditLog";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting for registration
    const rateLimitResult = registrationRateLimit(request);
    if (rateLimitResult.blocked) {
      await logRateLimitViolation(clientIP, request.headers.get('user-agent') || undefined, 'registration');
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429, headers: { 'Retry-After': (rateLimitResult.retryAfter || 3600).toString() } }
      );
    }

    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate role (optional, defaults to 'editor')
    const role = body.role || "editor";
    if (role !== "admin" && role !== "editor") {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin' or 'editor'" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: `Password validation failed: ${passwordValidation.errors.join(', ')}` },
        { status: 400 }
      );
    }

    // Log password validation for audit
    logPasswordValidationAttempt(email, password, passwordValidation.isValid, passwordValidation.strength);

    // Validate email domain (must end with @aftaza.com or be admin email)
    const adminEmail = process.env.ADMIN_EMAIL || "admin@aftaza.com";
    if (!email.endsWith("@aftaza.com") && email !== adminEmail) {
      return NextResponse.json(
        { error: "Email must be from @aftaza.com domain or be the admin email" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAccount = await prisma.account.findUnique({
      where: { email },
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create account with verification code
    const account = await prisma.account.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        emailVerified: false,
        verificationCode,
        verificationExpires,
      },
    });

    // Send verification email
    const emailContent = emailService.generateVerificationEmail(name, verificationCode, role);
    const emailSent = await emailService.sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (!emailSent) {
      // If email fails, clean up the created account
      await prisma.account.delete({
        where: { id: account.id },
      });

      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for the verification code.",
      accountId: account.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}