import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Gamepad2, LayoutDashboard, LogOut, LogIn, UserPlus, UserCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Navbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    toast.info('Sessão encerrada.');
    navigate('/login');
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? 'text-violet-400' : 'text-slate-300 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-violet-600 p-1.5 text-white">
            <Gamepad2 size={20} />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">Gaming Hub</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClass}>
            Catálogo
          </NavLink>
          <NavLink to="/?view=categories" className={linkClass}>
            Categorias
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden items-center gap-2 text-sm text-slate-300 sm:flex">
                <UserCircle2 size={18} className="text-violet-400" />
                {user?.email || 'Jogador'}
              </span>
              <Link to="/admin" className="btn-ghost">
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Painel Admin</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost">
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                <LogIn size={16} /> Entrar
              </Link>
              <Link to="/register" className="btn-primary">
                <UserPlus size={16} /> Cadastrar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}