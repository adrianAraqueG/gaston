export interface Pocket {
  id: number;
  name: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  accountId: number;
}

export interface CreatePocketDto {
  name: string;
  description?: string;
}

export interface UpdatePocketDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

