import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if temporary admin access is enabled
const ADMIN_TEMP_ACCESS = process.env.ADMIN_TEMP_ACCESS === "true";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If temporary admin access is enabled, allow all admin routes
  if (ADMIN_TEMP_ACCESS && (pathname.startsWith("/admin") || pathname.startsWith("/api/admin"))) {
    return NextResponse.next();
  }

  // Skip static files and api
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Public admin paths that don't require authentication
  const publicAdminPaths = [
    "/admin/login",
    "/admin/register",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/admin/verify",
  ];

  const isPublicAdminPath = publicAdminPaths.some(path => pathname === path || pathname.startsWith(path + "/"));

  // Only process /admin routes
  if (pathname.startsWith("/admin")) {
    // Allow public paths without session
    if (isPublicAdminPath) {
      return NextResponse.next();
    }

    // Get session from cookie header
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    const sessionId = match ? match[1] : null;

    if (!sessionId) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // Session exists - allow access
    return NextResponse.next();
  }

  // Allow API routes, static files, favicon, and root path
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/" ||
    pathname === ""
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