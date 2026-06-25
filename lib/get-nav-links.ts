export type NavLink = { href: string; label: string }

/** Four-page sitemap per technical brief: Home, Work, About, Contact */
export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/insights', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export async function getNavLinks(): Promise<NavLink[]> {
  return NAV_LINKS
}
