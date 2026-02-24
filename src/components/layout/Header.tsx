import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaTags, FaWallet, FaSignOutAlt } from 'react-icons/fa';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FaHome },
  { path: '/categories', label: 'Categorias', icon: FaTags },
  { path: '/pockets', label: 'Bolsillos', icon: FaWallet },
];

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="shell-container">
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/dashboard" className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-primary-700">
                GASTON
              </Link>

              <nav className="hidden md:flex items-center gap-2 rounded-full bg-slate-100 p-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`min-h-11 px-4 rounded-full text-sm font-semibold inline-flex items-center gap-2 transition duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                        active
                          ? 'bg-white text-primary-700 shadow-soft'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-sm font-medium text-slate-600">Hola, {user?.name}</span>
              <button
                onClick={logout}
                className="btn-danger min-h-11 px-3 sm:px-4"
                aria-label="Cerrar sesion"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar sesion</span>
                <span className="sm:hidden">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <div className="shell-container py-2">
          <div className="grid grid-cols-3 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`min-h-12 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    active
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
