import Hero from '@/components/public/Hero'
import ContactForm from '@/components/public/ContactForm'

export const metadata = {
  title: 'Contact DIGG | Cape Town Architecture Team',
  description: 'Talk to the DIGG team about your property project. First conversation free. Call Judy on 082 707 7080.',
}

export default function ContactPage() {
  return (
    <>
      <Hero 
        title="Let's Talk About Your Property."
        subtitle="Whether you're a homeowner with a half-formed idea, an estate agent with a seller who needs plans, or an investor with a piece of land and a vision — the first conversation is always free and always worth it."
      />

      <section className="py-12">
        <ContactForm />
      </section>

      {/* Contact Details */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#1B2A6B] mb-6">Contact Details</h3>
            <div className="space-y-4">
              <p>
                <strong>Judy Downing</strong> | Principal Architect | SACAP PAT44740093
              </p>
              <p>
                📞 <a href="tel:+27827077080" className="text-[#F7941D] hover:text-[#1B2A6B]">082 707 7080</a>
              </p>
              <p>
                ✉ <a href="mailto:judy@digg-ct.co.za" className="text-[#F7941D] hover:text-[#1B2A6B]">judy@digg-ct.co.za</a>
              </p>
              <p>📍 Cape Town, South Africa</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
