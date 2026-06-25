import PageWrap from '@/components/public/ui/PageWrap'
import SectionHead from '@/components/public/ui/SectionHead'
import TeamAvatar from '@/components/public/TeamAvatar'
import { resolveMemberPhotoUrl } from '@/lib/image-storage'

type Member = {
  name: string
  role: string
  credential?: string
  photoUrl?: string
  photo_url?: string
  imageUrl?: string
  initials?: string
}

function memberPhotoUrl(member: Member): string | undefined {
  return resolveMemberPhotoUrl(member as Record<string, unknown>)
}

function memberInitials(member: Member): string {
  if (member.initials?.trim()) return member.initials.trim().slice(0, 2).toUpperCase()
  return member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
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
            <div key={i} className="bg-white rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 lg:p-8 border border-[var(--color-greige)]/50 text-center">
              <TeamAvatar name={m.name} photoUrl={memberPhotoUrl(m)} initials={memberInitials(m)} />
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
