# Database Schema - MoneyTrack

Dokumen ini mendefinisikan struktur database menggunakan **Drizzle ORM** dengan dialek **PostgreSQL**.

## 1. Entity Relationship Diagram (ERD) - Logika
Secara konseptual, relasi antar tabel adalah sebagai berikut:
- **User** memiliki banyak **Accounts** (1:N)
- **User** memiliki banyak **Categories** (1:N)
- **User** memiliki banyak **Transactions** (1:N)
- **Account** memiliki banyak **Transactions** (1:N)
- **Category** memiliki banyak **Transactions** (1:N)
- **Transaction (Transfer)** melibatkan dua **Accounts** (Source & Destination).

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

### B. Tabel Accounts (Dompet/Bank)
Menyimpan saldo dan informasi akun keuangan.
```typescript
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(), // Misal: "Bank BCA", "Dompet Tunai"
  type: text("type").notNull(), // Misal: "bank", "cash", "e-wallet"
  balance: numeric("balance", { precision: 15, scale: 2 }).default("0").notNull(),
  currency: text("currency").default("IDR").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### C. Tabel Categories
Kategori kustom untuk pengeluaran dan pemasukan.
```typescript
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  icon: text("icon"), // Nama ikon (misal: "utensils", "car")
  color: text("color"), // Kode warna hex
});
```

### D. Tabel Transactions
Inti dari aplikasi, mencatat setiap aliran uang.
```typescript
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  accountId: uuid("account_id").references(() => accounts.id, { onDelete: "cascade" }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  note: text("note"),
  
  type: text("type", { enum: ["income", "expense", "transfer"] }).notNull(),
  
  // Khusus untuk transfer antar akun
  toAccountId: uuid("to_account_id").references(() => accounts.id, { onDelete: "cascade" }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## 3. Catatan Penting
1. **Precision Numeric:** Menggunakan `numeric(15, 2)` untuk menghindari masalah floating point pada perhitungan uang.
2. **OnDelete Cascade:** Jika user menghapus akunnya, semua data terkait (wallet & transaksi) akan ikut terhapus otomatis.
3. **Transfer Logic:** Jika `type` adalah `transfer`, maka `toAccountId` harus diisi. Di level aplikasi, ini akan memicu pengurangan di `accountId` dan penambahan di `toAccountId`.
4. **Index:** Disarankan menambahkan index pada kolom `userId` dan `date` untuk mempercepat query laporan bulanan.
