import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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

    return NextResponse.json({ userId: user.id }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
