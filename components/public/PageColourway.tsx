'use client'

import { usePathname } from 'next/navigation'
import { colourwayForPath, colourwayToCssProperties } from '@/lib/page-colourway'

export default function PageColourway({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'
  const css = colourwayToCssProperties(colourwayForPath(pathname))

  return (
    <div style={css as React.CSSProperties} className="min-h-full">
      {children}
    </div>
  )
}
