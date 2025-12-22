import { useState } from 'react';
import type { Transaction } from '../../types/transaction.types';
import { transactionsService } from '../../services/transactions.service';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { normalizeImageUrl } from '../../utils/image';
import { TransactionDeleteConfirm } from './TransactionDeleteConfirm';
import { ExpenseImagePlaceholder } from '../expenses/ExpenseImagePlaceholder';
import { isIncome } from '../../types/transaction.types';

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Helper para obtener estilos según el tipo
function getTransactionStyles(type: 'expense' | 'income') {
  if (isIncome({ type } as Transaction)) {
    return {
      amountColor: 'text-secondary-600',
      title: 'Detalles del Ingreso',
      buttonColor: 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500',
    };
  }
  return {
    amountColor: 'text-primary-600',
    title: 'Detalles del Gasto',
    buttonColor: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
  };
}

export function TransactionDetail({ transaction, onClose, onEdit, onDelete }: TransactionDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const styles = getTransactionStyles(transaction.type);
  
  const normalizedImageUrl = normalizeImageUrl(transaction.imageUrl);
  const showImage = normalizedImageUrl && !imageError;

  async function handleDelete() {
    try {
      await transactionsService.delete(transaction.id);
      onDelete();
      onClose();
    } catch (error) {
      alert(`Error al eliminar ${transaction.type === 'income' ? 'el ingreso' : 'el gasto'}`);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
        <div className="bg-white rounded-none sm:rounded-lg max-w-2xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <p className="mt-1 text-lg text-gray-900">{transaction.description}</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Monto</label>
                <p className={`mt-1 text-2xl font-bold ${styles.amountColor}`}>
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Categoría</label>
                <p className="mt-1 text-lg text-gray-900">
                  {transaction.category?.name || 'Sin categoría'}
                </p>
              </div>
              
              {transaction.type === 'expense' && (
                <div className="border-b border-gray-200 pb-4">
                  <label className="text-sm font-medium text-gray-500">Bolsillo</label>
                  <p className="mt-1 text-lg text-gray-900">
                    {transaction.pocket?.name || 'Sin bolsillo'}
                  </p>
                </div>
              )}
              
              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Fecha</label>
                <p className="mt-1 text-lg text-gray-900">
                  {formatDateTime(transaction.occurredAt)}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="text-sm font-medium text-gray-500">Imagen</label>
                <div className="mt-2 flex justify-center">
                  {showImage ? (
                    <img
                      src={normalizedImageUrl}
                      alt={transaction.description}
                      className="max-w-full h-auto rounded-lg shadow-sm"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <ExpenseImagePlaceholder size="large" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onEdit}
                className={`flex-1 px-4 py-3 sm:py-2 text-sm font-medium text-white ${styles.buttonColor} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
              >
                Editar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 px-4 py-3 sm:py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <TransactionDeleteConfirm
          transaction={transaction}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}

