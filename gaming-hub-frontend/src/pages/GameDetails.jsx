import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, MessageSquare, Loader2, UserCircle2 } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import StarRating from '../components/StarRating';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage, parseFieldErrors } from '../utils/errors';

export default function GameDetails() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  async function loadReviews() {
  try {
    const { data } = await api.get(`/reviews/game/${id}`);
    return Array.isArray(data) ? data : data?.data || [];
  } catch {
    return [];
  }
}

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const { data } = await api.get(`/games/${id}`);
        if (active) setGame(data?.data || data);
        const list = await loadReviews();
        if (active) setReviews(list);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Jogo não encontrado.'));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    setErrors({});
    setSending(true);
    try {
      await api.post('/reviews', {
        rating: Number(form.rating),
        comment: form.comment,
        games_id_fk: Number(id),
      });
      toast.success('Avaliação enviada!');
      setForm({ rating: 5, comment: '' });
      setReviews(await loadReviews());
    } catch (error) {
      setErrors(parseFieldErrors(error));
      toast.error(getErrorMessage(error, 'Não foi possível enviar a avaliação.'));
    } finally {
      setSending(false);
    }
  }

  if (loading) return <Spinner size={32} label="Carregando jogo..." />;

  if (!game) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-400">
        <p className="mb-4">Jogo não encontrado.</p>
        <Link to="/" className="btn-primary">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const average = reviews.length
    ? (reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Voltar ao catálogo
      </Link>

      <section className="card mb-8 p-7">
        <h1 className="mb-3 text-3xl font-extrabold text-white">{game.title}</h1>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
            <Calendar size={13} /> {game.release_year}
          </span>
          {game.categories?.name && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/20 px-3 py-1 text-xs font-medium text-violet-300">
              <Tag size={13} /> {game.categories.name}
            </span>
          )}
          {average && (
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
              {average} / 5 · {reviews.length} avaliação(ões)
            </span>
          )}
        </div>

        <p className="whitespace-pre-line leading-relaxed text-slate-300">{game.description}</p>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <MessageSquare size={20} className="text-violet-400" /> Avaliações
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitReview} className="card mb-6 flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Sua nota</label>
              <div className="flex items-center gap-3">
                <StarRating
                  value={Number(form.rating)}
                  onChange={(n) => setForm((p) => ({ ...p, rating: n }))}
                  size={24}
                />
                <span className="text-sm text-slate-400">{form.rating} de 5</span>
              </div>
              {errors.rating && <span className="text-xs text-red-400">{errors.rating}</span>}
            </div>

            <Input
              as="textarea"
              label="Comentário"
              rows={3}
              placeholder="O que você achou desse jogo?"
              value={form.comment}
              onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
              error={errors.comment}
            />

            <button type="submit" disabled={sending} className="btn-primary self-start">
              {sending && <Loader2 size={16} className="animate-spin" />}
              {sending ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </form>
        ) : (
          <div className="card mb-6 p-5 text-sm text-slate-400">
            <Link to="/login" className="font-semibold text-violet-400 hover:underline">
              Entre na sua conta
            </Link>{' '}
            para avaliar este jogo.
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="card p-8 text-center text-sm text-slate-400">
            Nenhuma avaliação ainda. Seja o primeiro!
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {reviews.map((review) => (
              <li key={review.id_reviews_pk} className="card p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <UserCircle2 size={18} className="text-violet-400" />
                    {review.users?.name || 'Usuário'}
                  </span>
                  <StarRating value={Number(review.rating)} />
                </div>
                <p className="text-sm leading-relaxed text-slate-400">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}