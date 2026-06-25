import { DEFAULT_SECTION_DATA } from '@/lib/section-config'
import type { PageSection, SectionType } from '@/lib/types/database'

type StatItem = { label: string; value: string }

function normalizeStatsItems(items: StatItem[]): StatItem[] {
  return items.map((item) => {
    const value = item.value?.trim() ?? ''
    const label = item.label?.trim() ?? ''
    if (/^PAT\d+$/i.test(value) && /sacap/i.test(label)) {
      return { label: value, value: 'SACAP' }
    }
    return item
  })
}

/** Layer new code defaults onto DB sections so deploys upgrade features without wiping edits. */
export function mergeSectionsWithCodeDefaults(sections: PageSection[]): PageSection[] {
  return sections.map((section) => {
    const type = section.type as SectionType
    const defaults = DEFAULT_SECTION_DATA[type]
    if (!defaults) return section

    const data = { ...defaults, ...section.data }

    if (type === 'marquee') {
      const userItems = section.data.items as unknown[] | undefined
      if (Array.isArray(userItems) && userItems.length > 0) {
        data.items = userItems
      }
    }

    if (type === 'stats') {
      const items = (section.data.items as StatItem[] | undefined) ?? (defaults.items as StatItem[])
      data.items = normalizeStatsItems(items)
    }

    if (type === 'services' || type === 'work_cards' || type === 'grid') {
      const userItems = section.data.items as unknown[] | undefined
      if (Array.isArray(userItems) && userItems.length > 0) {
        data.items = userItems
      }
    }

    if (type === 'team') {
      const userMembers = section.data.members as unknown[] | undefined
      if (Array.isArray(userMembers) && userMembers.length > 0) {
        data.members = userMembers
      }
    }

    return { ...section, data }
  })
}
