export interface Category {
  id: number;
  name: string;
  type: 'expense' | 'income';
  accountId: number;
  isActive: boolean;
  isDefault: boolean;
}

export interface CreateCategoryDto {
  name: string;
  type?: 'expense' | 'income';
}

export interface UpdateCategoryDto {
  name?: string;
  type?: 'expense' | 'income';
  isActive?: boolean;
}

