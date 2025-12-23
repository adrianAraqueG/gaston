import { useState } from 'react';
import type { Transaction, UpdateTransactionDto } from '../../types/transaction.types';
import { transactionsService } from '../../services/transactions.service';
import { validateAmount } from '../../utils/validators';
import { isIncome } from '../../types/transaction.types';
import { useCategories } from '../../hooks/useCategories';
import { usePockets } from '../../hooks/usePockets';

interface TransactionEditFormProps {
  transaction: Transaction;
  onClose: () => void;
  onSave: () => void;
}

// Helper para obtener estilos según el tipo
function getTransactionStyles(type: 'expense' | 'income') {
  if (isIncome({ type } as Transaction)) {
    return {
      title: 'Editar Ingreso',
      buttonColor: 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500',
      focusColor: 'focus:ring-secondary-500 focus:border-secondary-500',
    };
  }
  return {
    title: 'Editar Gasto',
    buttonColor: 'bg-expense-600 hover:bg-expense-700 focus:ring-expense-500',
    focusColor: 'focus:ring-expense-500 focus:border-expense-500',
  };
}

export function TransactionEditForm({ transaction, onClose, onSave }: TransactionEditFormProps) {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [description, setDescription] = useState(transaction.description);
  const [categoryId, setCategoryId] = useState<number | undefined>(transaction.category?.id);
  const [pocketId, setPocketId] = useState<number | null | undefined>(transaction.pocket?.id ?? null);
  const [occurredAt, setOccurredAt] = useState(
    new Date(transaction.occurredAt).toISOString().slice(0, 16)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const styles = getTransactionStyles(transaction.type);
  
  const { categories, loading: categoriesLoading } = useCategories(transaction.type);
  const { pockets, loading: pocketsLoading } = usePockets();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const amountNum = parseFloat(amount);
    if (!validateAmount(amountNum)) {
      setError('El monto debe ser mayor que 0');
      setLoading(false);
      return;
    }

    const updateData: UpdateTransactionDto = {
      amount: amountNum,
      description,
      categoryId,
      pocketId: isIncome(transaction) ? null : (pocketId ?? null),
      occurredAt: new Date(occurredAt).toISOString(),
    };

    try {
      await transactionsService.update(transaction.id, updateData);
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || `Error al actualizar ${transaction.type === 'income' ? 'ingreso' : 'gasto'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-none sm:rounded-lg max-w-md w-full h-full sm:h-auto overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{styles.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl font-bold p-2 -mr-2"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Monto
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className={`mt-1 block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${styles.focusColor} text-base sm:text-sm`}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={`mt-1 block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${styles.focusColor} text-base sm:text-sm`}
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Categoría {categoriesLoading && '(Cargando...)'}
              </label>
              <select
                id="categoryId"
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
                className={`mt-1 block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${styles.focusColor} text-base sm:text-sm`}
              >
                <option value="">Sin categoría</option>
                {categories.filter(cat => cat.type === transaction.type).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {!categoriesLoading && categories.filter(cat => cat.type === transaction.type).length === 0 && (
                <p className="mt-1 text-sm text-gray-500">No hay categorías de este tipo disponibles</p>
              )}
            </div>

            {!isIncome(transaction) && (
              <div>
                <label htmlFor="pocketId" className="block text-sm font-medium text-gray-700">
                  Bolsillo {pocketsLoading && '(Cargando...)'}
                </label>
                <select
                  id="pocketId"
                  value={pocketId ?? ''}
                  onChange={(e) => setPocketId(e.target.value ? parseInt(e.target.value) : null)}
                  className={`mt-1 block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${styles.focusColor} text-base sm:text-sm`}
                >
                  <option value="">Sin bolsillo</option>
                  {pockets.map(pocket => (
                    <option key={pocket.id} value={pocket.id}>{pocket.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700">
                Fecha
              </label>
              <input
                id="occurredAt"
                type="datetime-local"
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
                required
                className={`mt-1 block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${styles.focusColor} text-base sm:text-sm`}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-4 py-3 sm:py-2 text-sm font-medium text-white ${styles.buttonColor} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

