import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { wallets } from "@/db/schema";
import { getSessionUserId } from "@core/utils/UserSession";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allWallets = await db.select().from(wallets)
      .where(eq(wallets.userId, userId))
      .orderBy(wallets.createdAt);
    return NextResponse.json(allWallets);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { walletName, walletType, currencyCode = "IDR" } = body;

    if (!walletName || !walletType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [newWallet] = await db.insert(wallets).values({
      userId,
      walletName,
      walletType,
      balance: "0",
      currencyCode,
    }).returning();

    return NextResponse.json(newWallet, { status: 201 });
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
