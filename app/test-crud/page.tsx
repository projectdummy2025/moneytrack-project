"use client";

import { useEffect, useState } from "react";

interface Wallet {
  id: string;
  walletName: string;
  walletType: string;
  balance: string;
  currencyCode: string;
  createdAt: string;
}

interface Category {
  id: string;
  categoryName: string;
  classification: "income" | "expense";
  icon?: string;
  color?: string;
}

interface Transaction {
  id: string;
  amount: string;
  transactedAt: string;
  memo?: string;
  walletName: string;
  categoryName: string;
  classification: string;
}

export default function TestCrudPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [walletForm, setWalletForm] = useState({ walletName: "", walletType: "cash" });
  const [initialBalanceForm, setInitialBalanceForm] = useState<{ walletId: string; amount: string } | null>(null);
  const [categoryForm, setCategoryForm] = useState({ categoryName: "", classification: "expense" as "income" | "expense", icon: "", color: "" });
  const [transactionForm, setTransactionForm] = useState({ walletId: "", categoryId: "", amount: "", transactedAt: new Date().toISOString().slice(0, 16), memo: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wRes, cRes, tRes] = await Promise.all([
        fetch("/api/wallets"),
        fetch("/api/categories"),
        fetch("/api/transactions"),
      ]);
      setWallets(await wRes.json());
      setCategories(await cRes.json());
      setTransactions(await tRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/wallets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(walletForm),
    });
    setWalletForm({ walletName: "", walletType: "cash" });
    fetchData();
  };

  const handleAddInitialBalance = async (walletId: string, amount: string) => {
    await fetch("/api/wallets/initial-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletId, amount }),
    });
    setInitialBalanceForm(null);
    fetchData();
  };

  const handleDeleteWallet = async (id: string) => {
    await fetch(`/api/wallets/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryForm),
    });
    setCategoryForm({ categoryName: "", classification: "expense", icon: "", color: "" });
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionForm),
    });
    setTransactionForm({ walletId: "", categoryId: "", amount: "", transactedAt: new Date().toISOString().slice(0, 16), memo: "" });
    fetchData();
  };

  const handleDeleteTransaction = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">MoneyTrack - Test CRUD</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wallets Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">💰 Wallets</h2>
            <form onSubmit={handleCreateWallet} className="mb-4 space-y-3">
              <input
                type="text"
                placeholder="Wallet Name"
                value={walletForm.walletName}
                onChange={(e) => setWalletForm({ ...walletForm, walletName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
                required
              />
              <select
                value={walletForm.walletType}
                onChange={(e) => setWalletForm({ ...walletForm, walletType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="e-wallet">E-Wallet</option>
              </select>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 text-sm">
                Add Wallet
              </button>
            </form>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {wallets.map((w) => (
                <div key={w.id} className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{w.walletName}</p>
                      <p className="text-xs text-gray-500">{w.walletType} • {w.balance} {w.currencyCode}</p>
                    </div>
                    <div className="flex gap-2">
                      {initialBalanceForm?.walletId === w.id ? (
                        <div className="flex gap-1">
                          <input
                            type="number"
                            placeholder="Amount"
                            className="w-20 px-2 py-1 border rounded text-xs"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const input = e.currentTarget;
                                if (input.value) handleAddInitialBalance(w.id, input.value);
                              }
                            }}
                          />
                          <button
                            onClick={() => setInitialBalanceForm(null)}
                            className="text-gray-500 hover:text-gray-700 text-sm px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setInitialBalanceForm({ walletId: w.id, amount: "" })}
                          className="text-green-500 hover:text-green-700 text-xs"
                        >
                          + Saldo
                        </button>
                      )}
                      <button onClick={() => handleDeleteWallet(w.id)} className="text-red-500 hover:text-red-700 text-sm">
                        ✕
                      </button>
                    </div>
                  </div>
                  {initialBalanceForm?.walletId === w.id && (
                    <div className="flex gap-2 px-2">
                      <input
                        type="number"
                        placeholder="Initial Balance"
                        className="flex-1 px-2 py-1 border rounded text-xs"
                        id={`initial-balance-${w.id}`}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`initial-balance-${w.id}`) as HTMLInputElement;
                          if (input?.value) handleAddInitialBalance(w.id, input.value);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Categories</h2>
            <form onSubmit={handleCreateCategory} className="mb-4 space-y-3">
              <input
                type="text"
                placeholder="Category Name"
                value={categoryForm.categoryName}
                onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
                required
              />
              <select
                value={categoryForm.classification}
                onChange={(e) => setCategoryForm({ ...categoryForm, classification: e.target.value as "income" | "expense" })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                type="text"
                placeholder="Icon (optional)"
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <input
                type="color"
                value={categoryForm.color || "#000000"}
                onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                className="w-full h-8 border rounded-md"
              />
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 text-sm">
                Add Category
              </button>
            </form>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map((c) => (
                <div key={c.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color || "#ccc" }} />
                    <div>
                      <p className="font-medium text-sm">{c.categoryName}</p>
                      <p className="text-xs text-gray-500">{c.classification}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCategory(c.id)} className="text-red-500 hover:text-red-700 text-sm">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Section */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">💸 Transactions</h2>
            <form onSubmit={handleCreateTransaction} className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={transactionForm.walletId}
                onChange={(e) => setTransactionForm({ ...transactionForm, walletId: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm"
                required
              >
                <option value="">Select Wallet</option>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>{w.walletName}</option>
                ))}
              </select>
              <select
                value={transactionForm.categoryId}
                onChange={(e) => setTransactionForm({ ...transactionForm, categoryId: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.categoryName}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={transactionForm.amount}
                onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm"
                required
              />
              <input
                type="datetime-local"
                value={transactionForm.transactedAt}
                onChange={(e) => setTransactionForm({ ...transactionForm, transactedAt: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm"
                required
              />
              <input
                type="text"
                placeholder="Memo (optional)"
                value={transactionForm.memo}
                onChange={(e) => setTransactionForm({ ...transactionForm, memo: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm"
              />
              <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 text-sm">
                Add Transaction
              </button>
            </form>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Wallet</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-left">Memo</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="px-4 py-2">{new Date(t.transactedAt).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${t.classification === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {t.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-2">{t.walletName}</td>
                      <td className={`px-4 py-2 text-right font-medium ${t.classification === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.classification === 'income' ? '+' : '-'} {t.amount}
                      </td>
                      <td className="px-4 py-2 text-gray-500">{t.memo || "-"}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleDeleteTransaction(t.id)} className="text-red-500 hover:text-red-700">
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <p className="text-center text-gray-500 py-8">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
