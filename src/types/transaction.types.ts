export interface Category {
  id: number;
  name: string;
}

export interface Pocket {
  id: number;
  name: string;
}

export interface Transaction {
  id: number;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category?: Category;
  pocket?: Pocket | null;
  occurredAt: string;
  createdBy: number;
  accountId: number;
  year: number;
  month: number;
  imageUrl?: string | null;
}

// Tipos específicos para compatibilidad y type guards
export interface Expense extends Transaction {
  type: 'expense';
}

export interface Income extends Transaction {
  type: 'income';
}

export interface CreateTransactionDto {
  type: 'expense' | 'income';
  amount: number;
  description: string;
  categoryId?: number;
  pocketId?: number | null;
  occurredAt?: string;
}

export interface UpdateTransactionDto {
  amount?: number;
  description?: string;
  categoryId?: number;
  pocketId?: number | null;
  occurredAt?: string;
}

// Mantener UpdateExpenseDto como alias para compatibilidad
export type UpdateExpenseDto = UpdateTransactionDto;

// Type guards
export function isExpense(transaction: Transaction): transaction is Expense {
  return transaction.type === 'expense';
}

export function isIncome(transaction: Transaction): transaction is Income {
  return transaction.type === 'income';
}

