import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionCreateForm } from '../components/transactions/TransactionCreateForm';
import { TransactionDetail } from '../components/transactions/TransactionDetail';
import { TransactionEditForm } from '../components/transactions/TransactionEditForm';
import { Header } from '../components/layout/Header';
import { formatCurrency, formatDate } from '../utils/formatters';
import { transactionsService } from '../services/transactions.service';
import type { Transaction } from '../types/transaction.types';
import {
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaChartLine,
  FaFileExcel,
  FaPlus,
  FaTable,
} from 'react-icons/fa6';

const monthOptions = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

export function DashboardPage() {
  const { expenses, incomes, loading, error, refresh } = useTransactions();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const allTransactions = useMemo(
    () => [...expenses, ...incomes].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()),
    [expenses, incomes],
  );

  const filteredTransactions = useMemo(
    () => allTransactions.filter((tx) => tx.year === selectedYear && tx.month === selectedMonth),
    [allTransactions, selectedYear, selectedMonth],
  );

  const filteredIncomes = useMemo(
    () => filteredTransactions.filter((tx) => tx.type === 'income'),
    [filteredTransactions],
  );

  const filteredExpenses = useMemo(
    () => filteredTransactions.filter((tx) => tx.type === 'expense'),
    [filteredTransactions],
  );

  const totalIncomes = filteredIncomes.reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalIncomes - totalExpenses;

  const totalFlow = totalIncomes + totalExpenses;
  const incomeShare = totalFlow > 0 ? (totalIncomes / totalFlow) * 100 : 0;
  const expenseShare = totalFlow > 0 ? (totalExpenses / totalFlow) * 100 : 0;
  const maxMetric = Math.max(totalIncomes, totalExpenses, 1);

  const years = useMemo(() => {
    const values = new Set<number>(allTransactions.map((tx) => tx.year));
    values.add(currentYear);
    return Array.from(values).sort((a, b) => b - a);
  }, [allTransactions, currentYear]);

  const periodLabel = `${monthOptions[selectedMonth - 1]?.label || ''} ${selectedYear}`;

  const donutStyle = {
    background: `conic-gradient(rgb(var(--success-500)) 0% ${incomeShare}%, rgb(var(--danger-500)) ${incomeShare}% 100%)`,
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await transactionsService.exportToExcel();
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Error al exportar a Excel');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="shell-container py-6 sm:py-8 pb-28 md:pb-8 space-y-6">
        <section className="surface-card-elevated p-5 sm:p-6">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary-700">Resumen mensual</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard financiero</h1>
              <p className="text-sm text-slate-600">Controla tus ingresos y gastos por periodo con enfoque operativo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto xl:min-w-[420px]">
              <label className="label mb-0">
                Anio
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="field mt-2"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label className="label mb-0">
                Mes
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="field mt-2"
                >
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button onClick={() => setShowCreateForm(true)} className="btn-primary w-full sm:w-auto">
              <FaPlus className="h-4 w-4" />
              Nueva transaccion
            </button>
            <button
              onClick={handleExport}
              disabled={exporting || allTransactions.length === 0}
              className="btn-accent w-full sm:w-auto"
            >
              <FaFileExcel className="h-4 w-4" />
              {exporting ? 'Exportando...' : 'Exportar a Excel'}
            </button>
          </div>

          {exportError && (
            <div className="mt-4 rounded-xl border border-expense-100 bg-expense-50 p-3 text-sm font-medium text-expense-700">
              {exportError}
            </div>
          )}
        </section>

        {loading && (
          <section className="surface-card p-8 text-center">
            <p className="text-slate-600">Cargando transacciones...</p>
          </section>
        )}

        {error && (
          <section className="surface-card p-4 border-expense-100 bg-expense-50 text-expense-700 text-sm font-medium">
            Error: {error}
          </section>
        )}

        {!loading && !error && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <SummaryCard
                icon={<FaArrowTrendUp className="h-4 w-4 text-secondary-700" />}
                label="Ingresos"
                value={formatCurrency(totalIncomes)}
                valueClassName="text-secondary-700"
              />
              <SummaryCard
                icon={<FaArrowTrendDown className="h-4 w-4 text-expense-700" />}
                label="Gastos"
                value={formatCurrency(totalExpenses)}
                valueClassName="text-expense-700"
              />
              <SummaryCard
                icon={<FaChartLine className={`h-4 w-4 ${balance >= 0 ? 'text-primary-700' : 'text-expense-700'}`} />}
                label="Balance"
                value={formatCurrency(balance)}
                valueClassName={balance >= 0 ? 'text-primary-700' : 'text-expense-700'}
              />
              <SummaryCard
                icon={<FaTable className="h-4 w-4 text-primary-700" />}
                label="Registros"
                value={String(filteredTransactions.length)}
                valueClassName="text-primary-700"
              />
            </section>

            <section className="surface-card-elevated p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Charts - {periodLabel}</h2>
                  <p className="text-sm text-slate-600 mt-1">Comparativo visual de ingresos y gastos del periodo.</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2 surface-card p-4 sm:p-5 space-y-4">
                  <ChartRow
                    label="Ingresos"
                    value={totalIncomes}
                    percent={(totalIncomes / maxMetric) * 100}
                    barClass="bg-secondary-500"
                  />
                  <ChartRow
                    label="Gastos"
                    value={totalExpenses}
                    percent={(totalExpenses / maxMetric) * 100}
                    barClass="bg-expense-500"
                  />
                  <div className="pt-2 text-xs sm:text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">Lectura:</span> el balance actual es{' '}
                    <span className={balance >= 0 ? 'text-secondary-700 font-semibold' : 'text-expense-700 font-semibold'}>
                      {formatCurrency(balance)}
                    </span>
                    .
                  </div>
                </div>

                <div className="surface-card p-4 sm:p-5 flex flex-col items-center justify-center">
                  <div className="relative h-36 w-36 rounded-full" style={donutStyle} aria-hidden="true">
                    <div className="absolute inset-4 rounded-full bg-white border border-slate-100" />
                  </div>
                  <div className="mt-4 w-full space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-slate-600">
                        <span className="h-2.5 w-2.5 rounded-full bg-secondary-500" /> Ingresos
                      </span>
                      <span className="font-semibold text-slate-900">{incomeShare.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-slate-600">
                        <span className="h-2.5 w-2.5 rounded-full bg-expense-500" /> Gastos
                      </span>
                      <span className="font-semibold text-slate-900">{expenseShare.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="surface-card-elevated overflow-hidden">
              <div className="px-4 sm:px-5 py-4 border-b border-slate-200">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Registros del mes</h2>
                <p className="text-sm text-slate-600 mt-1">Detalle de transacciones para {periodLabel}.</p>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary-50 text-primary-700 inline-flex items-center justify-center">
                    <FaTable className="h-6 w-6" />
                  </div>
                  <p className="text-base font-semibold text-slate-900">No hay transacciones en este periodo.</p>
                  <p className="text-sm text-slate-600 mt-1">Cambia mes/anio o registra una nueva transaccion.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 text-left font-bold text-slate-600">Fecha</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 text-left font-bold text-slate-600">Tipo</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 text-left font-bold text-slate-600">Descripcion</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 text-left font-bold text-slate-600">Categoria</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 text-left font-bold text-slate-600">Bolsillo</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 text-right font-bold text-slate-600">Monto</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 text-right font-bold text-slate-600">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/90 transition-colors">
                          <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{formatDate(tx.occurredAt)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`status-chip ${
                                tx.type === 'income'
                                  ? 'bg-secondary-100 text-secondary-700'
                                  : 'bg-expense-100 text-expense-700'
                              }`}
                            >
                              {tx.type === 'income' ? 'Ingreso' : 'Gasto'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-900 font-medium">{tx.description}</td>
                          <td className="px-4 py-3 text-slate-700">{tx.category?.name || 'Sin categoria'}</td>
                          <td className="px-4 py-3 text-slate-700">{tx.pocket?.name || '-'}</td>
                          <td className={`px-4 py-3 text-right font-bold whitespace-nowrap ${tx.type === 'income' ? 'text-secondary-700' : 'text-expense-700'}`}>
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => setSelectedTransaction(tx)}
                                className="btn-ghost min-h-10 px-3"
                              >
                                Ver
                              </button>
                              <button
                                onClick={() => setEditingTransaction(tx)}
                                className={tx.type === 'income' ? 'btn-accent min-h-10 px-3' : 'btn-danger min-h-10 px-3'}
                              >
                                Editar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {showCreateForm && <TransactionCreateForm onClose={() => setShowCreateForm(false)} onSave={refresh} />}

        {selectedTransaction && (
          <TransactionDetail
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            onEdit={() => {
              setEditingTransaction(selectedTransaction);
              setSelectedTransaction(null);
            }}
            onDelete={refresh}
          />
        )}

        {editingTransaction && (
          <TransactionEditForm
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
            onSave={() => {
              refresh();
              setEditingTransaction(null);
            }}
          />
        )}
      </main>
    </div>
  );
}

interface SummaryCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  valueClassName: string;
}

function SummaryCard({ icon, label, value, valueClassName }: SummaryCardProps) {
  return (
    <article className="surface-card p-4 sm:p-5">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`mt-3 text-xl sm:text-2xl font-bold ${valueClassName}`}>{value}</p>
    </article>
  );
}

interface ChartRowProps {
  label: string;
  value: number;
  percent: number;
  barClass: string;
}

function ChartRow({ label, value, percent, barClass }: ChartRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">{formatCurrency(value)}</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
      </div>
    </div>
  );
}
