import { useCallback, useEffect, useState } from 'react';
import type {
  CreateFixedExpenseDto,
  FixedExpense,
  PayFixedExpenseDto,
  UpdateFixedExpenseDto,
} from '../types/fixed-expense.types';
import { fixedExpensesService } from '../services/fixed-expenses.service';

export function useFixedExpenses() {
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFixedExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fixedExpensesService.getAll();
      setFixedExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar gastos fijos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFixedExpenses();
  }, [loadFixedExpenses]);

  async function createFixedExpense(data: CreateFixedExpenseDto) {
    const created = await fixedExpensesService.create(data);
    setFixedExpenses((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  }

  async function updateFixedExpense(id: number, data: UpdateFixedExpenseDto) {
    const updated = await fixedExpensesService.update(id, data);
    setFixedExpenses((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }

  async function removeFixedExpense(id: number) {
    await fixedExpensesService.remove(id);
    setFixedExpenses((prev) => prev.filter((item) => item.id !== id));
  }

  async function payFixedExpense(id: number, data: PayFixedExpenseDto) {
    await fixedExpensesService.pay(id, data);
    await loadFixedExpenses();
  }

  return {
    fixedExpenses,
    loading,
    error,
    refresh: loadFixedExpenses,
    createFixedExpense,
    updateFixedExpense,
    removeFixedExpense,
    payFixedExpense,
  };
}
