# MoneyTrack

Personal finance tracking application built with Next.js 16, Drizzle ORM, and PostgreSQL.

## Features

- 💰 **Wallets Management** - Track multiple wallets, banks, and e-wallets
- 📋 **Categories** - Custom income and expense categories
- 💸 **Transactions** - Record income and expenses with automatic balance updates
- 🔄 **Wallet Transfers** - Transfer balance between wallets
- 📊 **Audit Trail** - All balance changes tracked as transactions

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moneytrack
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# .env
DATABASE_URL=postgresql://postgres:admin0123@127.0.0.1:5432/money-track
```

4. Generate and apply database migrations:
```bash
npm run db:generate
npm run db:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `users` | User profiles (for future auth) |
| `accounts` | OAuth provider linking |
| `sessions` | Active user sessions |
| `wallets` | Wallets, banks, e-wallets |
| `categories` | Income/expense categories |
| `transactions` | Financial transactions |
| `wallet_transfers` | Inter-wallet transfers |
| `verification_tokens` | Email verification tokens |

### Key Design Decisions

1. **Balance Tracking**: Wallet balance is updated automatically when transactions are created/deleted
2. **Initial Balance**: Wallet starts at 0, initial balance is recorded as a transaction (category: "Saldo Awal")
3. **Audit Trail**: All money movements are tracked as transactions for full audit capability
4. **No Auth (Current)**: `userId` is nullable for testing without authentication

## API Endpoints

### Wallets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallets` | List all wallets |
| POST | `/api/wallets` | Create new wallet (balance = 0) |
| GET | `/api/wallets/:id` | Get wallet by ID |
| PUT | `/api/wallets/:id` | Update wallet |
| DELETE | `/api/wallets/:id` | Delete wallet |
| POST | `/api/wallets/initial-balance` | Add initial balance via transaction |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create new category |
| GET | `/api/categories/:id` | Get category by ID |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List all transactions (with wallet & category) |
| POST | `/api/transactions` | Create new transaction (auto-updates wallet balance) |
| GET | `/api/transactions/:id` | Get transaction by ID |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction (reverts wallet balance) |

## Testing CRUD

A test page is available at **`/test-crud`**:

```
http://localhost:3000/test-crud
```

### Test Flow

1. **Create Wallet**
   - Enter wallet name and type
   - Click "Add Wallet"
   - Wallet created with balance = 0

2. **Add Initial Balance**
   - Click "+ Saldo" on the wallet
   - Enter initial amount
   - Creates transaction with category "Saldo Awal"

3. **Create Categories**
   - Add income categories (e.g., "Salary", "Bonus")
   - Add expense categories (e.g., "Food", "Transport")

4. **Create Transactions**
   - Select wallet and category
   - Enter amount and date
   - Wallet balance updates automatically

## Database Commands

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly (development only)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Project Structure

```
moneytrack/
├── app/
│   ├── api/
│   │   ├── wallets/          # Wallet API routes
│   │   ├── categories/       # Category API routes
│   │   └── transactions/     # Transaction API routes
│   ├── test-crud/            # Test CRUD UI page
│   ├── layout.tsx
│   └── page.tsx
├── db/
│   ├── lib/
│   │   └── db.ts             # Database connection
│   ├── schema/
│   │   ├── auth.ts           # Auth tables (users, accounts, sessions)
│   │   ├── wallets.ts        # Wallet, category, transaction tables
│   │   ├── relations.ts      # Table relations
│   │   └── index.ts          # Schema exports
│   └── env.mjs               # Environment validation
├── drizzle/                  # Migration files
├── drizzle.config.ts         # Drizzle Kit config
└── .env                      # Environment variables
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

MIT
