import Link from 'next/link'

interface HeroProps {
  title?: string
  subtitle?: string
  primaryCTA?: { text: string; href: string }
  secondaryCTA?: { text: string; href: string }
  backgroundImage?: string
}

export default function Hero({
  title = "Your Property Should Be Working Harder.",
  subtitle = "DIGG is a Cape Town architecture practice built on one idea: great design should generate real returns. We help property owners, investors and developers unlock the financial potential sitting inside their buildings and land.",
  primaryCTA = { text: "See What We Do", href: "#products" },
  secondaryCTA = { text: "Talk to Our Team", href: "/contact" },
  backgroundImage
}: HeroProps) {
  return (
    <section 
      className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center bg-gradient-to-br from-[#1B2A6B] to-[#2a3d8a] text-white py-12 sm:py-16 px-4 sm:px-6"
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {!backgroundImage && (
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80" aria-hidden>
          <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Add hero image in Settings</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight drop-shadow-sm">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl leading-relaxed opacity-95">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href={primaryCTA.href}
            className="min-h-[48px] flex items-center justify-center bg-[#F7941D] text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold hover:bg-[#e6850a] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2A6B]"
          >
            {primaryCTA.text}
          </Link>
          <Link
            href={secondaryCTA.href}
            className="min-h-[48px] flex items-center justify-center bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:text-[#1B2A6B] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2A6B]"
          >
            {secondaryCTA.text}
          </Link>
        </div>
      </div>
    </section>
  )
}
