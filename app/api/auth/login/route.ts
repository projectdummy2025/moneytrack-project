import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { comparePassword } from "@/src/core/utils/AuthCrypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email: rawEmail, password: rawPassword } = body;
    const email = rawEmail?.trim();
    const password = rawPassword?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare hashed password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const response = NextResponse.json({ userId: user.id }, { status: 200 });

    // Set Session Cookie
    response.cookies.set("moneytrack_session", user.id, {
      httpOnly: false,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
