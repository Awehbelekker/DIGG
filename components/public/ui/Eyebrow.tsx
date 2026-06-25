export default function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[var(--color-lead-deep)] bg-[var(--color-lead)]/10 px-3 sm:px-4 py-1.5 rounded-full mb-6 ${className}`}
    >
      <span className="w-2 h-2 bg-[var(--color-coral)] rounded-sm shrink-0" aria-hidden />
      {children}
    </div>
  )
}
