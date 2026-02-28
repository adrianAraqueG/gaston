
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useFixedExpenses } from '../hooks/useFixedExpenses';
import { useCategories } from '../hooks/useCategories';
import { TransactionCreateForm } from '../components/transactions/TransactionCreateForm';
import { TransactionDetail } from '../components/transactions/TransactionDetail';
import { TransactionEditForm } from '../components/transactions/TransactionEditForm';
import { Header } from '../components/layout/Header';
import { formatCurrency, formatDate } from '../utils/formatters';
import { transactionsService } from '../services/transactions.service';
import type { Transaction } from '../types/transaction.types';
import type {
  CreateFixedExpenseDto,
  FixedExpense,
  PayFixedExpenseDto,
  UpdateFixedExpenseDto,
} from '../types/fixed-expense.types';
import type { Category } from '../types/category.types';
import { validateAmount } from '../utils/validators';
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
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

function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as { message?: string | string[] }).message;
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message) && message.length > 0) {
      return message.join(', ');
    }
  }
  return fallback;
}

function getLocalDateTimeInputValue(date = new Date()): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function DashboardPage() {
  const { expenses, incomes, loading, error, refresh } = useTransactions();
  const {
    fixedExpenses,
    loading: fixedExpensesLoading,
    error: fixedExpensesError,
    createFixedExpense,
    updateFixedExpense,
    removeFixedExpense,
    payFixedExpense,
  } = useFixedExpenses();
  const { categories: expenseCategories } = useCategories('expense');

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

  const [showFixedExpenseCreate, setShowFixedExpenseCreate] = useState(false);
  const [editingFixedExpense, setEditingFixedExpense] = useState<FixedExpense | null>(null);
  const [payingFixedExpense, setPayingFixedExpense] = useState<FixedExpense | null>(null);
  const [deletingFixedExpense, setDeletingFixedExpense] = useState<FixedExpense | null>(null);
  const [fixedExpenseSaving, setFixedExpenseSaving] = useState(false);
  const [fixedExpensePaying, setFixedExpensePaying] = useState(false);
  const [fixedExpenseError, setFixedExpenseError] = useState<string | null>(null);
  const [fixedExpensePayError, setFixedExpensePayError] = useState<string | null>(null);

  const allTransactions = useMemo(
    () =>
      [...expenses, ...incomes].sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      ),
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

  const paidFixedExpenseIdsThisMonth = useMemo(
    () =>
      new Set(
        expenses
          .filter(
            (tx) =>
              tx.year === selectedYear &&
              tx.month === selectedMonth &&
              tx.type === 'expense' &&
              tx.fixedExpenseId !== undefined,
          )
          .map((tx) => tx.fixedExpenseId as number),
      ),
    [expenses, selectedYear, selectedMonth],
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

  const handleCreateOrUpdateFixedExpense = async (
    data: CreateFixedExpenseDto | UpdateFixedExpenseDto,
  ) => {
    try {
      setFixedExpenseSaving(true);
      setFixedExpenseError(null);

      if (editingFixedExpense) {
        await updateFixedExpense(editingFixedExpense.id, data as UpdateFixedExpenseDto);
      } else {
        await createFixedExpense(data as CreateFixedExpenseDto);
      }

      setShowFixedExpenseCreate(false);
      setEditingFixedExpense(null);
    } catch (err) {
      setFixedExpenseError(getApiErrorMessage(err, 'Error al guardar gasto fijo'));
    } finally {
      setFixedExpenseSaving(false);
    }
  };

  const handlePayFixedExpense = async (data: PayFixedExpenseDto) => {
    if (!payingFixedExpense) {
      return;
    }

    try {
      setFixedExpensePaying(true);
      setFixedExpensePayError(null);
      await payFixedExpense(payingFixedExpense.id, data);
      await refresh();
      setPayingFixedExpense(null);
    } catch (err) {
      setFixedExpensePayError(getApiErrorMessage(err, 'Error al pagar gasto fijo'));
    } finally {
      setFixedExpensePaying(false);
    }
  };

  const handleDeleteFixedExpense = async () => {
    if (!deletingFixedExpense) {
      return;
    }

    try {
      await removeFixedExpense(deletingFixedExpense.id);
      setDeletingFixedExpense(null);
    } catch (err) {
      alert(getApiErrorMessage(err, 'Error al eliminar gasto fijo'));
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="shell-container py-6 sm:py-8 pb-28 md:pb-8 space-y-6">
        <section className="surface-card-elevated p-5 sm:p-6">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary-700">
                Resumen mensual
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard financiero</h1>
              <p className="text-sm text-slate-600">
                Controla tus ingresos y gastos por periodo con enfoque operativo.
              </p>
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

        <section className="surface-card-elevated overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Gastos fijos</h2>
              <p className="text-sm text-slate-600 mt-1">
                Registra y paga gastos recurrentes con un click.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingFixedExpense(null);
                setFixedExpenseError(null);
                setShowFixedExpenseCreate(true);
              }}
              className="btn-primary w-full sm:w-auto"
            >
              <FaPlus className="h-4 w-4" />
              Nuevo gasto fijo
            </button>
          </div>

          {fixedExpensesLoading && (
            <div className="p-6 text-sm text-slate-600">Cargando gastos fijos...</div>
          )}

          {fixedExpensesError && (
            <div className="p-4 text-sm font-medium border-t border-expense-100 bg-expense-50 text-expense-700">
              Error: {fixedExpensesError}
            </div>
          )}

          {!fixedExpensesLoading && !fixedExpensesError && fixedExpenses.length === 0 && (
            <div className="p-6 text-sm text-slate-600">
              Aun no tienes gastos fijos. Crea uno para habilitar el pago rapido.
            </div>
          )}

          {!fixedExpensesLoading && !fixedExpensesError && fixedExpenses.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Nombre</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Categoria</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600">Monto por defecto</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Estado</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {fixedExpenses.map((fixedExpense) => {
                    const isPaidThisMonth = paidFixedExpenseIdsThisMonth.has(fixedExpense.id);
                    return (
                    <tr key={fixedExpense.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="px-4 py-3 text-slate-900 font-medium">{fixedExpense.name}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {fixedExpense.category?.name || 'Sin categoria'}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-900 font-semibold">
                        {formatCurrency(fixedExpense.defaultAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`status-chip ${
                            isPaidThisMonth
                              ? 'bg-secondary-100 text-secondary-700'
                              : 'bg-warning-100 text-warning-700'
                          }`}
                        >
                          {isPaidThisMonth ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => {
                              setFixedExpensePayError(null);
                              setPayingFixedExpense(fixedExpense);
                            }}
                            disabled={isPaidThisMonth}
                            className="btn-success min-h-10 px-3 disabled:opacity-50"
                          >
                            Pagar
                          </button>
                          <button
                            onClick={() => {
                              setFixedExpenseError(null);
                              setEditingFixedExpense(fixedExpense);
                            }}
                            className="btn-ghost min-h-10 px-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeletingFixedExpense(fixedExpense)}
                            className="btn-danger min-h-10 px-3"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
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
                icon={
                  <FaChartLine
                    className={`h-4 w-4 ${balance >= 0 ? 'text-primary-700' : 'text-expense-700'}`}
                  />
                }
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
                  <p className="text-sm text-slate-600 mt-1">
                    Comparativo visual de ingresos y gastos del periodo.
                  </p>
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
                    <span
                      className={
                        balance >= 0
                          ? 'text-secondary-700 font-semibold'
                          : 'text-expense-700 font-semibold'
                      }
                    >
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
                  <p className="text-sm text-slate-600 mt-1">
                    Cambia mes/anio o registra una nueva transaccion.
                  </p>
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

        {(showFixedExpenseCreate || editingFixedExpense) && (
          <FixedExpenseFormModal
            fixedExpense={editingFixedExpense}
            categories={expenseCategories}
            loading={fixedExpenseSaving}
            error={fixedExpenseError}
            onClose={() => {
              setShowFixedExpenseCreate(false);
              setEditingFixedExpense(null);
              setFixedExpenseError(null);
            }}
            onSave={handleCreateOrUpdateFixedExpense}
          />
        )}

        {payingFixedExpense && (
          <PayFixedExpenseModal
            fixedExpense={payingFixedExpense}
            loading={fixedExpensePaying}
            error={fixedExpensePayError}
            onClose={() => {
              setPayingFixedExpense(null);
              setFixedExpensePayError(null);
            }}
            onPay={handlePayFixedExpense}
          />
        )}

        {deletingFixedExpense && (
          <DeleteConfirmModal
            title="Eliminar gasto fijo"
            message={`Se desactivara "${deletingFixedExpense.name}". Podras recrearlo despues con el mismo nombre.`}
            onCancel={() => setDeletingFixedExpense(null)}
            onConfirm={handleDeleteFixedExpense}
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
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}

interface FixedExpenseFormModalProps {
  fixedExpense: FixedExpense | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (data: CreateFixedExpenseDto | UpdateFixedExpenseDto) => Promise<void>;
}

function FixedExpenseFormModal({
  fixedExpense,
  categories,
  loading,
  error,
  onClose,
  onSave,
}: FixedExpenseFormModalProps) {
  const [name, setName] = useState(fixedExpense?.name || '');
  const [defaultAmount, setDefaultAmount] = useState(fixedExpense?.defaultAmount.toString() || '');
  const [categoryId, setCategoryId] = useState<number | undefined>(fixedExpense?.category?.id);
  const [localError, setLocalError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!name.trim()) {
      setLocalError('El nombre es requerido');
      return;
    }

    const amountNum = parseFloat(defaultAmount);
    if (!validateAmount(amountNum)) {
      setLocalError('El monto por defecto debe ser mayor que 0');
      return;
    }

    await onSave({
      name: name.trim(),
      defaultAmount: amountNum,
      categoryId,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="surface-card-elevated w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900">
          {fixedExpense ? 'Editar gasto fijo' : 'Nuevo gasto fijo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label htmlFor="fixed-expense-name" className="label">
              Nombre
            </label>
            <input
              id="fixed-expense-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="field"
            />
          </div>

          <div>
            <label htmlFor="fixed-expense-default-amount" className="label">
              Monto por defecto
            </label>
            <input
              id="fixed-expense-default-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={defaultAmount}
              onChange={(e) => setDefaultAmount(e.target.value)}
              required
              className="field"
            />
          </div>

          <div>
            <label htmlFor="fixed-expense-category" className="label">
              Categoria
            </label>
            <select
              id="fixed-expense-category"
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              className="field"
            >
              <option value="">Sin categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {(localError || error) && (
            <div className="rounded-xl border border-expense-100 bg-expense-50 p-3 text-sm font-medium text-expense-700">
              {localError || error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
interface PayFixedExpenseModalProps {
  fixedExpense: FixedExpense;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onPay: (data: PayFixedExpenseDto) => Promise<void>;
}

function PayFixedExpenseModal({ fixedExpense, loading, error, onClose, onPay }: PayFixedExpenseModalProps) {
  const [amount, setAmount] = useState(fixedExpense.defaultAmount.toString());
  const [occurredAt, setOccurredAt] = useState(getLocalDateTimeInputValue());
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    const amountNum = parseFloat(amount);
    if (!validateAmount(amountNum)) {
      setLocalError('El monto debe ser mayor que 0');
      return;
    }

    await onPay({
      amount: amountNum,
      occurredAt: new Date(occurredAt).toISOString(),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="surface-card-elevated w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900">Pagar gasto fijo</h2>
        <p className="text-sm text-slate-600 mt-1">
          Confirma los valores para registrar el pago de <span className="font-semibold">{fixedExpense.name}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label htmlFor="pay-fixed-expense-amount" className="label">
              Monto
            </label>
            <input
              id="pay-fixed-expense-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="field"
              required
            />
          </div>

          <div>
            <label htmlFor="pay-fixed-expense-date" className="label">
              Fecha
            </label>
            <input
              id="pay-fixed-expense-date"
              type="datetime-local"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
              className="field"
              required
            />
          </div>

          {(localError || error) && (
            <div className="rounded-xl border border-expense-100 bg-expense-50 p-3 text-sm font-medium text-expense-700">
              {localError || error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button type="submit" disabled={loading} className="btn-success flex-1">
              {loading ? 'Pagando...' : 'Confirmar pago'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ title, message, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div className="surface-card-elevated w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <button onClick={onConfirm} className="btn-danger flex-1">
            Eliminar
          </button>
          <button onClick={onCancel} className="btn-ghost flex-1">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
