import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Loader2 } from 'lucide-react';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage, parseFieldErrors } from '../utils/errors';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await signIn(form);
      toast.success('Bem-vindo de volta!');
      navigate('/');
    } catch (error) {
      setErrors(parseFieldErrors(error));
      toast.error(getErrorMessage(error, 'E-mail ou senha inválidos.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="rounded-xl bg-violet-600 p-2.5 text-white">
            <Gamepad2 size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Entrar</h1>
          <p className="text-sm text-slate-400">Acesse sua conta do Gaming Hub</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="voce@email.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Não tem conta?{' '}
          <Link to="/register" className="font-semibold text-violet-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}