import { apiRequest } from './api';
import { API_BASE_URL } from './api';
import type { Transaction, Expense, Income, UpdateTransactionDto } from '../types/transaction.types';

export const transactionsService = {
  /**
   * Obtiene todos los gastos del usuario autenticado
   */
  async getExpenses(): Promise<Expense[]> {
    return apiRequest<Expense[]>('/transactions');
  },

  /**
   * Obtiene todos los ingresos del usuario autenticado
   */
  async getIncomes(): Promise<Income[]> {
    return apiRequest<Income[]>('/transactions/incomes');
  },

  /**
   * Obtiene una transacción específica por ID
   */
  async getById(id: number): Promise<Transaction> {
    return apiRequest<Transaction>(`/transactions/${id}`);
  },

  /**
   * Actualiza una transacción
   */
  async update(id: number, data: UpdateTransactionDto): Promise<Transaction> {
    return apiRequest<Transaction>(`/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Elimina una transacción
   */
  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Exporta todas las transacciones a Excel
   */
  async exportToExcel(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/export/excel`, {
        method: 'GET',
        credentials: 'include', // Incluir cookies para autenticación
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        throw new Error(`Error al exportar: ${response.statusText}`);
      }

      // Obtener el nombre del archivo del header Content-Disposition o usar uno por defecto
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'finanzas-personales.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Convertir respuesta a blob
      const blob = await response.blob();

      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  },
};

