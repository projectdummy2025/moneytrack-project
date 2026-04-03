import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { wallets } from "@/db/schema";
import { DEV_USER_ID } from "@/lib/dummy-user";
import { eq } from "drizzle-orm";

// GET /api/wallets - List all wallets
export async function GET() {
  try {
    const allWallets = await db.select().from(wallets)
      .where(eq(wallets.userId, DEV_USER_ID))
      .orderBy(wallets.createdAt);
    return NextResponse.json(allWallets);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 });
  }
}

// POST /api/wallets - Create new wallet (balance always starts at 0)
// To add initial balance, create a transaction after wallet is created
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletName, walletType, currencyCode = "IDR" } = body;

    if (!walletName || !walletType) {
      return NextResponse.json(
        { error: "walletName and walletType are required" },
        { status: 400 }
      );
    }

    // Wallet selalu dimulai dengan balance 0
    const [newWallet] = await db.insert(wallets).values({
      userId: DEV_USER_ID,
      walletName,
      walletType,
      balance: "0",
      currencyCode,
    }).returning();

    return NextResponse.json(newWallet, { status: 201 });
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 });
  }
}
