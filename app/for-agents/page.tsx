import Hero from '@/components/public/Hero'
import AgentForm from '@/components/public/AgentForm'

export const metadata = {
  title: 'Estate Agent Partners | DIGG Architecture',
  description: 'Partner with the DIGG team to offer your sellers professional plans and 3D models as part of every listing. Cape Town estate agents welcome.',
}

export default function ForAgentsPage() {
  return (
    <>
      <Hero title="Give Your Sellers a Listing Nobody Else Can Offer." />

      {/* Opening Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl mb-8 leading-relaxed">
            You already know how to sell a property. DIGG gives you something to sell that your competitors don't have.
          </p>
          <p className="leading-relaxed">
            When you partner with our team, your sellers get professional architectural plans and a full 3D model as part of their listing package — not a PDF floor plan from an app, but accurate, council-standard documentation that makes buyers more confident and transactions cleaner.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1B2A6B] text-center mb-12 tracking-tight">How It Works</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { step: 'Step 1', text: 'You refer a seller who needs plans, wants to explore additions, or is preparing their property for sale or development.' },
              { step: 'Step 2', text: 'Our team handles everything: site visit, drawings, 3D render, any compliance queries. Your client gets a premium experience.' },
              { step: 'Step 3', text: 'You get a stronger listing, a more informed buyer, and a team you can rely on for every future mandate.' },
            ].map((item) => (
              <div key={item.step} className="bg-[#FAFAFA] p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-[#F7941D] mb-4">{item.step}</h3>
                <p className="leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Your Clients Get */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1B2A6B] text-center mb-12 tracking-tight">What Your Clients Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Professional As-Built Drawings', desc: 'Accurate documentation of their existing property' },
              { title: '3D Model', desc: "Showing buyers exactly what they're purchasing — and what's possible" },
              { title: 'Expert Development Advice', desc: 'On development potential, rezoning, or additional income streams' },
              { title: 'SACAP-Registered Team', desc: 'The same rigour we brought to multi-billion rand developments' },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-2xl border-l-4 border-[#F7941D] shadow-sm hover:shadow-md transition-shadow">
                <strong className="text-[#1B2A6B]">{item.title}</strong>
                <br />
                <span className="text-gray-600">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="bg-[#FAFAFA] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1B2A6B] text-center mb-12 tracking-tight">Register as a DIGG Partner Agent</h2>
          <AgentForm />
        </div>
      </section>
    </>
  )
}
