import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicAdminPaths = ["/admin/login", "/admin/register", "/admin/forgot-password", "/admin/reset-password", "/admin/verify"];
  const isPublicPath = publicAdminPaths.includes(pathname);

  if (pathname.startsWith("/admin") && !isPublicPath) {
    const cookieHeader = request.headers.get("cookie") || "";
    if (!cookieHeader.includes("admin_session=")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};