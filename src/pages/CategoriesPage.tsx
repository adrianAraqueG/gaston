import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { categoriesService } from '../services/categories.service';
import { Header } from '../components/layout/Header';
import { FaPlus, FaEdit, FaTrash, FaTags } from 'react-icons/fa';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';

export function CategoriesPage() {
  const [type, setType] = useState<'expense' | 'income' | undefined>(undefined);
  const { categories, loading, error, refresh } = useCategories(type);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleCreate = async (data: CreateCategoryDto) => {
    try {
      await categoriesService.create(data);
      refresh();
      setShowCreateForm(false);
    } catch (err: any) {
      alert(err.message || 'Error al crear categoría');
    }
  };

  const handleUpdate = async (id: number, data: UpdateCategoryDto) => {
    try {
      await categoriesService.update(id, data);
      refresh();
      setEditingCategory(null);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar categoría');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoriesService.delete(id);
      refresh();
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar categoría');
    }
  };

  const filteredCategories = type
    ? categories.filter(c => c.type === type)
    : categories;

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categorías</h1>
              <p className="mt-2 text-sm text-gray-600">
                Gestiona tus categorías de gastos e ingresos
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaPlus className="h-5 w-5" />
              <span>Nueva Categoría</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setType(undefined)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === undefined
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setType('expense')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Gastos ({expenseCategories.length})
            </button>
            <button
              onClick={() => setType('income')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'income'
                  ? 'bg-secondary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Ingresos ({incomeCategories.length})
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-gray-600">Cargando categorías...</div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-800">Error: {error}</div>
          </div>
        )}

        {!loading && !error && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <FaTags className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4" />
            <p className="text-base sm:text-lg text-gray-600 mb-2">No tienes categorías registradas aún.</p>
            <p className="text-sm text-gray-500 px-4">
              Crea una categoría para organizar tus transacciones.
            </p>
          </div>
        )}

        {!loading && !error && filteredCategories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map(category => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                      category.type === 'expense'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-secondary-100 text-secondary-700'
                    }`}>
                      {category.type === 'expense' ? 'Gasto' : 'Ingreso'}
                    </span>
                    {category.isDefault && (
                      <span className="ml-2 inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        Por defecto
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  {!category.isDefault && (
                    <button
                      onClick={() => setDeleteConfirm(category.id)}
                      className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateForm && (
          <CategoryForm
            onClose={() => setShowCreateForm(false)}
            onSave={handleCreate}
          />
        )}

        {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
            onSave={(data) => handleUpdate(editingCategory.id, data)}
          />
        )}

        {deleteConfirm && (
          <DeleteConfirmModal
            message={`¿Estás seguro de que deseas eliminar esta categoría?`}
            onConfirm={() => handleDelete(deleteConfirm)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </main>
    </div>
  );
}

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
  onSave: (data: CreateCategoryDto | UpdateCategoryDto) => void;
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
      setError(err.message || 'Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as 'expense' | 'income')}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
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

interface DeleteConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ message, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h2>
          <p className="text-sm text-gray-700 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

