export default function Input({ label, error, as = 'input', children, className = '', ...props }) {
  const base = `w-full rounded-lg border bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:ring-2 ${
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
      : 'border-slate-700 focus:border-violet-500 focus:ring-violet-500/30'
  } ${className}`;

  const Tag = as;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <Tag className={base} {...props}>
        {children}
      </Tag>
      {error && <span className="text-xs font-medium text-red-400">{error}</span>}
    </div>
  );
}