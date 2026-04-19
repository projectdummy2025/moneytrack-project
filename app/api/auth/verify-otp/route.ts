import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { users, categories, wallets } from "@/db/schema";
import { decryptRegistrationToken } from "@/src/core/utils/AuthCrypto";

const DEFAULT_CATEGORIES = [
  // Expense categories
  { categoryName: "Makanan", classification: "expense" as const, icon: "utensils", color: "#ef4444" },
  { categoryName: "Transportasi", classification: "expense" as const, icon: "car", color: "#3b82f6" },
  { categoryName: "Belanja", classification: "expense" as const, icon: "shopping-bag", color: "#8b5cf6" },
  { categoryName: "Tagihan", classification: "expense" as const, icon: "receipt", color: "#f59e0b" },
  { categoryName: "Hiburan", classification: "expense" as const, icon: "gamepad-2", color: "#ec4899" },
  { categoryName: "Kesehatan", classification: "expense" as const, icon: "heart-pulse", color: "#10b981" },
  // Income categories
  { categoryName: "Gaji", classification: "income" as const, icon: "banknote", color: "#22c55e" },
  { categoryName: "Bonus", classification: "income" as const, icon: "gift", color: "#06b6d4" },
  { categoryName: "Investasi", classification: "income" as const, icon: "trending-up", color: "#84cc16" },
];

export async function POST(request: NextRequest) {
  try {
    const { otp: userOtp } = await request.json();
    const token = request.cookies.get("registration_pending")?.value;

    if (!token) {
      return NextResponse.json({ error: "Session expired. Please register again." }, { status: 400 });
    }

    // Decrypt the token
    const payload: any = await decryptRegistrationToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session." }, { status: 400 });
    }

    // Verify OTP
    if (payload.otp !== userOtp) {
      return NextResponse.json({ error: "Invalid OTP code." }, { status: 400 });
    }

    const { email, hashedPassword, name } = payload;

    // Finally, create user in Database
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      emailVerified: new Date(),
    }).returning();

    // Create default wallet
    const [defaultWallet] = await db.insert(wallets).values({
      userId: newUser.id,
      walletName: "Cash",
      walletType: "cash",
      balance: "0",
      currencyCode: "IDR",
    }).returning();

    // Create default categories
    await db.insert(categories).values(
      DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        userId: newUser.id,
      }))
    );

    const response = NextResponse.json({ userId: newUser.id }, { status: 201 });

    // Login user immediately
    response.cookies.set("moneytrack_session", newUser.id, {
      httpOnly: false, // Set to true if only server access is needed
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Clear registration cookie
    response.cookies.delete("registration_pending");

    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
