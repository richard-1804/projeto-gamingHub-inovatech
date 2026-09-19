import { Link } from 'react-router-dom';
import { Calendar, Gamepad2, ArrowRight } from 'lucide-react';

export default function GameCard({ game, categoryName }) {
  return (
    <article className="card flex flex-col p-5 transition hover:border-violet-600/60 hover:shadow-lg hover:shadow-violet-900/20">
      <div className="mb-3 flex items-start gap-3">
        <div className="rounded-lg bg-violet-600/15 p-2 text-violet-400">
          <Gamepad2 size={20} />
        </div>
        <h3 className="flex-1 text-base font-bold leading-snug text-white">{game.title}</h3>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
          <Calendar size={12} /> {game.release_year}
        </span>
        {categoryName && (
          <span className="rounded-full bg-violet-600/20 px-2.5 py-1 text-xs font-medium text-violet-300">
            {categoryName}
          </span>
        )}
      </div>

      <p className="mb-5 line-clamp-3 flex-1 text-sm text-slate-400">{game.description}</p>

      <Link to={`/games/${game.id_games_pk}`} className="btn-primary w-full">
        Ver Detalhes <ArrowRight size={16} />
      </Link>
    </article>
  );
}