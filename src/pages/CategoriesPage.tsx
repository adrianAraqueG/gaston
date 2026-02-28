import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { categoriesService } from '../services/categories.service';
import { Header } from '../components/layout/Header';
import { FaPlus, FaEdit, FaTrash, FaTags, FaSearch } from 'react-icons/fa';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';

export function CategoriesPage() {
  const [type, setType] = useState<'expense' | 'income' | undefined>(undefined);
  const [search, setSearch] = useState('');
  const { categories, loading, error, refresh } = useCategories(type);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleCreate = async (data: CreateCategoryDto | UpdateCategoryDto) => {
    try {
      await categoriesService.create(data as CreateCategoryDto);
      refresh();
      setShowCreateForm(false);
    } catch (err: any) {
      alert(err.message || 'Error al crear categoria');
    }
  };

  const handleUpdate = async (id: number, data: UpdateCategoryDto) => {
    try {
      await categoriesService.update(id, data);
      refresh();
      setEditingCategory(null);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar categoria');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoriesService.delete(id);
      refresh();
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar categoria');
    }
  };

  const filteredCategories = type ? categories.filter((c) => c.type === type) : categories;
  const normalizedSearch = search.trim().toLowerCase();
  const visibleCategories = normalizedSearch
    ? filteredCategories.filter((c) => c.name.toLowerCase().includes(normalizedSearch))
    : filteredCategories;
  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  return (
    <div className="min-h-screen">
      <Header />

      <main className="shell-container py-6 sm:py-8 pb-28 md:pb-8 space-y-6">
        <section className="surface-card-elevated p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary-700">Catalogo</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Categorias</h1>
              <p className="mt-1 text-sm text-slate-600">Organiza tus gastos e ingresos con categorias claras.</p>
            </div>
            <button onClick={() => setShowCreateForm(true)} className="btn-primary w-full sm:w-auto">
              <FaPlus className="h-4 w-4" />
              Nueva categoria
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <FilterChip active={type === undefined} onClick={() => setType(undefined)} label="Todas" />
            <FilterChip
              active={type === 'expense'}
              onClick={() => setType('expense')}
              label={`Gastos (${expenseCategories.length})`}
            />
            <FilterChip
              active={type === 'income'}
              onClick={() => setType('income')}
              label={`Ingresos (${incomeCategories.length})`}
            />
          </div>

          <div className="mt-4 relative">
            <FaSearch className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categoria por nombre..."
              className="field pl-9"
            />
          </div>
        </section>

        {loading && (
          <section className="surface-card p-8 text-center">
            <p className="text-slate-600">Cargando categorias...</p>
          </section>
        )}

        {error && (
          <section className="surface-card p-4 border-expense-100 bg-expense-50 text-expense-700 text-sm font-medium">
            Error: {error}
          </section>
        )}

        {!loading && !error && visibleCategories.length === 0 && (
          <section className="surface-card p-10 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-primary-50 text-primary-700 inline-flex items-center justify-center mb-4">
              <FaTags className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-slate-900">No se encontraron categorias.</p>
            <p className="text-sm text-slate-600 mt-1">Prueba otro filtro o texto de busqueda.</p>
          </section>
        )}

        {!loading && !error && visibleCategories.length > 0 && (
          <section className="surface-card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Nombre</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Tipo</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Estado</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {visibleCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="px-4 py-3 text-slate-900 font-medium">{category.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`status-chip ${category.type === 'expense' ? 'bg-expense-100 text-expense-700' : 'bg-secondary-100 text-secondary-700'}`}
                        >
                          {category.type === 'expense' ? 'Gasto' : 'Ingreso'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {category.isDefault ? (
                          <span className="status-chip bg-slate-100 text-slate-700">Por defecto</span>
                        ) : (
                          <span className="status-chip bg-primary-100 text-primary-700">Personalizada</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => setEditingCategory(category)} className="btn-ghost min-h-10 px-3">
                            <FaEdit className="h-4 w-4" />
                            Editar
                          </button>
                          {!category.isDefault && (
                            <button
                              onClick={() => setDeleteConfirm(category.id)}
                              className="btn-danger min-h-10 px-3"
                              aria-label={`Eliminar ${category.name}`}
                            >
                              <FaTrash className="h-4 w-4" />
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {showCreateForm && <CategoryForm onClose={() => setShowCreateForm(false)} onSave={handleCreate} />}

        {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
            onSave={(data) => handleUpdate(editingCategory.id, data)}
          />
        )}

        {deleteConfirm && (
          <DeleteConfirmModal
            message="Estas seguro de que deseas eliminar esta categoria?"
            onConfirm={() => handleDelete(deleteConfirm)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </main>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`min-h-11 px-4 rounded-full text-sm font-semibold transition duration-180 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        active ? 'bg-primary-600 text-white shadow-soft' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
  onSave: (data: CreateCategoryDto | UpdateCategoryDto) => Promise<void>;
}

function CategoryForm({ category, onClose, onSave }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '');
  const [type, setType] = useState<'expense' | 'income'>(category?.type || 'expense');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim()) {
      setError('El nombre es requerido');
      setLoading(false);
      return;
    }

    try {
      await onSave({ name: name.trim(), type });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="surface-card-elevated w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900">{category ? 'Editar categoria' : 'Nueva categoria'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label htmlFor="name" className="label">Nombre</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="field" />
          </div>

          <div>
            <label htmlFor="type" className="label">Tipo</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'expense' | 'income')}
              required
              className="field"
            >
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </select>
          </div>

          {error && <div className="rounded-xl border border-expense-100 bg-expense-50 p-3 text-sm font-medium text-expense-700">{error}</div>}

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

interface DeleteConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ message, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="surface-card-elevated w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900">Confirmar eliminacion</h2>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <button onClick={onConfirm} className="btn-danger flex-1">Eliminar</button>
          <button onClick={onCancel} className="btn-ghost flex-1">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
