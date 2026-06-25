import Link from 'next/link'
import ImageWithPlaceholder from '@/components/public/ImageWithPlaceholder'

const GRADIENTS: Record<string, string> = {
  terra: 'linear-gradient(135deg,#B56244,#9A4F35)',
  navy: 'linear-gradient(135deg,#172A45,#0f1d33)',
  sage: 'linear-gradient(135deg,#8A9A7B,#6f7e60)',
  coral: 'linear-gradient(135deg,#E8624D,#c94f3c)',
  greige: 'linear-gradient(135deg,#C9C0B2,#a89e8d)',
}

export type WorkCardItem = {
  title: string
  description: string
  link?: string
  status?: string
  contentType?: string
  gradientKey?: string
  imageUrl?: string
  readLabel?: string
}

export default function WorkCard({ item }: { item: WorkCardItem }) {
  const href = item.link?.trim() || '#'
  const grad = GRADIENTS[item.gradientKey || 'terra'] ?? GRADIENTS.terra
  const badge = item.status
  const typeLabel = item.contentType === 'insight' ? 'Insight' : item.contentType === 'project' ? 'Project' : ''

  return (
    <Link
      href={href}
      className="block bg-white rounded-[20px] sm:rounded-[22px] overflow-hidden border border-[var(--color-greige)]/50 active:scale-[0.99] md:hover:-translate-y-1 md:hover:shadow-xl transition-all duration-250 group"
    >
      <div
        className="h-[160px] sm:h-[180px] md:h-[200px] relative flex items-end p-4 sm:p-5"
        style={item.imageUrl?.trim() ? undefined : { background: grad }}
      >
        {item.imageUrl?.trim() ? (
          <ImageWithPlaceholder
            src={item.imageUrl}
            alt={item.title}
            aspectRatio="auto"
            className="absolute inset-0 w-full h-full object-cover"
            placeholderLabel={item.title}
          />
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center font-black text-[3.5rem] sm:text-[5rem] text-white/20 pointer-events-none"
            style={{ fontFamily: 'var(--font-heading)' }}
            aria-hidden
          >
            g.
          </span>
        )}
        {badge && (
          <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full bg-white/92 text-[var(--color-ink)] z-10">
            {badge}
          </span>
        )}
        {typeLabel && (
          <span className="absolute top-4 right-4 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-ink)]/80 text-white z-10">
            {typeLabel}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-ink)] mb-2 md:group-hover:text-[var(--color-lead-deep)] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
          {item.title}
        </h3>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3">{item.description}</p>
        <span className="inline-flex items-center gap-1.5 mt-3.5 text-[13px] font-bold text-[var(--color-lead-deep)]">
          {item.readLabel || 'Read the story →'}
        </span>
      </div>
    </Link>
  )
}
