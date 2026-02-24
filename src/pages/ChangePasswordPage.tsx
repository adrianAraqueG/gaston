import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/validators';
import { FaKey, FaLock } from 'react-icons/fa';

export function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.mustChangePassword) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user && !user.mustChangePassword) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('La contrasena debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contrasena');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="surface-card-elevated p-8 sm:p-10">
          <div className="text-center mb-7">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary-50 text-primary-700 inline-flex items-center justify-center">
              <FaKey className="h-5 w-5" />
            </div>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold text-primary-700">GASTON</h1>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Cambiar contrasena</h2>
            <p className="mt-2 text-sm text-slate-600">Actualiza tu contrasena temporal antes de continuar.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="current-password" className="label">Contrasena actual</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="current-password"
                  name="current-password"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="field pl-10"
                  placeholder="Contrasena actual"
                />
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="label">Nueva contrasena</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="field pl-10"
                  placeholder="Nueva contrasena"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Minimo 8 caracteres.</p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="label">Confirmar nueva contrasena</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="field pl-10"
                  placeholder="Confirmar contrasena"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-expense-100 bg-expense-50 p-3 text-sm font-medium text-expense-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Cambiando contrasena...' : 'Cambiar contrasena'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
