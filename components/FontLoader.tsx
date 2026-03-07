'use client'

import { useEffect } from 'react'

export default function FontLoader({ href }: { href: string }) {
  useEffect(() => {
    if (!href || typeof document === 'undefined') return
    const id = 'google-fonts-custom'
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
    } else {
      link.href = href
    }
  }, [href])
  return null
}
