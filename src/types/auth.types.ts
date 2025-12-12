export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string | null;
  name: string;
  phone: string | null;
  whatsappId: string | null;
  isActive: boolean;
  onboardingStatus: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  mustChangePassword: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

