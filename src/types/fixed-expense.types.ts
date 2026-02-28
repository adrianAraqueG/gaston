export interface FixedExpenseCategory {
  id: number;
  name: string;
}

export interface FixedExpense {
  id: number;
  name: string;
  defaultAmount: number;
  category?: FixedExpenseCategory | null;
  isActive: boolean;
  createdBy: number;
  accountId: number;
  paidThisMonth: boolean;
  lastPaidAt?: string | null;
}

export interface CreateFixedExpenseDto {
  name: string;
  defaultAmount: number;
  categoryId?: number;
}

export interface UpdateFixedExpenseDto {
  name?: string;
  defaultAmount?: number;
  categoryId?: number;
}

export interface PayFixedExpenseDto {
  amount?: number;
  occurredAt?: string;
}
