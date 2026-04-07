import * as nodemailer from "nodemailer";

// In Next.js API routes, environment variables are automatically available
// No need to call config() as Next.js handles this automatically

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    // Verify environment variables are loaded
    if (!process.env.SMTP_HOST || !process.env.SMTP_PASS || !process.env.SMTP_USER) {
      console.error('❌ Missing required environment variables for email service');
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "mail.aftaza.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // true for 465 (SSL/TLS)
      auth: {
        user: process.env.SMTP_USER || "admin@aftaza.com",
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
        minVersion: "TLSv1.2", // Require modern TLS
        ciphers: "SSLv3" // Allow SSL for compatibility
      },
      debug: false, // Disable debug logging in production
      logger: false, // Disable logger in production
      connectionTimeout: 10000, // 10 second timeout
      greetingTimeout: 5000, // 5 second greeting timeout
      socketTimeout: 60000, // 1 minute socket timeout
    });

    return this.transporter;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }

  generateVerificationEmail(name: string, code: string, role: string): { subject: string; html: string; text: string } {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e2e8f0;
          }
          .role-badge {
            background-color: ${role === 'admin' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
            margin: 10px 0;
          }
          .code-box {
            background-color: #ffffff;
            border: 2px solid #2563eb;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            border-radius: 8px;
          }
          .verification-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #2563eb;
            margin: 10px 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
          .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to Aftaza Admin</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for registering as an admin. To complete your registration, please use the verification code below:</p>
          
          <div style="text-align: center;">
            <span class="role-badge">${role === 'admin' ? 'ADMIN' : 'EDITOR'} Account</span>
          </div>
          
          <div class="code-box">
            <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
            <div class="verification-code">${code}</div>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Enter this code to verify your email address</p>
          </div>

          <div class="warning">
            <strong>Important:</strong> This verification code will expire in 10 minutes for security reasons.
          </div>

          <p>If you did not register for an admin account, please ignore this email.</p>
          
          <p>Best regards,<br>
          The Aftaza Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Aftaza. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const text = `
Welcome to Aftaza Admin

Hello ${name},

Thank you for registering as an admin. To complete your registration, please use the verification code below:

Your Account Role: ${role.toUpperCase()}
Verification Code: ${code}

Important: This verification code will expire in 10 minutes for security reasons.

If you did not register for an admin account, please ignore this email.

Best regards,
The Aftaza Team

This is an automated message, please do not reply to this email.
${new Date().getFullYear()} Aftaza. All rights reserved.
    `;

    return {
      subject: "Verify Your Email Address - Aftaza Admin",
      html,
      text,
    };
  }

  generatePasswordResetEmail(name: string, resetUrl: string): { subject: string; html: string; text: string } {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e2e8f0;
          }
          .reset-button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
          .reset-button:hover {
            background-color: #1d4ed8;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
          .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Aftaza Admin Panel</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>We received a request to reset your password for your Aftaza Admin account. If you made this request, click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">Reset My Password</a>
          </div>

          <div class="warning">
            <strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.
          </div>

          <p><strong>Or copy and paste this link into your browser:</strong><br>
          <a href="${resetUrl}">${resetUrl}</a></p>

          <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
          
          <p>Best regards,<br>
          The Aftaza Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Aftaza. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const text = `
Aftaza Admin Panel

Hello ${name},

We received a request to reset your password for your Aftaza Admin account. If you made this request, please use the link below to reset your password:

Reset Password Link: ${resetUrl}

Important: This password reset link will expire in 1 hour for security reasons.

If you did not request a password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The Aftaza Team

This is an automated message, please do not reply to this email.
${new Date().getFullYear()} Aftaza. All rights reserved.
    `;

    return {
      subject: "Reset Your Password - Aftaza Admin Panel",
      html,
      text,
    };
  }
}

// Lazy initialization - only create instance when first used
let _emailService: EmailService | null = null;

function getEmailService(): EmailService {
  if (!_emailService) {
    _emailService = new EmailService();
  }
  return _emailService;
}

export const emailService = {
  sendEmail: (options: EmailOptions) => {
    return getEmailService().sendEmail(options);
  },
  generateVerificationEmail: (name: string, code: string, role: string) => {
    return getEmailService().generateVerificationEmail(name, code, role);
  },
  generatePasswordResetEmail: (name: string, resetUrl: string) => {
    return getEmailService().generatePasswordResetEmail(name, resetUrl);
  }
};