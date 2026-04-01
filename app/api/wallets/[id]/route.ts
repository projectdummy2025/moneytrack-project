import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { wallets, eq } from "@/db/schema";

// GET /api/wallets/[id] - Get wallet by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wallet = await db.select().from(wallets).where(eq(wallets.id, id)).limit(1);

    if (wallet.length === 0) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json(wallet[0]);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 });
  }
}

// PUT /api/wallets/[id] - Update wallet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { walletName, walletType, balance, currencyCode } = body;

    const updated = await db
      .update(wallets)
      .set({
        ...(walletName && { walletName }),
        ...(walletType && { walletType }),
        ...(balance !== undefined && { balance }),
        ...(currencyCode && { currencyCode }),
      })
      .where(eq(wallets.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 });
  }
}

// DELETE /api/wallets/[id] - Delete wallet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(wallets).where(eq(wallets.id, id));
    return NextResponse.json({ message: "Wallet deleted" });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    return NextResponse.json({ error: "Failed to delete wallet" }, { status: 500 });
  }
}
