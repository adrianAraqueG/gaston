import { useState, useEffect } from 'react';
import { transactionsService } from '../services/transactions.service';
import type { Expense, Income, UpdateTransactionDto } from '../types/transaction.types';

export function useTransactions() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTransactions() {
    try {
      setLoading(true);
      setError(null);
      const [expensesData, incomesData] = await Promise.all([
        transactionsService.getExpenses(),
        transactionsService.getIncomes(),
      ]);
      setExpenses(expensesData);
      setIncomes(incomesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  }

  async function deleteTransaction(id: number) {
    try {
      await transactionsService.delete(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setIncomes((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Error al eliminar transaccion');
    }
  }

  async function updateTransaction(id: number, data: UpdateTransactionDto) {
    try {
      const updated = await transactionsService.update(id, data);
      if (updated.type === 'expense') {
        setExpenses((prev) => prev.map((e) => (e.id === id ? (updated as Expense) : e)));
      } else {
        setIncomes((prev) => prev.map((i) => (i.id === id ? (updated as Income) : i)));
      }
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Error al actualizar transaccion');
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    expenses,
    incomes,
    loading,
    error,
    refresh: loadTransactions,
    deleteTransaction,
    updateTransaction,
  };
}
