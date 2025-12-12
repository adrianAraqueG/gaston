export interface Category {
  id: number;
  name: string;
}

export interface Pocket {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  type: 'expense';
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

export interface UpdateExpenseDto {
  amount?: number;
  description?: string;
  categoryId?: number;
  pocketId?: number | null;
  occurredAt?: string;
}

