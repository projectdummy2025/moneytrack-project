import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { users, categories, wallets } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if user exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      password,
      name,
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

    const response = NextResponse.json({ userId: newUser.id, walletId: defaultWallet.id }, { status: 201 });

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
