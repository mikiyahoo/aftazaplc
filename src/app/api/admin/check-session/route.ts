import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ authenticated: false });
    }

    const account = await prisma.account.findUnique({
      where: { id: sessionId },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!account) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role
      }
    });
  } catch (error) {
    console.error("Check session error:", error);
    return NextResponse.json({ authenticated: false });
  }
}