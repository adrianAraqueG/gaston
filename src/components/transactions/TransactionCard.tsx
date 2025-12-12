import { useState } from 'react';
import type { Transaction } from '../../types/transaction.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TransactionDetail } from './TransactionDetail';
import { TransactionEditForm } from './TransactionEditForm';
import { isIncome } from '../../types/transaction.types';
import { FaArrowUp, FaMoneyBillWave } from 'react-icons/fa';

interface TransactionCardProps {
  transaction: Transaction;
  onUpdate: () => void;
}

// Helper para obtener estilos según el tipo
function getTransactionStyles(type: 'expense' | 'income') {
  if (isIncome({ type } as Transaction)) {
    return {
      amountColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      Icon: FaArrowUp,
      iconColor: 'text-green-600',
    };
  }
  return {
    amountColor: 'text-indigo-600',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    Icon: FaMoneyBillWave,
    iconColor: 'text-indigo-600',
  };
}

export function TransactionCard({ transaction, onUpdate }: TransactionCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const styles = getTransactionStyles(transaction.type);
  const IconComponent = styles.Icon;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <IconComponent className={`h-5 w-5 ${styles.iconColor}`} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex-1">
              {transaction.description}
            </h3>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${styles.amountColor} mb-3`}>
            {formatCurrency(transaction.amount)}
          </p>
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {transaction.category?.name || 'Sin categoría'}
            </span>
            {transaction.pocket && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {transaction.pocket.name}
              </span>
            )}
            <span className="bg-gray-100 px-2 py-1 rounded">
              {formatDate(transaction.occurredAt)}
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowDetail(true)}
            className="flex-1 px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Ver Detalles
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className={`flex-1 px-4 py-2.5 sm:py-2 text-sm font-medium text-white ${styles.buttonColor} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
          >
            Editar
          </button>
        </div>
      </div>

      {showDetail && (
        <TransactionDetail
          transaction={transaction}
          onClose={() => setShowDetail(false)}
          onEdit={() => {
            setShowDetail(false);
            setShowEdit(true);
          }}
          onDelete={onUpdate}
        />
      )}

      {showEdit && (
        <TransactionEditForm
          transaction={transaction}
          onClose={() => setShowEdit(false)}
          onSave={onUpdate}
        />
      )}
    </>
  );
}

