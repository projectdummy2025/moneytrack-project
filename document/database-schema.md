# Database Schema - MoneyTrack

Dokumen ini mendefinisikan struktur database menggunakan **Drizzle ORM** dengan dialek **PostgreSQL**.

## 1. Entity Relationship Diagram (ERD) - Logika
Secara konseptual, relasi antar tabel adalah sebagai berikut:
- **User** memiliki banyak **Wallets** (1:N)
- **User** memiliki banyak **Categories** (1:N)
- **User** memiliki banyak **Transactions** (1:N)
- **User** memiliki banyak **Wallet Transfers** (1:N)
- **Wallet** memiliki banyak **Transactions** (Incomes/Expenses)
- **Category** memiliki banyak **Transactions** (Classification: Income/Expense)
- **Wallet Transfer** melibatkan dua **Wallets** (**Source** & **Target**) milik user yang sama.

## 2. Definisi Skema (Drizzle ORM)

### A. Tabel Autentikasi (Normalized)

#### 1. Users (Profil Publik)
Hanya menyimpan informasi dasar profil.
```typescript
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"), // Hashed password (jika menggunakan kredensial)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

#### 2. Accounts (Sensitive - OAuth Linking)
Menyimpan token OAuth dari provider (Google, GitHub, dll). Terpisah dari user agar satu user bisa punya banyak metode login.
```typescript
export const accounts = pgTable("accounts", {
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
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
  pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));
```

#### 3. Sessions (Active Logins)
Untuk melacak sesi aktif pengguna di browser.
```typescript
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
```

#### 4. VerificationTokens (Security)
Untuk keperluan reset password atau login via Magic Link.
```typescript
export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.identifier, table.token] }),
}));
```

### B. Tabel Wallets (Dompet/Bank)
```typescript
export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  walletName: text("wallet_name").notNull(), // Misal: "Bank BCA", "Dompet Tunai"
  walletType: text("wallet_type").notNull(), // Misal: "bank", "cash", "e-wallet"
  balance: numeric("balance", { precision: 15, scale: 2 }).default("0").notNull(),
  currencyCode: text("currency_code").default("IDR").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### C. Tabel Categories
Kategori kustom untuk pengeluaran dan pemasukan.
```typescript
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  categoryName: text("category_name").notNull(),
  classification: text("classification", { enum: ["income", "expense"] }).notNull(),
  icon: text("icon"), // Nama ikon (misal: "utensils", "car")
  color: text("color"), // Kode warna hex
});
```

### D. Tabel Transactions (Incomes/Expenses)
Mencatat aliran uang masuk atau keluar yang memiliki kategori.
```typescript
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  walletId: uuid("wallet_id").references(() => wallets.id, { onDelete: "cascade" }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
  
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  transactedAt: timestamp("transacted_at").notNull(),
  memo: text("memo"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### E. Tabel Wallet Transfers (Pindah Saldo)
Khusus untuk mencatat kegiatan memindahkan uang antar rekening/dompet pribadi. Tidak memerlukan kategori.
```typescript
export const walletTransfers = pgTable("wallet_transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  
  sourceId: uuid("source_id").references(() => wallets.id, { onDelete: "cascade" }).notNull(),
  targetId: uuid("target_id").references(() => wallets.id, { onDelete: "cascade" }).notNull(),
  
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  transactedAt: timestamp("transacted_at").notNull(),
  memo: text("memo"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### F. Relationship Logic (Drizzle Relations)
Digunakan untuk mempermudah pengambilan data relasi (seperti Eloquent di Laravel).

```typescript
export const transactionsRelations = relations(transactions, ({ one }) => ({
  wallet: one(wallets, { fields: [transactions.walletId], references: [wallets.id] }),
  category: one(categories, { fields: [transactions.categoryId], references: [categories.id] }),
}));

export const walletTransfersRelations = relations(walletTransfers, ({ one }) => ({
  sourceWallet: one(wallets, { fields: [walletTransfers.sourceId], references: [wallets.id] }),
  targetWallet: one(wallets, { fields: [walletTransfers.targetId], references: [wallets.id] }),
}));
```

## 3. Catatan Penting
1. **Precision Numeric:** Menggunakan `numeric(15, 2)` untuk menghindari masalah floating point pada perhitungan uang.
2. **OnDelete Cascade:** Jika user menghapus akunnya, semua data terkait (wallet, transaksi, & transfer) akan ikut terhapus otomatis.
3. **Pemisahan Logika:** 
   - `transactions` digunakan untuk Pemasukan/Pengeluaran (Wajib ada kategori).
   - `wallet_transfers` digunakan untuk Pindah Saldo sendiri (Wajib ada **Source** & **Target** ID).
4. **Premium Naming:** Menggunakan nama atribut yang deskriptif seperti `transacted_at` untuk waktu kejadian dan `classification` untuk membedakan kategori.
5. **Penanganan Biaya Admin (Code Logic):** Untuk menjaga database tetap simpel dan skalabel, biaya admin transfer tidak dibuatkan kolom khusus. Jika ada transfer yang memiliki biaya (misal: Transfer antar bank), maka di level **Code** akan mencatat dua data:
   - Satu baris di `wallet_transfers` (untuk nominal uang yang benar-benar dipindahkan).
   - Satu baris di `transactions` (sebagai pengeluaran/expense untuk biaya adminnya).
6. **Trial Mode (User-less):** Untuk keperluan ujicoba tanpa login, kolom `userId` dibuat opsional (Nullable). Ini memungkinkan aplikasi berjalan dalam mode "Guest" sebelum akhirnya dihubungkan ke sistem autentikasi penuh.
7. **Index:** Disarankan menambahkan index pada kolom `userId` dan `transacted_at` di kedua tabel utama untuk mempercepat pembuatan laporan bulanan.
