import { useState, useEffect } from 'react';
import { expensesService } from '../services/expenses.service';
import type { Expense, UpdateExpenseDto } from '../types/transaction.types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadExpenses() {
    try {
      setLoading(true);
      setError(null);
      const data = await expensesService.getAll();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar gastos');
    } finally {
      setLoading(false);
    }
  }

  async function deleteExpense(id: number) {
    try {
      await expensesService.delete(id);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Error al eliminar gasto');
    }
  }

  async function updateExpense(id: number, data: UpdateExpenseDto) {
    try {
      const updated = await expensesService.update(id, data);
      setExpenses(expenses.map(e => e.id === id ? updated : e));
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Error al actualizar gasto');
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    refresh: loadExpenses,
    deleteExpense,
    updateExpense,
  };
}

