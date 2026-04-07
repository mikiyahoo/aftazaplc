/**
 * Password strength validation utility
 * Enforces strong password requirements for admin accounts
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
  score: number; // 0-100
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Minimum length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 20;
  }

  // Maximum length check (prevent DoS)
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }

  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least 1 uppercase letter');
  } else {
    score += 20;
  }

  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least 1 lowercase letter');
  } else {
    score += 20;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least 1 number');
  } else {
    score += 20;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  } else {
    score += 20;
  }

  // Additional scoring for length beyond minimum
  if (password.length >= 12) {
    score += 10;
  } else if (password.length >= 10) {
    score += 5;
  }

  // Check for common patterns
  const commonPatterns = [
    /password/i,
    /123456/,
    /qwerty/,
    /admin/,
    /aftaza/i
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns and is not secure');
      score -= 20;
      break;
    }
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeated characters (e.g., aaa, 111)');
    score -= 10;
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  if (score >= 80) {
    strength = 'strong';
  } else if (score >= 50) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }

  return {
    isValid: errors.length === 0 && score >= 60,
    errors,
    strength,
    score: Math.max(0, Math.min(100, score))
  };
}

/**
 * Generate password strength indicator for UI
 */
export function getPasswordStrengthIndicator(password: string) {
  const result = validatePassword(password);
  
  if (password.length === 0) {
    return { width: '0%', color: 'transparent', text: '' };
  }

  let width = '0%';
  let color = '#e5e7eb'; // gray
  let text = '';

  if (result.score > 0) {
    width = `${result.score}%`;
    
    if (result.strength === 'weak') {
      color = '#ef4444'; // red
      text = 'Weak';
    } else if (result.strength === 'medium') {
      color = '#f59e0b'; // orange
      text = 'Medium';
    } else {
      color = '#22c55e'; // green
      text = 'Strong';
    }
  }

  return { width, color, text };
}

/**
 * Check if password meets minimum requirements
 */
export function isPasswordSecure(password: string): boolean {
  const result = validatePassword(password);
  return result.isValid;
}

/**
 * Common password blacklist (in production, this should be more comprehensive)
 */
const commonPasswords = [
  'password',
  'password123',
  '123456',
  '123456789',
  'qwerty',
  'abc123',
  'admin',
  'aftaza123',
  'admin123'
];

export function isCommonPassword(password: string): boolean {
  return commonPasswords.includes(password.toLowerCase());
}

/**
 * Log password validation attempt for audit purposes
 */
export function logPasswordValidationAttempt(email: string, password: string, isValid: boolean, strength: string) {
  // This function can be used to log password validation attempts
  // Implementation would depend on the audit logging system
  console.log(`Password validation for ${email}: ${isValid ? 'VALID' : 'INVALID'}, strength: ${strength}`);
}
