import PageWrap from '@/components/public/ui/PageWrap'
import SectionHead from '@/components/public/ui/SectionHead'
import ImageWithPlaceholder from '@/components/public/ImageWithPlaceholder'

type Member = { name: string; role: string; credential?: string; photoUrl?: string; initials?: string }

function Avatar({ member }: { member: Member }) {
  const initials =
    member.initials ||
    member.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <div className="relative mx-auto mb-4 w-[72px] h-[72px] group">
      <div
        className="absolute -inset-1 rounded-full bg-[var(--color-coral)]/40 blur-md group-hover:bg-[var(--color-coral)]/60 transition-all duration-300 motion-reduce:transition-none"
        aria-hidden
      />
      <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden ring-2 ring-[var(--color-coral)]/80 shadow-[0_0_20px_rgba(232,98,77,0.45)]">
        {member.photoUrl?.trim() ? (
          <ImageWithPlaceholder
            src={member.photoUrl}
            alt={member.name}
            aspectRatio="square"
            className="w-full h-full object-cover"
            placeholderLabel={initials}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-[var(--color-lead)] text-white font-extrabold text-xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {initials}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TeamGrid({
  kick,
  title,
  members,
}: {
  kick?: string
  title: string
  members: Member[]
}) {
  return (
    <section className="section-y bg-[var(--color-bone)]">
      <PageWrap>
        <SectionHead kick={kick} title={title} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {members.map((m, i) => (
            <div key={i} className="bg-white rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 lg:p-7 border border-[var(--color-greige)]/50 text-center">
              <Avatar member={m} />
              <h3 className="font-bold text-lg text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {m.name}
              </h3>
              <p className="text-[13px] font-semibold text-[var(--color-lead-deep)] mt-1">{m.role}</p>
              {m.credential && <p className="text-xs text-[var(--color-muted)] mt-2 italic">{m.credential}</p>}
            </div>
          ))}
        </div>
      </PageWrap>
    </section>
  )
}
