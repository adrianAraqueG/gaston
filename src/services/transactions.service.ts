import { apiRequest } from './api';
import type { Transaction, Expense, Income, UpdateTransactionDto } from '../types/transaction.types';

export const transactionsService = {
  /**
   * Obtiene todos los gastos del usuario autenticado
   */
  async getExpenses(): Promise<Expense[]> {
    return apiRequest<Expense[]>('/transactions');
  },

  /**
   * Obtiene todos los ingresos del usuario autenticado
   */
  async getIncomes(): Promise<Income[]> {
    return apiRequest<Income[]>('/transactions/incomes');
  },

  /**
   * Obtiene una transacción específica por ID
   */
  async getById(id: number): Promise<Transaction> {
    return apiRequest<Transaction>(`/transactions/${id}`);
  },

  /**
   * Actualiza una transacción
   */
  async update(id: number, data: UpdateTransactionDto): Promise<Transaction> {
    return apiRequest<Transaction>(`/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Elimina una transacción
   */
  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};

