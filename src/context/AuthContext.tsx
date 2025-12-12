import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar la app
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      // skip401Redirect: true para evitar bucle infinito cuando no hay sesión
      const currentUser = await authService.getCurrentUser(true);
      setUser(currentUser);
    } catch (error) {
      // Si no hay sesión, simplemente establecer user como null
      // No redirigir aquí para evitar bucles
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await authService.login({ email, password });
    setUser(response.user);
    
    // Si debe cambiar contraseña, redirigir
    if (response.mustChangePassword) {
      window.location.href = '/change-password';
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    window.location.href = '/login';
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    await authService.changePassword({ currentPassword, newPassword });
    // Refrescar usuario para actualizar mustChangePassword
    await refreshUser();
  }

  async function refreshUser() {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, changePassword, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

