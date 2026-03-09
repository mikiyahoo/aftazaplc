import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ACCOUNTS_TABLE = "accounts";

function getLoginRedirect(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.url);
  return NextResponse.redirect(loginUrl);
}

function normalizeBoolean(value: unknown, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "t", "1", "yes"].includes(normalized)) {
      return true;
    }

    if (["false", "f", "0", "no"].includes(normalized)) {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return fallback;
}

async function hasLiveAdminAccess(accountId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return false;
  }

  const endpoint = new URL(`${supabaseUrl}/rest/v1/${ACCOUNTS_TABLE}`);
  endpoint.searchParams.set("select", "id,role,is_active");
  endpoint.searchParams.set("id", `eq.${accountId}`);
  endpoint.searchParams.set("limit", "1");

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as Array<{
      id?: string;
      role?: string;
      is_active?: boolean;
    }>;

    const account = Array.isArray(data) ? data[0] : null;

    return Boolean(
      account &&
        account.id &&
        account.role === "admin" &&
        normalizeBoolean(account.is_active, true)
    );
  } catch (error) {
    console.error("Admin middleware account lookup failed.", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Allow access to login page without authentication
  if (isLoginRoute) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.sub) {
    return getLoginRedirect(request);
  }

  const hasAccess = await hasLiveAdminAccess(token.sub);

  if (!hasAccess) {
    return getLoginRedirect(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
