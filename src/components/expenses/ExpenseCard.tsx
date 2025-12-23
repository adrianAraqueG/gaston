import { useState } from 'react';
import type { Expense } from '../../types/expense.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ExpenseDetail } from './ExpenseDetail';
import { ExpenseEditForm } from './ExpenseEditForm';

interface ExpenseCardProps {
  expense: Expense;
  onUpdate: () => void;
}

export function ExpenseCard({ expense, onUpdate }: ExpenseCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {expense.description}
          </h3>
          <p className="text-2xl font-bold text-expense-600 mb-2">
            {formatCurrency(expense.amount)}
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {expense.category?.name || 'Sin categoría'}
            </span>
            {expense.pocket && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {expense.pocket.name}
              </span>
            )}
            <span className="bg-gray-100 px-2 py-1 rounded">
              {formatDate(expense.occurredAt)}
            </span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShowDetail(true)}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-expense-500"
          >
            Ver Detalles
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-expense-600 rounded-md hover:bg-expense-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-expense-500"
          >
            Editar
          </button>
        </div>
      </div>

      {showDetail && (
        <ExpenseDetail
          expense={expense}
          onClose={() => setShowDetail(false)}
          onEdit={() => {
            setShowDetail(false);
            setShowEdit(true);
          }}
          onDelete={onUpdate}
        />
      )}

      {showEdit && (
        <ExpenseEditForm
          expense={expense}
          onClose={() => setShowEdit(false)}
          onSave={onUpdate}
        />
      )}
    </>
  );
}

