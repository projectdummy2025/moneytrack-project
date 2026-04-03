import { db } from "../db/lib/db";
import { users, wallets, categories, transactions } from "../db/schema";
import { DEV_USER_ID } from "../lib/dummy-user";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Seeding database for development...");

  try {
    // 1. Create or verify dummy user
    const existingUser = await db.select().from(users).where(eq(users.id, DEV_USER_ID)).limit(1);
    
    if (existingUser.length === 0) {
      console.log("   Creating dummy user...");
      await db.insert(users).values({
        id: DEV_USER_ID,
        name: "Developer",
        email: "dev@moneytrack.local",
      });
    }

    // 2. Create standard categories
    console.log("   Creating standard categories...");
    const catsData = [
      { id: crypto.randomUUID(), userId: DEV_USER_ID, categoryName: "Makan & Minum", classification: "expense" as const, icon: "Utensils", color: "#f59e0b" },
      { id: crypto.randomUUID(), userId: DEV_USER_ID, categoryName: "Transportasi", classification: "expense" as const, icon: "Car", color: "#3b82f6" },
      { id: crypto.randomUUID(), userId: DEV_USER_ID, categoryName: "Belanja", classification: "expense" as const, icon: "ShoppingBag", color: "#6366f1" },
      { id: crypto.randomUUID(), userId: DEV_USER_ID, categoryName: "Gaji", classification: "income" as const, icon: "TrendingUp", color: "#10b981" },
      { id: crypto.randomUUID(), userId: DEV_USER_ID, categoryName: "Investasi", classification: "income" as const, icon: "PieChart", color: "#8b5cf6" },
    ];

    for (const cat of catsData) {
      const existing = await db.select().from(categories).where(eq(categories.categoryName, cat.categoryName)).limit(1);
      if (existing.length === 0) {
        await db.insert(categories).values(cat);
      }
    }

    // 3. Create standard wallets
    console.log("   Creating standard wallets...");
    const walletsData = [
      { id: crypto.randomUUID(), userId: DEV_USER_ID, walletName: "Bank BCA", walletType: "bank", balance: "8500000", currencyCode: "IDR" },
      { id: crypto.randomUUID(), userId: DEV_USER_ID, walletName: "Dompet Tunai", walletType: "cash", balance: "1250000", currencyCode: "IDR" },
      { id: crypto.randomUUID(), userId: DEV_USER_ID, walletName: "GoPay", walletType: "e-wallet", balance: "3000000", currencyCode: "IDR" },
    ];

    for (const w of walletsData) {
      const existing = await db.select().from(wallets).where(eq(wallets.walletName, w.walletName)).limit(1);
      if (existing.length === 0) {
        await db.insert(wallets).values(w);
      }
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
