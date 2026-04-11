import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if user exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Create user (Manual: password stored as plain for now or simple hash)
    // IMPORTANT: Use bcrypt in production
    const [newUser] = await db.insert(users).values({
      email,
      password, // Plain text for trial mode as requested
      name,
    }).returning();

    const response = NextResponse.json({ userId: newUser.id }, { status: 201 });

    // Konfigurasi cookie profesional untuk cross-device HTTP dan Production
    response.cookies.set("moneytrack_session", newUser.id, {
      httpOnly: false,
      path: "/",
      secure: request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
