import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 18 }) {
  const interactive = typeof onChange === 'function';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange(n)}
          className={interactive ? 'transition hover:scale-110' : 'cursor-default'}
        >
          <Star
            size={size}
            className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
          />
        </button>
      ))}
    </div>
  );
}