import { apiRequest } from './api';
import type { LoginDto, LoginResponse, User, ChangePasswordDto } from '../types/auth.types';

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   * La cookie session_token se establece automáticamente por el backend
   */
  async login(credentials: LoginDto): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Obtiene el usuario actual desde la sesión
   * skip401Redirect: true para evitar redirección automática durante verificación inicial
   */
  async getCurrentUser(skip401Redirect = false): Promise<User> {
    return apiRequest<User>('/auth/me', { skip401Redirect });
  },

  /**
   * Cambia la contraseña del usuario autenticado
   */
  async changePassword(data: ChangePasswordDto): Promise<void> {
    return apiRequest<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Cierra sesión
   * La cookie session_token se elimina automáticamente por el backend
   */
  async logout(): Promise<void> {
    return apiRequest<void>('/auth/logout', {
      method: 'POST',
    });
  },
};

