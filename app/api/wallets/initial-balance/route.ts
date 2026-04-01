import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { wallets, categories, transactions, eq } from "@/db/schema";

// POST /api/wallets/initial-balance - Add initial balance to a wallet via transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId, amount, transactedAt, memo = "Saldo Awal" } = body;

    if (!walletId || !amount) {
      return NextResponse.json(
        { error: "walletId and amount are required" },
        { status: 400 }
      );
    }

    // Verify wallet exists
    const wallet = await db.select().from(wallets).where(eq(wallets.id, walletId)).limit(1);
    if (wallet.length === 0) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    // Get or create "Saldo Awal" category
    let initialBalanceCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.categoryName, "Saldo Awal"))
      .limit(1);

    if (initialBalanceCategory.length === 0) {
      // Create the category if it doesn't exist
      const newCategory = await db
        .insert(categories)
        .values({
          categoryName: "Saldo Awal",
          classification: "income",
          icon: "wallet",
          color: "#10B981",
        })
        .returning();
      initialBalanceCategory = newCategory;
    }

    const category = initialBalanceCategory[0];

    // Create transaction
    const newTransaction = await db.insert(transactions).values({
      walletId,
      categoryId: category.id,
      amount,
      transactedAt: transactedAt ? new Date(transactedAt) : new Date(),
      memo,
    }).returning();

    // Update wallet balance
    const newBalance = String(parseFloat(wallet[0].balance || "0") + parseFloat(amount));
    await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, walletId));

    return NextResponse.json({
      transaction: newTransaction[0],
      wallet: {
        ...wallet[0],
        balance: newBalance,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding initial balance:", error);
    return NextResponse.json({ error: "Failed to add initial balance" }, { status: 500 });
  }
}
