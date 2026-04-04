import { db } from "../db/lib/db";
import { users, wallets, categories, transactions } from "../db/schema";
import { eq } from "drizzle-orm";

// Kita tentukan ID statis untuk user demo agar seed bisa dijalankan berulang kali
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

async function main() {
  console.log("--- Seeding Database ---");

  // 1. Cleanup data lama untuk user demo
  await db.delete(transactions).where(eq(transactions.userId, DEMO_USER_ID));
  await db.delete(categories).where(eq(categories.userId, DEMO_USER_ID));
  await db.delete(wallets).where(eq(wallets.userId, DEMO_USER_ID));
  await db.delete(users).where(eq(users.id, DEMO_USER_ID));

  // 2. Create Demo User
  console.log("Creating demo user...");
  await db.insert(users).values({
    id: DEMO_USER_ID,
    name: "John Doe",
    email: "demo@moneytrack.com",
    password: "password123", // Password sederhana untuk trial
  });

  // 3. Create Wallets
  console.log("Creating wallets...");
  const [bca] = await db.insert(wallets).values({
    userId: DEMO_USER_ID,
    walletName: "Bank BCA",
    walletType: "bank",
    balance: "8200000",
  }).returning();

  const [cash] = await db.insert(wallets).values({
    userId: DEMO_USER_ID,
    walletName: "Dompet Tunai",
    walletType: "cash",
    balance: "1300000",
  }).returning();

  // 4. Create Categories
  console.log("Creating categories...");
  const [food] = await db.insert(categories).values({
    userId: DEMO_USER_ID,
    categoryName: "Makan & Minum",
    classification: "expense",
    icon: "coffee",
    color: "amber",
  }).returning();

  const [salary] = await db.insert(categories).values({
    userId: DEMO_USER_ID,
    categoryName: "Gaji Utama",
    classification: "income",
    icon: "salary",
    color: "emerald",
  }).returning();

  // 5. Create Transactions
  console.log("Creating transactions...");
  await db.insert(transactions).values([
    {
      userId: DEMO_USER_ID,
      walletId: bca.id,
      categoryId: salary.id,
      amount: "8000000",
      memo: "Gaji Bulan Maret",
      transactedAt: new Date(),
    },
    {
      userId: DEMO_USER_ID,
      walletId: cash.id,
      categoryId: food.id,
      amount: "550000",
      memo: "Makan Siang Tim",
      transactedAt: new Date(),
    }
  ]);

  console.log("--- Seed Completed Successfully ---");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
