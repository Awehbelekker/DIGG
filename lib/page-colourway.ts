/** Per-page lead accent colours (mockup defaults). */

export type PageColourway = { lead: string; leadDeep: string }

const TERRA: PageColourway = { lead: '#B56244', leadDeep: '#9A4F35' }
const SAGE: PageColourway = { lead: '#8A9A7B', leadDeep: '#6f7e60' }
const NAVY: PageColourway = { lead: '#172A45', leadDeep: '#0f1d33' }

export function colourwayForPath(pathname: string): PageColourway {
  if (pathname.startsWith('/insights')) return SAGE
  if (pathname.startsWith('/about')) return NAVY
  if (pathname.startsWith('/contact')) return TERRA
  return TERRA
}

export function colourwayToCssProperties(c: PageColourway): Record<string, string> {
  return {
    '--color-lead': c.lead,
    '--color-lead-deep': c.leadDeep,
  }
}
