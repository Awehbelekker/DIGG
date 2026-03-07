'use client'

import Script from 'next/script'

/**
 * Loads an optional analytics script when NEXT_PUBLIC_ANALYTICS_SCRIPT is set.
 * Set to the script URL (e.g. GA4 gtag.js or Plausible script src).
 */
export default function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT?.trim()
  if (!src) return null
  return <Script src={src} strategy="afterInteractive" />
}
