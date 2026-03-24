'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import { useAdminNavUnsavedFlag } from '@/components/admin/AdminUnsavedProvider'

const MSG = 'You have unsaved changes. Leave without saving?'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

/**
 * Same unsaved guard as the top admin nav — use for in-page links (dashboard cards, “back”, etc.).
 */
export default function AdminSafeLink({ href, children, onClick: userOnClick, ...rest }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const unsaved = useAdminNavUnsavedFlag()

  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        userOnClick?.(e)
        if (e.defaultPrevented) return
        if (!unsaved || href === pathname) return
        e.preventDefault()
        if (globalThis.confirm(MSG)) router.push(href)
      }}
    >
      {children}
    </Link>
  )
}
