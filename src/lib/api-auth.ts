import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Checks if the request has a valid admin session via admin_session cookie.
 * Returns { authenticated: true, user: account } if valid, { authenticated: false } otherwise.
 */
export async function requireAdminAuth(request: NextRequest) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) {
    return { authenticated: false };
  }

  try {
    const account = await prisma.account.findUnique({
      where: { id: sessionId },
      select: { id: true, email: true, name: true, role: true, emailVerified: true }
    });

    if (!account || !account.emailVerified) {
      return { authenticated: false };
    }

    return { authenticated: true, user: account };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { authenticated: false };
  }
}

/**
 * Helper to create an unauthorized response
 */
export function unauthorizedResponse(message = "Unauthorized - Admin access required") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Helper to create a forbidden response
 */
export function forbiddenResponse(message = "Forbidden - Insufficient permissions") {
  return NextResponse.json({ error: message }, { status: 403 });
}
