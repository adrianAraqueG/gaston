import { apiRequest } from './api';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';

export const categoriesService = {
  /**
   * Obtiene todas las categorías del usuario autenticado
   */
  async getAll(type?: 'expense' | 'income'): Promise<Category[]> {
    const query = type ? `?type=${type}` : '';
    return apiRequest<Category[]>(`/categories${query}`);
  },

  /**
   * Obtiene una categoría específica por ID
   */
  async getById(id: number): Promise<Category> {
    return apiRequest<Category>(`/categories/${id}`);
  },

  /**
   * Crea una nueva categoría
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    return apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualiza una categoría
   */
  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    return apiRequest<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Elimina una categoría
   */
  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

