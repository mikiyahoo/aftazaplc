import { NextRequest, NextResponse } from "next/server";

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5, // limit each IP to 5 requests per windowMs
  blockDuration: 60 * 60 * 1000, // block for 1 hour
};

// In-memory store for rate limiting (in production, use Redis)
const attempts = new Map<string, { count: number; resetTime: number; blockedUntil?: number }>();

export function createRateLimit(maxAttempts: number = rateLimitConfig.maxAttempts, windowMs: number = rateLimitConfig.windowMs) {
  return (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Check if IP is currently blocked
    const currentAttempts = attempts.get(ip);
    if (currentAttempts && currentAttempts.blockedUntil && now < currentAttempts.blockedUntil) {
      return {
        blocked: true,
        message: `Too many attempts. Please try again in ${Math.ceil((currentAttempts.blockedUntil - now) / 60000)} minutes.`,
        retryAfter: Math.ceil((currentAttempts.blockedUntil - now) / 1000)
      };
    }

    // Initialize or reset attempts
    if (!currentAttempts || now > currentAttempts.resetTime) {
      attempts.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
      return { blocked: false };
    }

    // Check if limit exceeded
    if (currentAttempts.count >= maxAttempts) {
      // Block the IP
      currentAttempts.blockedUntil = now + rateLimitConfig.blockDuration;
      currentAttempts.count++;
      return {
        blocked: true,
        message: `Too many attempts. Please try again in ${Math.ceil(rateLimitConfig.blockDuration / 60000)} minutes.`,
        retryAfter: Math.ceil(rateLimitConfig.blockDuration / 1000)
      };
    }

    // Increment attempts
    currentAttempts.count++;
    return { blocked: false };
  };
}

// Specific rate limiters for different endpoints
export const registrationRateLimit = createRateLimit(5, 60 * 60 * 1000); // 5 per hour for registration
export const loginRateLimit = createRateLimit(10, 15 * 60 * 1000); // 10 per 15 minutes for login
export const verificationRateLimit = createRateLimit(10, 60 * 60 * 1000); // 10 per hour for verification

// Email-specific rate limiting
export const emailRateLimit = createRateLimit(3, 60 * 60 * 1000); // 3 emails per hour per email address

// Forgot password rate limiting (3 attempts per hour per email)
export const forgotPasswordRateLimit = createRateLimit(3, 60 * 60 * 1000);

// Reset password rate limiting (3 attempts per hour per token)
export const resetPasswordRateLimit = createRateLimit(3, 60 * 60 * 1000);

// In-memory store for email attempts
const emailAttempts = new Map<string, { count: number; resetTime: number; blockedUntil?: number }>();

export function checkEmailRateLimit(email: string) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxAttempts = 3;
  
  const currentAttempts = emailAttempts.get(email);
  
  // Check if email is currently blocked
  if (currentAttempts && currentAttempts.blockedUntil && now < currentAttempts.blockedUntil) {
    return {
      blocked: true,
      message: `Too many verification attempts for this email. Please try again in ${Math.ceil((currentAttempts.blockedUntil - now) / 60000)} minutes.`
    };
  }

  // Initialize or reset attempts
  if (!currentAttempts || now > currentAttempts.resetTime) {
    emailAttempts.set(email, {
      count: 1,
      resetTime: now + windowMs
    });
    return { blocked: false };
  }

  // Check if limit exceeded
  if (currentAttempts.count >= maxAttempts) {
    // Block the email
    currentAttempts.blockedUntil = now + rateLimitConfig.blockDuration;
    currentAttempts.count++;
    return {
      blocked: true,
      message: `Too many verification attempts for this email. Please try again in ${Math.ceil(rateLimitConfig.blockDuration / 60000)} minutes.`
    };
  }

  // Increment attempts
  currentAttempts.count++;
  return { blocked: false };
}

// Clean up expired entries periodically (optional cleanup function)
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, data] of attempts.entries()) {
    if (now > data.resetTime && (!data.blockedUntil || now > data.blockedUntil)) {
      attempts.delete(ip);
    }
  }
  
  for (const [email, data] of emailAttempts.entries()) {
    if (now > data.resetTime && (!data.blockedUntil || now > data.blockedUntil)) {
      emailAttempts.delete(email);
    }
  }
}

// Call cleanup every 10 minutes
setInterval(cleanupRateLimit, 10 * 60 * 1000);