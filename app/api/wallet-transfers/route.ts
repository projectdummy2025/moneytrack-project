import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { walletTransfers, wallets, eq, and } from "@/db/schema";
import { getSessionUserId } from "@core/utils/UserSession";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const transfers = await db
      .select()
      .from(walletTransfers)
      .where(eq(walletTransfers.userId, userId))
      .orderBy(walletTransfers.transactedAt);

    return NextResponse.json(transfers);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return NextResponse.json({ error: "Failed to fetch transfers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { sourceId, targetId, amount, transactedAt, memo } = body;

    if (!sourceId || !targetId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (sourceId === targetId) {
      return NextResponse.json({ error: "Source and target wallets must be different" }, { status: 400 });
    }

    // Verify both wallets belong to user
    const [sourceWallet] = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.id, sourceId), eq(wallets.userId, userId)))
      .limit(1);

    if (!sourceWallet) {
      return NextResponse.json({ error: "Source wallet not found" }, { status: 404 });
    }

    const [targetWallet] = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.id, targetId), eq(wallets.userId, userId)))
      .limit(1);

    if (!targetWallet) {
      return NextResponse.json({ error: "Target wallet not found" }, { status: 404 });
    }

    // Check sufficient balance
    const sourceBalance = parseFloat(sourceWallet.balance || "0");
    const transferAmount = parseFloat(amount);

    if (sourceBalance < transferAmount) {
      return NextResponse.json({ error: "Insufficient balance in source wallet" }, { status: 400 });
    }

    // Perform transfer atomically
    const newSourceBalance = String(sourceBalance - transferAmount);
    const newTargetBalance = String(parseFloat(targetWallet.balance || "0") + transferAmount);

    await db
      .update(wallets)
      .set({ balance: newSourceBalance })
      .where(eq(wallets.id, sourceId));

    await db
      .update(wallets)
      .set({ balance: newTargetBalance })
      .where(eq(wallets.id, targetId));

    const [newTransfer] = await db
      .insert(walletTransfers)
      .values({
        userId,
        sourceId,
        targetId,
        amount,
        transactedAt: new Date(transactedAt || Date.now()),
        memo,
      })
      .returning();

    return NextResponse.json(newTransfer, { status: 201 });
  } catch (error) {
    console.error("Error creating transfer:", error);
    return NextResponse.json({ error: "Failed to create transfer" }, { status: 500 });
  }
}
