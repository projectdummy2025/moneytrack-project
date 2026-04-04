import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("moneytrack_session");
  const { pathname } = request.nextUrl;

  // Izinkan akses ke login, register, dan API auth tanpa session
  if (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Redirect ke login jika tidak ada session
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Hanya jalankan middleware pada rute aplikasi utama
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
