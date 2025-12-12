import type { Transaction } from '../../types/transaction.types';
import { isIncome } from '../../types/transaction.types';

interface TransactionDeleteConfirmProps {
  transaction: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TransactionDeleteConfirm({
  transaction,
  onConfirm,
  onCancel,
}: TransactionDeleteConfirmProps) {
  const transactionType = isIncome(transaction) ? 'ingreso' : 'gasto';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            ¿Estás seguro de que deseas eliminar el {transactionType} <strong>"{transaction.description}"</strong>?
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 sm:py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

