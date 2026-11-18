import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  "royal-shine-super-secret-jwt-key-32-characters-min";
const key = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME =
  process.env.ADMIN_SESSION_COOKIE_NAME || "royal_shine_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes, skip /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, key, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      // Token invalid or expired
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear the bad cookie
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
