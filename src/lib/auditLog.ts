import { prisma } from "@/lib/prisma";

/**
 * Audit logging utility for tracking admin activities
 * Records login/logout, registration, verification, and other security events
 */

export interface AuditLogData {
  adminId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export async function logAdminActivity(data: AuditLogData) {
  try {
    await prisma.adminLog.create({
      data: {
        adminId: data.adminId,
        action: data.action,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata ?? undefined
      }
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
    // Don't throw error to avoid breaking the main operation
  }
}

/**
 * Log successful login
 */
export async function logLogin(adminId: string, ipAddress?: string, userAgent?: string) {
  await logAdminActivity({
    adminId,
    action: 'login',
    ipAddress,
    userAgent,
    metadata: { success: true }
  });
}

/**
 * Log failed login attempt
 */
export async function logFailedLogin(email: string, ipAddress?: string, userAgent?: string) {
  await logAdminActivity({
    action: 'login_failed',
    ipAddress,
    userAgent,
    metadata: { 
      email,
      reason: 'invalid_credentials',
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Log registration attempt
 */
export async function logRegistration(adminId: string, email: string, role: string, ipAddress?: string, userAgent?: string) {
  await logAdminActivity({
    adminId,
    action: 'registration',
    ipAddress,
    userAgent,
    metadata: { 
      email,
      role,
      emailVerified: false
    }
  });
}

/**
 * Log email verification
 */
export async function logEmailVerification(adminId: string, ipAddress?: string, userAgent?: string) {
  await logAdminActivity({
    adminId,
    action: 'email_verification',
    ipAddress,
    userAgent,
    metadata: { verified: true }
  });
}

/**
 * Log logout
 */
export async function logLogout(adminId: string, ipAddress?: string, userAgent?: string) {
  await logAdminActivity({
    adminId,
    action: 'logout',
    ipAddress,
    userAgent
  });
}

/**
 * Log rate limiting violations
 */
export async function logRateLimitViolation(ipAddress?: string, userAgent?: string, action?: string) {
  await logAdminActivity({
    action: 'rate_limit_violation',
    ipAddress,
    userAgent,
    metadata: {
      action,
      timestamp: new Date().toISOString(),
      reason: 'too_many_attempts'
    }
  });
}

/**
 * Log password strength validation
 */
export async function logPasswordValidation(email: string, isValid: boolean, strength: string, ipAddress?: string, userAgent?: string) {
  await logAdminActivity({
    action: 'password_validation',
    ipAddress,
    userAgent,
    metadata: {
      email,
      isValid,
      strength,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Log forgot password request
 */
export async function logForgotPasswordRequest(email: string, ipAddress?: string, userAgent?: string, success: boolean = false, reason?: string) {
  await logAdminActivity({
    action: 'forgot_password',
    ipAddress,
    userAgent,
    metadata: {
      email,
      success,
      reason,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Log password reset attempt
 */
export async function logPasswordReset(email: string, ipAddress?: string, userAgent?: string, success: boolean = false, reason?: string) {
  await logAdminActivity({
    action: 'password_reset',
    ipAddress,
    userAgent,
    metadata: {
      email,
      success,
      reason,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Get audit logs for an admin (for admin dashboard)
 */
export async function getAdminLogs(adminId: string, limit: number = 50) {
  try {
    return await prisma.adminLog.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  } catch (error) {
    console.error('Failed to retrieve admin logs:', error);
    return [];
  }
}

/**
 * Get recent suspicious activities (for security monitoring)
 */
export async function getSuspiciousActivities(timeframeHours: number = 24) {
  try {
    const since = new Date(Date.now() - (timeframeHours * 60 * 60 * 1000));
    
    return await prisma.adminLog.findMany({
      where: {
        createdAt: { gte: since },
        action: {
          in: ['login_failed', 'rate_limit_violation', 'password_validation']
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to retrieve suspicious activities:', error);
    return [];
  }
}

/**
 * Clean up old audit logs (for maintenance)
 */
export async function cleanupOldLogs(keepDays: number = 90) {
  try {
    const cutoff = new Date(Date.now() - (keepDays * 24 * 60 * 60 * 1000));
    
    const result = await prisma.adminLog.deleteMany({
      where: {
        createdAt: { lt: cutoff }
      }
    });
    
    console.log(`Cleaned up ${result.count} old audit logs`);
    return result.count;
  } catch (error) {
    console.error('Failed to cleanup old logs:', error);
    return 0;
  }
}