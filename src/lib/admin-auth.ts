import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Admin authentication utilities
 * Provides session validation and admin role checking
 */

export async function validateAdminSession() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const account = await prisma.account.findUnique({
      where: { id: sessionId },
    });

    if (!account || !account.emailVerified) {
      return null;
    }

    return account;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}

export async function requireAdminSession() {
  const account = await validateAdminSession();
  
  if (!account) {
    throw new Error("Unauthorized");
  }

  return account;
}

export function isAdmin(account: any) {
  return account && account.role === 'admin';
}

export function isEditor(account: any) {
  return account && (account.role === 'admin' || account.role === 'editor');
}

export async function getAdminAccountFromRequest(request: Request) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const account = await prisma.account.findUnique({
      where: { id: sessionId },
    });

    if (!account || !account.emailVerified) {
      return null;
    }

    return account;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}
