import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, verificationCode } = body;

    if (!accountId || !verificationCode) {
      return NextResponse.json(
        { error: "Account ID and verification code are required" },
        { status: 400 }
      );
    }

    // Find account with verification code
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

    // Check if verification code matches
    if (account.verificationCode !== verificationCode) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Check if verification code has expired
    if (account.verificationExpires && new Date() > account.verificationExpires) {
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Mark account as verified and clear verification code
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
      accountId: updatedAccount.id,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}