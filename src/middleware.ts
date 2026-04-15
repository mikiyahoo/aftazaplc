import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

// Check if temporary admin access is enabled
const ADMIN_TEMP_ACCESS = process.env.ADMIN_TEMP_ACCESS === "true";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If temporary admin access is enabled, allow all admin routes
  if (ADMIN_TEMP_ACCESS && (pathname.startsWith("/admin") || pathname.startsWith("/api/admin"))) {
    return NextResponse.next();
  }

  // Normal authentication flow for admin routes when temp access is disabled
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (!sessionId) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Allow API routes, static files, and favicon
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Redirect all other requests to login
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};