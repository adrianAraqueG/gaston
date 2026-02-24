import { useState } from 'react';
import { usePockets } from '../hooks/usePockets';
import { pocketsService } from '../services/pockets.service';
import { Header } from '../components/layout/Header';
import { FaPlus, FaEdit, FaTrash, FaWallet } from 'react-icons/fa';
import type { Pocket, CreatePocketDto, UpdatePocketDto } from '../types/pocket.types';

export function PocketsPage() {
  const { pockets, loading, error, refresh } = usePockets();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPocket, setEditingPocket] = useState<Pocket | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleCreate = async (data: CreatePocketDto | UpdatePocketDto) => {
    try {
      await pocketsService.create(data as CreatePocketDto);
      refresh();
      setShowCreateForm(false);
    } catch (err: any) {
      alert(err.message || 'Error al crear bolsillo');
    }
  };

  const handleUpdate = async (id: number, data: UpdatePocketDto) => {
    try {
      await pocketsService.update(id, data);
      refresh();
      setEditingPocket(null);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar bolsillo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await pocketsService.delete(id);
      refresh();
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar bolsillo');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="shell-container py-6 sm:py-8 pb-28 md:pb-8 space-y-6">
        <section className="surface-card-elevated p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary-700">Organizacion</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Bolsillos</h1>
              <p className="mt-1 text-sm text-slate-600">Define de donde sale el dinero para cada gasto.</p>
            </div>
            <button onClick={() => setShowCreateForm(true)} className="btn-primary w-full sm:w-auto">
              <FaPlus className="h-4 w-4" />
              Nuevo bolsillo
            </button>
          </div>
        </section>

        {loading && (
          <section className="surface-card p-8 text-center">
            <p className="text-slate-600">Cargando bolsillos...</p>
          </section>
        )}

        {error && (
          <section className="surface-card p-4 border-expense-100 bg-expense-50 text-expense-700 text-sm font-medium">
            Error: {error}
          </section>
        )}

        {!loading && !error && pockets.length === 0 && (
          <section className="surface-card p-10 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-primary-50 text-primary-700 inline-flex items-center justify-center mb-4">
              <FaWallet className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-slate-900">No hay bolsillos registrados.</p>
            <p className="text-sm text-slate-600 mt-1">Crea un bolsillo para clasificar mejor tus gastos.</p>
          </section>
        )}

        {!loading && !error && pockets.length > 0 && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pockets.map((pocket) => (
              <article key={pocket.id} className="surface-card p-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{pocket.name}</h3>
                  {pocket.description && <p className="mt-2 text-sm text-slate-600">{pocket.description}</p>}
                  {pocket.isDefault && <span className="status-chip mt-3 bg-slate-100 text-slate-700">Por defecto</span>}
                </div>

                <div className="mt-5 flex gap-2">
                  <button onClick={() => setEditingPocket(pocket)} className="btn-ghost flex-1">
                    <FaEdit className="h-4 w-4" />
                    Editar
                  </button>
                  {!pocket.isDefault && (
                    <button onClick={() => setDeleteConfirm(pocket.id)} className="btn-danger px-3 min-h-11" aria-label={`Eliminar ${pocket.name}`}>
                      <FaTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        {showCreateForm && <PocketForm onClose={() => setShowCreateForm(false)} onSave={handleCreate} />}

        {editingPocket && (
          <PocketForm
            pocket={editingPocket}
            onClose={() => setEditingPocket(null)}
            onSave={(data) => handleUpdate(editingPocket.id, data)}
          />
        )}

        {deleteConfirm && (
          <DeleteConfirmModal
            message="Estas seguro de que deseas eliminar este bolsillo?"
            onConfirm={() => handleDelete(deleteConfirm)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </main>
    </div>
  );
}

interface PocketFormProps {
  pocket?: Pocket;
  onClose: () => void;
  onSave: (data: CreatePocketDto | UpdatePocketDto) => Promise<void>;
}

function PocketForm({ pocket, onClose, onSave }: PocketFormProps) {
  const [name, setName] = useState(pocket?.name || '');
  const [description, setDescription] = useState(pocket?.description || '');
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
      await onSave({ name: name.trim(), description: description.trim() || undefined });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar bolsillo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="surface-card-elevated w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900">{pocket ? 'Editar bolsillo' : 'Nuevo bolsillo'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label htmlFor="name" className="label">Nombre</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="field" />
          </div>

          <div>
            <label htmlFor="description" className="label">Descripcion (opcional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="field"
            />
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
