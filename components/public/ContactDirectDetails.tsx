import { COMPANY_LINE } from '@/lib/brand'

export default function ContactDirectDetails() {
  return (
    <section className="py-10 bg-white border-y border-[var(--color-greige)]/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-4">Prefer to reach out directly?</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center text-sm">
          <a
            href="tel:+27827077080"
            className="font-medium text-[var(--color-terracotta)] hover:text-[var(--color-terra-deep)]"
          >
            082 707 7080
          </a>
          <span className="hidden sm:inline text-[var(--color-greige)]" aria-hidden>
            ·
          </span>
          <a
            href="mailto:judy@digg-ct.co.za"
            className="font-medium text-[var(--color-terracotta)] hover:text-[var(--color-terra-deep)]"
          >
            judy@digg-ct.co.za
          </a>
          <span className="hidden sm:inline text-[var(--color-greige)]" aria-hidden>
            ·
          </span>
          <a
            href="https://wa.me/27827077080?text=Hi%20DIGG%2C%20I%27d%20like%20to%20talk%20about%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#25D366] hover:opacity-90"
          >
            WhatsApp
          </a>
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-6">{COMPANY_LINE}</p>
      </div>
    </section>
  )
}
