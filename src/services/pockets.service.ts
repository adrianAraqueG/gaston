import { apiRequest } from './api';
import type { Pocket, CreatePocketDto, UpdatePocketDto } from '../types/pocket.types';

export const pocketsService = {
  /**
   * Obtiene todos los bolsillos del usuario autenticado
   */
  async getAll(): Promise<Pocket[]> {
    return apiRequest<Pocket[]>('/pockets');
  },

  /**
   * Obtiene un bolsillo específico por ID
   */
  async getById(id: number): Promise<Pocket> {
    return apiRequest<Pocket>(`/pockets/${id}`);
  },

  /**
   * Crea un nuevo bolsillo
   */
  async create(data: CreatePocketDto): Promise<Pocket> {
    return apiRequest<Pocket>('/pockets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualiza un bolsillo
   */
  async update(id: number, data: UpdatePocketDto): Promise<Pocket> {
    return apiRequest<Pocket>(`/pockets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Elimina un bolsillo
   */
  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/pockets/${id}`, {
      method: 'DELETE',
    });
  },
};

