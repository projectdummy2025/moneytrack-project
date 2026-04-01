import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { transactions, wallets, categories, eq } from "@/db/schema";

// GET /api/transactions/[id] - Get transaction by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);

    if (transaction.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(transaction[0]);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
  }
}

// PUT /api/transactions/[id] - Update transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { walletId, categoryId, amount, transactedAt, memo } = body;

    // Get old transaction to revert balance
    const oldTransaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);

    if (oldTransaction.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const updated = await db
      .update(transactions)
      .set({
        ...(walletId && { walletId }),
        ...(categoryId && { categoryId }),
        ...(amount && { amount }),
        ...(transactedAt && { transactedAt: new Date(transactedAt) }),
        ...(memo !== undefined && { memo }),
      })
      .where(eq(transactions.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

// DELETE /api/transactions/[id] - Delete transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get transaction to revert balance
    const transaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .leftJoin(wallets, eq(transactions.walletId, wallets.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .limit(1);

    if (transaction.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Revert wallet balance
    const txn = transaction[0].transactions;
    const wallet = transaction[0].wallets;
    const category = transaction[0].categories;

    if (wallet && category) {
      const oldBalance = parseFloat(wallet.balance || "0");
      const newBalance = category.classification === "income"
        ? String(oldBalance - parseFloat(txn.amount))
        : String(oldBalance + parseFloat(txn.amount));

      await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, wallet.id));
    }

    await db.delete(transactions).where(eq(transactions.id, id));
    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
