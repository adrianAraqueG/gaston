import { useState } from 'react';
import type { Expense } from '../../types/expense.types';
import { expensesService } from '../../services/expenses.service';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { normalizeImageUrl } from '../../utils/image';
import { ExpenseDeleteConfirm } from './ExpenseDeleteConfirm';
import { ExpenseImagePlaceholder } from './ExpenseImagePlaceholder';

interface ExpenseDetailProps {
  expense: Expense;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExpenseDetail({ expense, onClose, onEdit, onDelete }: ExpenseDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const normalizedImageUrl = normalizeImageUrl(expense.imageUrl);
  const showImage = normalizedImageUrl && !imageError;

  async function handleDelete() {
    try {
      await expensesService.delete(expense.id);
      onDelete();
      onClose();
    } catch (error) {
      alert('Error al eliminar el gasto');
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Detalles del Gasto</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <p className="mt-1 text-lg text-gray-900">{expense.description}</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Monto</label>
                <p className="mt-1 text-2xl font-bold text-expense-600">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Categoría</label>
                <p className="mt-1 text-lg text-gray-900">
                  {expense.category?.name || 'Sin categoría'}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Bolsillo</label>
                <p className="mt-1 text-lg text-gray-900">
                  {expense.pocket?.name || 'Sin bolsillo'}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Fecha</label>
                <p className="mt-1 text-lg text-gray-900">
                  {formatDateTime(expense.occurredAt)}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Imagen</label>
                <div className="mt-2 flex justify-center">
                  {showImage ? (
                    <img
                      src={normalizedImageUrl}
                      alt={expense.description}
                      className="max-w-full h-auto rounded-lg shadow-sm"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <ExpenseImagePlaceholder size="large" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onEdit}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-expense-600 rounded-md hover:bg-expense-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-expense-500"
              >
                Editar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ExpenseDeleteConfirm
          expense={expense}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}

