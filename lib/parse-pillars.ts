/** Split footer / settings pillars string into individual words. */
export function parsePillarWords(pillars: string): string[] {
  const trimmed = pillars.trim()
  if (!trimmed) return []

  // "Develop · Invest · Grow · Give" or "Develop. Invest. Grow. Give."
  const bySeparator = trimmed
    .split(/\s*[·•|]\s*|\s*,\s*|\.\s+(?=[A-Za-z])/)
    .map((w) => w.replace(/\.$/, '').trim())
    .filter(Boolean)

  if (bySeparator.length > 1) return bySeparator

  // Fallback: whitespace-separated words
  return trimmed.split(/\s+/).map((w) => w.replace(/\.$/, '').trim()).filter(Boolean)
}
