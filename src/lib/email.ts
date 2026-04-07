export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  constructor() {
    console.log('📧 EmailService constructor called (Mock version)');
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Mock email sending - log the email details instead of actually sending
      console.log('📧 Mock Email Service - Email would be sent to:', options.to);
      console.log('📧 Subject:', options.subject);
      console.log('📧 HTML length:', options.html.length);
      console.log('📧 Text length:', options.text?.length || 0);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error("Mock email sending failed:", error);
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
}

export const emailService = new EmailService();