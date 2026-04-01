import { pgTable, text, timestamp, uuid, integer, primaryKey } from "drizzle-orm/pg-core";

// ============================================
// A. Tabel Autentikasi (Normalized)
// ============================================

/**
 * Users (Profil Publik)
 * Hanya menyimpan informasi dasar profil.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"), // Hashed password (jika menggunakan kredensial)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Accounts (Sensitive - OAuth Linking)
 * Menyimpan token OAuth dari provider (Google, GitHub, dll).
 * Terpisah dari user agar satu user bisa punya banyak metode login.
 */
export const accounts = pgTable("accounts", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(), // e.g., "oauth", "oidc"
  provider: text("provider").notNull(), // e.g., "google"
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (table) => ({
  pk: primaryKey({
    columns: [table.provider, table.providerAccountId],
  }),
}));

/**
 * Sessions (Active Logins)
 * Untuk melacak sesi aktif pengguna di browser.
 */
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

/**
 * VerificationTokens (Security)
 * Untuk keperluan reset password atau login via Magic Link.
 */
export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (table) => ({
  pk: primaryKey({
    columns: [table.identifier, table.token],
  }),
}));
