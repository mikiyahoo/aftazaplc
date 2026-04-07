import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 401 }
      );
    }

    // Verify session is still valid
    const account = await prisma.account.findUnique({
      where: { id: sessionId },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 401 }
      );
    }

    // Extend session cookie
    cookieStore.set("admin_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ 
      success: true,
      message: "Session extended successfully"
    });
  } catch (error) {
    console.error("Session extension error:", error);
    return NextResponse.json(
      { error: "Failed to extend session" },
      { status: 500 }
    );
  }
}