import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/lib/db";
import { transactions, wallets, categories } from "@/db/schema";
import { getSessionUserId } from "@core/utils/UserSession";
import { eq, desc, and } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.transactedAt));

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { walletId, categoryId, amount, transactedAt, memo } = body;

    if (!walletId || !categoryId || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify wallet
    const [wallet] = await db.select().from(wallets).where(and(eq(wallets.id, walletId), eq(wallets.userId, userId))).limit(1);
    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    // Verify category
    const [category] = await db.select().from(categories).where(and(eq(categories.id, categoryId), eq(categories.userId, userId))).limit(1);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const [newTransaction] = await db.insert(transactions).values({
      userId,
      walletId,
      categoryId,
      amount,
      transactedAt: new Date(transactedAt),
      memo,
    }).returning();

    // Update balance
    const newBalance = category.classification === "income"
      ? String(parseFloat(wallet.balance || "0") + parseFloat(amount))
      : String(parseFloat(wallet.balance || "0") - parseFloat(amount));

    await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, walletId));

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
