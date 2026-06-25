export default function SectionHead({
  kick,
  title,
  side,
  centered = false,
}: {
  kick?: string
  title: string
  side?: string
  centered?: boolean
}) {
  if (centered) {
    return (
      <div className="text-center mb-8 sm:mb-10">
        {kick && (
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lead-deep)] mb-3">{kick}</p>
        )}
        <h2
          className="text-[clamp(1.75rem,5vw,2.75rem)] font-extrabold tracking-tight text-[var(--color-ink)] leading-[1.05]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-5 mb-7 sm:mb-9">
      <div>
        {kick && (
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-lead-deep)] mb-2">{kick}</p>
        )}
        <h2
          className="text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold tracking-tight text-[var(--color-ink)] leading-[1.05] whitespace-pre-line"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      </div>
      {side && (
        <p className="text-[var(--color-muted)] text-sm max-w-sm leading-relaxed md:text-right md:shrink-0">
          {side}
        </p>
      )}
    </div>
  )
}
