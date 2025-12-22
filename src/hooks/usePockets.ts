import { useState, useEffect } from 'react';
import { pocketsService } from '../services/pockets.service';
import type { Pocket } from '../types/pocket.types';

export function usePockets() {
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPockets() {
    try {
      setLoading(true);
      setError(null);
      const data = await pocketsService.getAll();
      setPockets(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar bolsillos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPockets();
  }, []);

  return {
    pockets,
    loading,
    error,
    refresh: loadPockets,
  };
}

