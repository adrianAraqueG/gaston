import { transactionsService } from './transactions.service';
import type { Expense, UpdateExpenseDto } from '../types/transaction.types';

/**
 * @deprecated Usar transactionsService en su lugar
 * Mantenido por compatibilidad hacia atrás
 */
export const expensesService = {
  /**
   * Obtiene todos los gastos del usuario autenticado
   */
  async getAll(): Promise<Expense[]> {
    return transactionsService.getExpenses();
  },

  /**
   * Obtiene un gasto específico por ID
   */
  async getById(id: number): Promise<Expense> {
    return transactionsService.getById(id) as Promise<Expense>;
  },

  /**
   * Actualiza un gasto
   */
  async update(id: number, data: UpdateExpenseDto): Promise<Expense> {
    return transactionsService.update(id, data) as Promise<Expense>;
  },

  /**
   * Elimina un gasto
   */
  async delete(id: number): Promise<void> {
    return transactionsService.delete(id);
  },
};

