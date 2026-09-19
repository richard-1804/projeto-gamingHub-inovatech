import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 24, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
      <Loader2 size={size} className="animate-spin text-violet-400" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse p-5">
      <div className="mb-3 h-5 w-3/4 rounded bg-slate-800" />
      <div className="mb-2 h-3 w-1/3 rounded bg-slate-800" />
      <div className="mb-4 h-3 w-full rounded bg-slate-800" />
      <div className="h-9 w-full rounded-lg bg-slate-800" />
    </div>
  );
}