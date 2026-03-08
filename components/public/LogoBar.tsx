import RevealSection from './RevealSection'

type Logo = { name: string; imageUrl?: string }
type LogoBarProps = { title?: string; logos: Logo[] }

export default function LogoBar({ title, logos }: LogoBarProps) {
  return (
    <RevealSection className="bg-[#FAFAFA] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">{title}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {logos.map((logo, i) => (
            <div key={i} className="flex items-center justify-center h-12 opacity-60 hover:opacity-100 transition-opacity">
              {logo.imageUrl && logo.imageUrl.trim() ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={logo.imageUrl} alt={logo.name} className="max-h-12 max-w-[140px] object-contain" />
              ) : (
                <span className="text-lg font-bold text-gray-400 px-4">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  )
}
