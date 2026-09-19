import { useEffect, useMemo, useState } from 'react';
import { Search, ListFilter, Gamepad2 } from 'lucide-react';
import api from '../services/api';
import { SkeletonCard } from '../components/Spinner';
import GameCard from '../components/GameCard';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage } from '../utils/errors';

export default function Home() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [gamesRes, categoriesRes] = await Promise.all([
          api.get('/games'),
          api.get('/categories'),
        ]);
        setGames(Array.isArray(gamesRes.data) ? gamesRes.data : gamesRes.data?.data || []);
        setCategories(
          Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.data || []
        );
      } catch (error) {
        toast.error(getErrorMessage(error, 'Erro ao carregar o catálogo.'));
      } finally {
        setLoadingGames(false);
        setLoadingCategories(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoryName = (game) =>
    game.categories?.name ||
    categories.find((c) => c.id_categories_pk === game.categories_id_fk)?.name;

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchSearch = game.title?.toLowerCase().includes(search.toLowerCase().trim());
      const matchCategory =
        selectedCategory === null || game.categories_id_fk === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [games, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header + busca */}
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-extrabold text-white">Catálogo de Jogos</h1>
        <p className="mb-5 text-slate-400">Explore, filtre e avalie seus jogos favoritos.</p>
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar de categorias */}
        <aside id="categories" className="card h-fit p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-300">
            <ListFilter size={16} className="text-violet-400" /> Categorias
          </h2>

          {loadingCategories ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-800" />
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    selectedCategory === null
                      ? 'bg-violet-600 font-semibold text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Todas
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id_categories_pk}>
                  <button
                    onClick={() => setSelectedCategory(category.id_categories_pk)}
                    title={category.description}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedCategory === category.id_categories_pk
                        ? 'bg-violet-600 font-semibold text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Grid de jogos */}
        <section>
          {loadingGames ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-12 text-center text-slate-400">
              <Gamepad2 size={36} className="text-slate-600" />
              <p>Nenhum jogo encontrado com esses filtros.</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-400">
                {filteredGames.length} jogo(s) encontrado(s)
              </p>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id_games_pk}
                    game={game}
                    categoryName={categoryName(game)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}