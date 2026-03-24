'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import { useAdminNavUnsavedFlag } from '@/components/admin/AdminUnsavedProvider'

const MSG = 'You have unsaved changes. Leave without saving?'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string
  /** Opens in a new tab; still prompts when there are unsaved changes. */
  openInNewTab?: boolean
}

/**
 * Same unsaved guard as the top admin nav — use for in-page links (dashboard cards, “back”, etc.).
 */
export default function AdminSafeLink({
  href,
  children,
  onClick: userOnClick,
  openInNewTab,
  ...rest
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const unsaved = useAdminNavUnsavedFlag()

  return (
    <Link
      href={href}
      {...rest}
      {...(openInNewTab ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {})}
      onClick={(e) => {
        userOnClick?.(e)
        if (e.defaultPrevented) return
        if (!unsaved) return
        if (href === pathname) return
        e.preventDefault()
        if (!globalThis.confirm(MSG)) return
        if (openInNewTab) {
          window.open(href, '_blank', 'noopener,noreferrer')
        } else {
          router.push(href)
        }
      }}
    >
      {children}
    </Link>
  )
}
