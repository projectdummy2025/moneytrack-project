import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { transactions, wallets, categories, eq, and } from "@/db/schema";
import { getSessionUserId } from "@core/utils/UserSession";

// GET /api/transactions/[id] - Get transaction by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const transaction = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
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

// PUT /api/transactions/[id] - Update transaction with balance recalculation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { walletId, categoryId, amount, transactedAt, memo } = body;

    // Get old transaction
    const oldTransaction = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .limit(1);

    if (oldTransaction.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Get old category to understand classification
    const [oldCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, oldTransaction[0].categoryId))
      .limit(1);

    // Get the wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.id, oldTransaction[0].walletId))
      .limit(1);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    // Step 1: Revert old transaction (restore balance)
    let currentBalance = parseFloat(wallet.balance || "0");
    if (oldCategory.classification === "income") {
      currentBalance -= parseFloat(oldTransaction[0].amount);
    } else {
      currentBalance += parseFloat(oldTransaction[0].amount);
    }

    // Step 2: Determine new classification (if category changed)
    const effectiveCategoryId = categoryId || oldTransaction[0].categoryId;
    const [newCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, effectiveCategoryId))
      .limit(1);

    // Step 3: Apply new transaction (adjust balance)
    const newAmount = amount || oldTransaction[0].amount;
    if (newCategory.classification === "income") {
      currentBalance += parseFloat(newAmount);
    } else {
      currentBalance -= parseFloat(newAmount);
    }

    // Step 4: Update the transaction
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

    // Step 5: Update wallet balance
    const effectiveWalletId = walletId || oldTransaction[0].walletId;
    await db
      .update(wallets)
      .set({ balance: String(currentBalance) })
      .where(eq(wallets.id, effectiveWalletId));

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

// DELETE /api/transactions/[id] - Delete transaction with balance recalculation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Get transaction with joins
    const [transaction] = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        walletId: transactions.walletId,
        categoryId: transactions.categoryId,
        walletBalance: wallets.balance,
        classification: categories.classification,
      })
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .leftJoin(wallets, eq(transactions.walletId, wallets.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .limit(1);

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Revert wallet balance
    if (transaction.walletBalance !== null && transaction.classification) {
      const oldBalance = parseFloat(transaction.walletBalance);
      const newBalance = transaction.classification === "income"
        ? String(oldBalance - parseFloat(transaction.amount))
        : String(oldBalance + parseFloat(transaction.amount));

      await db
        .update(wallets)
        .set({ balance: newBalance })
        .where(eq(wallets.id, transaction.walletId));
    }

    await db.delete(transactions).where(eq(transactions.id, id));
    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
