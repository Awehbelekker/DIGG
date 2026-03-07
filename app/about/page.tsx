import Hero from '@/components/public/Hero'
import Link from 'next/link'

export const metadata = {
  title: 'About DIGG | Judy Downing & Our Team | Cape Town',
  description: 'Meet the DIGG team, led by Judy Downing — SACAP architect with 12+ years experience and a personal track record as Cape Town property investor since 2016.',
}

export default function AboutPage() {
  return (
    <>
      <Hero 
        title="The Team That Has Skin in the Game."
        subtitle=""
      />

      {/* Opening Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl font-medium mb-8 leading-relaxed">Most architects will tell you how to make your property look better.</p>
          <p className="text-xl font-medium mb-8 text-[#F7941D] leading-relaxed">The DIGG team will show you how to make it pay.</p>
          <p className="mb-4 leading-relaxed">
            We built DIGG around a frustration we kept seeing in the Cape Town property market: owners sitting on untapped potential with no trusted, practical guide to unlock it. Too many architects design for design's sake. Too many developers overpromise. Too many homeowners leave value on the table.
          </p>
          <p className="font-semibold">We built DIGG to be different.</p>
        </div>
      </section>

      {/* Judy's Story */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1B2A6B] mb-4 tracking-tight">Judy's Story — The Principal</h2>
          <h3 className="text-2xl font-semibold mb-8 text-[#F7941D]">Twelve years. Every scale. Every sector.</h3>
          <p className="mb-4">
            DIGG is led by Judy Downing — a SACAP-registered architect (PAT44740093) who holds a BSc Architecture (Hons) from the University of Pretoria and has spent over a decade working at the highest levels of the profession.
          </p>
          <p className="mb-4">
            Her career spans the full spectrum of architecture — from luxury coastal residences to a 300,000m² mixed-use mega-development in Cape Town. From a SAPOA award-winning office refurbishment in Johannesburg to a 14km² ultra-luxury Aman resort in Saudi Arabia, coordinated under world-renowned designer Jean-Michel Gathy. From 1,000+ group housing units to a complex international cold-storage facility where she personally eliminated over 2,000 BIM coordination clashes in under a month.
          </p>
          <p>
            She has worked at South Africa's leading practices — Swart & Associates, ARC Architects, Boogertman & Partners, Neo Architects, CNR Architects — across commercial, residential, industrial, retail, hospitality and government projects. What that means for you: Judy and our team bring the precision of a billion-rand project to every brief we take on, regardless of size.
          </p>
        </div>
      </section>

      {/* Investor Angle */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1B2A6B] mb-4 tracking-tight">The Investor Angle</h2>
          <h3 className="text-2xl font-semibold mb-8 text-[#F7941D]">We don't just design properties. We own them.</h3>
          <p className="mb-4">
            Since 2016, Judy has been an active short-term rental investor in the Cape Town market. Our team understands the Airbnb platform not from a textbook but from a real P&L. We know what guests respond to, what design decisions drive occupancy, and what property investors actually need from an architect — because we are investors too.
          </p>
          <p className="font-semibold">
            This is the difference between a practice that tells you what's possible and one that has personally navigated the same decisions you're facing.
          </p>
        </div>
      </section>

      {/* DIGG Philosophy */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1B2A6B] mb-4 tracking-tight">The DIGG Philosophy</h2>
          <h3 className="text-2xl font-semibold mb-8 text-[#F7941D]">Develop simply. Design with purpose. Deliver value.</h3>
          <p className="mb-4">
            DIGG is not here to win awards for complexity. We believe the best architectural solutions are the ones that work — financially, practically, and for the people who live and work in them. Creative thinking should produce simple, viable answers. Not overcomplicated, expensive ones.
          </p>
          <p>
            That means designing secondary dwellings that navigate council approval efficiently. It means structuring a 160m² building to serve as four rental units or a single home, depending on what the market needs. It means giving estate agents 3D models that help properties sell faster. It means building spaces that generate returns — not just spaces that photograph well.
          </p>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1B2A6B] text-center mb-12 tracking-tight">DIGG Credentials at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'SACAP Registered Architect', desc: 'PAT44740093' },
              { title: 'BSc Architecture (Hons)', desc: 'University of Pretoria' },
              { title: '12+ Years', desc: 'Professional Experience' },
              { title: 'International Projects', desc: 'South Africa, Saudi Arabia, Ghana' },
              { title: 'SAPOA Award Winner', desc: '66 Grayston Office Refurbishment' },
              { title: 'Active Investors', desc: 'Cape Town property since 2016' },
              { title: 'Specialist Software', desc: 'Revit, BIM 360, Navisworks, Enscape, Twin Motion' },
            ].map((cred) => (
              <div key={cred.title} className="bg-white p-6 rounded-2xl border-l-4 border-[#F7941D] shadow-sm hover:shadow-md transition-shadow">
                <strong className="text-[#1B2A6B]">{cred.title}</strong>
                <br />
                <span className="text-gray-600">{cred.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1B2A6B] text-white py-20 lg:py-24 my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Ready to see what your property could be?</h2>
          <p className="max-w-3xl mx-auto mb-10 text-lg opacity-90 leading-relaxed">
            Let's start with a conversation. No jargon, no pressure — just an honest look at what's possible for your property.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#F7941D] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#e6850a] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2A6B]"
          >
            Book a Free Discovery Call
          </Link>
        </div>
      </section>
    </>
  )
}
