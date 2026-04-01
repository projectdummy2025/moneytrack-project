import { pgTable, text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";
import { users } from "./auth";

// ============================================
// B. Tabel Wallets (Dompet/Bank)
// ============================================

/**
 * Wallets
 * Mencatat dompet/bank/rekening milik user.
 */
export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  walletName: text("wallet_name").notNull(), // Misal: "Bank BCA", "Dompet Tunai"
  walletType: text("wallet_type").notNull(), // Misal: "bank", "cash", "e-wallet"
  balance: numeric("balance", { precision: 15, scale: 2 }).default("0").notNull(),
  currencyCode: text("currency_code").default("IDR").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// C. Tabel Categories
// ============================================

/**
 * Categories
 * Kategori kustom untuk pengeluaran dan pemasukan.
 */
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  categoryName: text("category_name").notNull(),
  classification: text("classification", { enum: ["income", "expense"] }).notNull(),
  icon: text("icon"), // Nama ikon (misal: "utensils", "car")
  color: text("color"), // Kode warna hex
});

// ============================================
// D. Tabel Transactions (Incomes/Expenses)
// ============================================

/**
 * Transactions
 * Mencatat aliran uang masuk atau keluar yang memiliki kategori.
 */
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  walletId: uuid("wallet_id")
    .references(() => wallets.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),

  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  transactedAt: timestamp("transacted_at").notNull(),
  memo: text("memo"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// E. Tabel Wallet Transfers (Pindah Saldo)
// ============================================

/**
 * Wallet Transfers
 * Khusus untuk mencatat kegiatan memindahkan uang antar rekening/dompet pribadi.
 * Tidak memerlukan kategori.
 */
export const walletTransfers = pgTable("wallet_transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),

  sourceId: uuid("source_id")
    .references(() => wallets.id, { onDelete: "cascade" })
    .notNull(),
  targetId: uuid("target_id")
    .references(() => wallets.id, { onDelete: "cascade" })
    .notNull(),

  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  transactedAt: timestamp("transacted_at").notNull(),
  memo: text("memo"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
