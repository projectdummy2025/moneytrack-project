import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, generateOTP, createRegistrationToken } from "@/src/core/utils/AuthCrypto";
import { sendOTPEmail } from "@/src/core/utils/Mailer";

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

    // 1. Hash password
    const hashedPassword = await hashPassword(password);

    // 2. Generate OTP
    const otp = generateOTP();

    // 3. Send OTP via Email
    try {
      await sendOTPEmail(email, otp);
    } catch (mailError) {
      console.error("Failed to send OTP email:", mailError);
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    // 4. Create Encrypted Registration Token (Stateless)
    const token = await createRegistrationToken({
      email,
      hashedPassword,
      name,
      otp,
    });

    const response = NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });

    // 5. Set Secure Registration Cookie (10 minutes expiry)
    response.cookies.set("registration_pending", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
