/** Normalize SA phone to wa.me digits (no +). */
export function phoneToWaMe(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('27')) return digits
  if (digits.startsWith('0')) return `27${digits.slice(1)}`
  return digits
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const num = phoneToWaMe(phone)
  if (!num) return ''
  const q = message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ''
  return `https://wa.me/${num}${q}`
}

export function buildTelHref(phone: string): string {
  const digits = phone.replace(/\s/g, '').replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : '#'
}
