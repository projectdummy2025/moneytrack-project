import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("moneytrack_session")?.value;

  // 1. ABAIKAN semua request statis, internal Next.js, dan API Auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 2. ABAIKAN halaman publik (Auth)
  const publicPaths = ["/login", "/register", "/otp-verification", "/forgot-password", "/create-new-password", "/password-changed"];
  const isPublicPath = publicPaths.includes(pathname);

  if (isPublicPath) {
    // Jika sudah ada session tapi mau ke login/register/otp, lempar ke dashboard
    if (session && (pathname === "/login" || pathname === "/register" || pathname === "/otp-verification")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 3. PROTEKSI Dashboard & Halaman internal lainnya
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
