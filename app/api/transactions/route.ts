import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { transactions, wallets, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/transactions - List all transactions with relations
export async function GET() {
  try {
    const allTransactions = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        transactedAt: transactions.transactedAt,
        memo: transactions.memo,
        createdAt: transactions.createdAt,
        walletName: wallets.walletName,
        walletType: wallets.walletType,
        categoryName: categories.categoryName,
        classification: categories.classification,
        categoryIcon: categories.icon,
        categoryColor: categories.color,
      })
      .from(transactions)
      .leftJoin(wallets, eq(transactions.walletId, wallets.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .orderBy(desc(transactions.transactedAt));

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId, categoryId, amount, transactedAt, memo } = body;

    if (!walletId || !categoryId || !amount || !transactedAt) {
      return NextResponse.json(
        { error: "walletId, categoryId, amount, and transactedAt are required" },
        { status: 400 }
      );
    }

    // Verify wallet exists
    const wallet = await db.select().from(wallets).where(eq(wallets.id, walletId)).limit(1);
    if (wallet.length === 0) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    // Verify category exists
    const category = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
    if (category.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const newTransaction = await db.insert(transactions).values({
      walletId,
      categoryId,
      amount,
      transactedAt: new Date(transactedAt),
      memo,
    }).returning();

    // Update wallet balance based on transaction type
    const categoryData = category[0];
    const newBalance = categoryData.classification === "income"
      ? String(parseFloat(wallet[0].balance || "0") + parseFloat(amount))
      : String(parseFloat(wallet[0].balance || "0") - parseFloat(amount));

    await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, walletId));

    return NextResponse.json(newTransaction[0], { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
