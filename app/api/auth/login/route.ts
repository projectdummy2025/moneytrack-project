import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email: rawEmail, password: rawPassword } = body;
    const email = rawEmail?.trim();
    const password = rawPassword?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Simple matching (plain text for trial)
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password)))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const response = NextResponse.json({ userId: user.id }, { status: 200 });

    // Konfigurasi cookie profesional untuk cross-device HTTP dan Production
    response.cookies.set("moneytrack_session", user.id, {
      httpOnly: false,
      path: "/",
      secure: request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
