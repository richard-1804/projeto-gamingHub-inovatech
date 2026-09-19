import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, LayoutDashboard } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage, parseFieldErrors } from '../utils/errors';

const EMPTY_FORM = { title: '', description: '', release_year: '', categories_id_fk: '' };

export default function Admin() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { toast } = useToast();

  async function loadAll() {
    setLoading(true);
    try {
      const [gamesRes, catRes] = await Promise.all([api.get('/games'), api.get('/categories')]);
      setGames(Array.isArray(gamesRes.data) ? gamesRes.data : gamesRes.data?.data || []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data?.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao carregar os dados.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(game) {
    setEditingId(game.id_games_pk);
    setForm({
      title: game.title ?? '',
      description: game.description ?? '',
      release_year: String(game.release_year ?? ''),
      categories_id_fk: String(game.categories_id_fk ?? ''),
    });
    setErrors({});
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description,
      release_year: Number(form.release_year),
      categories_id_fk: Number(form.categories_id_fk),
    };

    try {
      if (editingId) {
        await api.put(`/games/${editingId}`, payload);
        toast.success('Jogo atualizado com sucesso!');
      } else {
        await api.post('/games', payload);
        toast.success('Jogo cadastrado com sucesso!');
      }
      setModalOpen(false);
      await loadAll();
    } catch (error) {
      setErrors(parseFieldErrors(error));
      toast.error(getErrorMessage(error, 'Não foi possível salvar o jogo.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(game) {
    const ok = window.confirm(`Tem certeza que deseja excluir "${game.title}"?`);
    if (!ok) return;

    setDeletingId(game.id_games_pk);
    try {
      await api.delete(`/games/${game.id_games_pk}`);
      toast.success('Jogo excluído.');
      setGames((prev) => prev.filter((g) => g.id_games_pk !== game.id_games_pk));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível excluir o jogo.'));
    } finally {
      setDeletingId(null);
    }
  }

  const categoryName = (game) =>
    game.categories?.name ||
    categories.find((c) => c.id_categories_pk === game.categories_id_fk)?.name ||
    '—';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-white">
            <LayoutDashboard size={24} className="text-violet-400" /> Painel de Gestão
          </h1>
          <p className="text-sm text-slate-400">Gerencie os jogos cadastrados na plataforma.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Novo Jogo
        </button>
      </div>

      {loading ? (
        <Spinner size={32} label="Carregando jogos..." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Título</th>
                <th className="px-5 py-3">Ano</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    Nenhum jogo cadastrado ainda.
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr
                    key={game.id_games_pk}
                    className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/30"
                  >
                    <td className="px-5 py-3 text-slate-500">{game.id_games_pk}</td>
                    <td className="px-5 py-3 font-medium text-white">{game.title}</td>
                    <td className="px-5 py-3 text-slate-300">{game.release_year}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-violet-600/20 px-2.5 py-1 text-xs text-violet-300">
                        {categoryName(game)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(game)} className="btn-ghost px-3 py-1.5">
                          <Pencil size={14} /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(game)}
                          disabled={deletingId === game.id_games_pk}
                          className="btn-danger px-3 py-1.5"
                        >
                          {deletingId === game.id_games_pk ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Jogo' : 'Novo Jogo'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Título"
            name="title"
            placeholder="Ex: The Legend of Zelda"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
          />
          <Input
            as="textarea"
            label="Descrição"
            name="description"
            rows={4}
            placeholder="Resumo do jogo..."
            value={form.description}
            onChange={handleChange}
            error={errors.description}
          />
          <Input
            label="Ano de lançamento"
            name="release_year"
            type="number"
            min="1950"
            max="2100"
            placeholder="2023"
            value={form.release_year}
            onChange={handleChange}
            error={errors.release_year}
          />
          <Input
            as="select"
            label="Categoria"
            name="categories_id_fk"
            value={form.categories_id_fk}
            onChange={handleChange}
            error={errors.categories_id_fk}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id_categories_pk} value={category.id_categories_pk}>
                {category.name}
              </option>
            ))}
          </Input>

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}