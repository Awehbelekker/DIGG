/** Pillar block colour presets for pillars_interactive section. */

export type PillarColorKey = 'terra' | 'navy' | 'sage' | 'coral'

export const PILLAR_COLOR_MAP: Record<PillarColorKey, string> = {
  terra: '#B56244',
  navy: '#172A45',
  sage: '#8A9A7B',
  coral: '#E8624D',
}

export function pillarBg(colorKey: string): string {
  const k = colorKey as PillarColorKey
  return PILLAR_COLOR_MAP[k] ?? PILLAR_COLOR_MAP.terra
}
