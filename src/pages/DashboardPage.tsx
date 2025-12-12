import { useTransactions } from '../hooks/useTransactions';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { Header } from '../components/layout/Header';
import { formatCurrency } from '../utils/formatters';
import { FaArrowUp, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';

export function DashboardPage() {
  const { expenses, incomes, loading, error, refresh } = useTransactions();

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncomes - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Transacciones</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona y revisa todos tus gastos e ingresos
          </p>
        </div>

        {/* Resumen */}
        {(expenses.length > 0 || incomes.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <FaArrowUp className="h-5 w-5 text-green-600" />
                <div className="text-sm font-medium text-gray-500">Total Ingresos</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(totalIncomes)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <FaMoneyBillWave className="h-5 w-5 text-indigo-600" />
                <div className="text-sm font-medium text-gray-500">Total Gastos</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-indigo-600">
                {formatCurrency(totalExpenses)}
              </div>
            </div>
            <div className={`bg-white rounded-lg shadow-sm border-2 p-4 sm:p-5 ${balance >= 0 ? 'border-green-200' : 'border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <FaChartBar className={`h-5 w-5 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <div className="text-sm font-medium text-gray-500">Balance</div>
              </div>
              <div className={`text-xl sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-gray-600">Cargando transacciones...</div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-800">Error: {error}</div>
          </div>
        )}

        {!loading && !error && expenses.length === 0 && incomes.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <FaChartBar className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300" />
            </div>
            <p className="text-base sm:text-lg text-gray-600 mb-2">No tienes transacciones registradas aún.</p>
            <p className="text-sm text-gray-500 px-4">
              Los gastos e ingresos que registres aparecerán aquí.
            </p>
          </div>
        )}

        {/* Sección de Ingresos */}
        {!loading && !error && incomes.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <FaArrowUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ingresos</h2>
              <span className="text-xs sm:text-sm text-gray-500">({incomes.length})</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {incomes.map(income => (
                <TransactionCard
                  key={income.id}
                  transaction={income}
                  onUpdate={refresh}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sección de Gastos */}
        {!loading && !error && expenses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <FaMoneyBillWave className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gastos</h2>
              <span className="text-xs sm:text-sm text-gray-500">({expenses.length})</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {expenses.map(expense => (
                <TransactionCard
                  key={expense.id}
                  transaction={expense}
                  onUpdate={refresh}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
