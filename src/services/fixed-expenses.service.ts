import { apiRequest } from './api';
import type {
  CreateFixedExpenseDto,
  FixedExpense,
  PayFixedExpenseDto,
  UpdateFixedExpenseDto,
} from '../types/fixed-expense.types';

export const fixedExpensesService = {
  async getAll(): Promise<FixedExpense[]> {
    return apiRequest<FixedExpense[]>('/fixed-expenses');
  },

  async create(data: CreateFixedExpenseDto): Promise<FixedExpense> {
    return apiRequest<FixedExpense>('/fixed-expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: UpdateFixedExpenseDto): Promise<FixedExpense> {
    return apiRequest<FixedExpense>(`/fixed-expenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async remove(id: number): Promise<void> {
    return apiRequest<void>(`/fixed-expenses/${id}`, {
      method: 'DELETE',
    });
  },

  async pay(id: number, data: PayFixedExpenseDto): Promise<void> {
    await apiRequest(`/fixed-expenses/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
