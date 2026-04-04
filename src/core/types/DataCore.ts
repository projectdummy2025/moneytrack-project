export interface Wallet {
  id: string;
  userId: string | null;
  walletName: string;
  walletType: string;
  balance: string;
  currencyCode: string;
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string | null;
  categoryName: string;
  classification: "income" | "expense";
  icon: string | null;
  color: string | null;
}

export interface Transaction {
  id: string;
  amount: string;
  transactedAt: string;
  memo: string | null;
  createdAt: string;
  walletName: string | null;
  walletType: string | null;
  categoryName: string | null;
  classification: "income" | "expense" | null;
  categoryIcon: string | null;
  categoryColor: string | null;
}
