import { relations } from "drizzle-orm";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "./auth";
import {
  wallets,
  categories,
  transactions,
  walletTransfers,
} from "./wallets";

// ============================================
// Relations untuk Tabel Autentikasi
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  wallets: many(wallets),
  categories: many(categories),
  transactions: many(transactions),
  walletTransfers: many(walletTransfers),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokensRelations = relations(verificationTokens, () => ({}));

// ============================================
// Relations untuk Tabel Wallets & Transactions
// ============================================

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  sourceTransfers: many(walletTransfers, { relationName: "sourceTransfers" }),
  targetTransfers: many(walletTransfers, { relationName: "targetTransfers" }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const walletTransfersRelations = relations(walletTransfers, ({ one }) => ({
  user: one(users, {
    fields: [walletTransfers.userId],
    references: [users.id],
  }),
  sourceWallet: one(wallets, {
    fields: [walletTransfers.sourceId],
    references: [wallets.id],
    relationName: "sourceTransfers",
  }),
  targetWallet: one(wallets, {
    fields: [walletTransfers.targetId],
    references: [wallets.id],
    relationName: "targetTransfers",
  }),
}));
