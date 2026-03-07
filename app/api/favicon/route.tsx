import { NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { getSiteSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const settings = await getSiteSettings()
  const faviconUrl = settings.favicon_url && String(settings.favicon_url).trim()

  if (faviconUrl) {
    return NextResponse.redirect(faviconUrl, 302)
  }

  // Default: 32x32 DIGG-style icon (brand blue #1B2A6B, accent #F7941D)
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#1B2A6B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 700,
          color: '#F7941D',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        D
      </div>
    ),
    { width: 32, height: 32 }
  )
}
