import Hero from '@/components/public/Hero'

export const metadata = {
  title: 'Community | DIGG Architecture Cape Town',
  description: 'DIGG gives back through student mentorship, SME support, urban activation at Echium Park, and community gardening.',
}

export default function GivePage() {
  const initiatives = [
    {
      title: 'Initiative 1 — Student Empowerment',
      subtitle: 'Training the next generation — and paying them for it.',
      description: 'Architecture students spend years learning theory before earning a cent. We\'re building a programme that changes that. We work with students to draft and document existing buildings — feeding real professional work into our network while generating real income for the students who do it. Real experience. Real revenue. No waiting.',
      bgColor: 'bg-white'
    },
    {
      title: 'Initiative 2 — SME Network Support',
      subtitle: 'Architecture for the businesses that need it most.',
      description: 'Small and medium businesses are the backbone of Cape Town\'s economy — and often the last to get access to proper architectural support. We maintain a network to assist smaller businesses with development, maintenance, upgrades and compliance, at rates and with an approach designed for their scale.',
      bgColor: 'bg-[#FAFAFA]'
    },
    {
      title: 'Initiative 3 — Echium Park',
      subtitle: 'Making public space work for everyone.',
      description: 'Echium Park is DIGG\'s first defined urban design project — a community space with the potential to become a genuine neighbourhood asset. We\'re developing plans to activate this space in a way Cape Town can be proud of. Updates to follow as the project develops.',
      bgColor: 'bg-white'
    },
    {
      title: 'Initiative 4 — Community Gardening',
      subtitle: 'Growing food. Growing community.',
      description: 'We\'re establishing a community growing group — a practical, hands-on project that brings people together, produces food, and creates green space in an urban environment. Simple. Purposeful. Very DIGG.',
      note: 'Follow our progress on these projects in the Insights section. We\'ll document the journey honestly — including the setbacks.',
      bgColor: 'bg-[#FAFAFA]'
    }
  ]

  return (
    <>
      <Hero title="Because Architecture Should Serve More Than One Client." />

      {/* Opening Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl mb-8">The 'G' in DIGG is the one we're most proud of.</p>
          <p>
            Building a successful practice is not enough on its own. From the beginning, DIGG has been committed to giving back — to the profession, to the community, and to the city we call home. These are not marketing initiatives. They are part of who we are as a team.
          </p>
        </div>
      </section>

      {/* Initiatives */}
      {initiatives.map((initiative, index) => (
        <section key={index} className={`${initiative.bgColor} py-12`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-[#1B2A6B] mb-4">{initiative.title}</h2>
              <h3 className="text-2xl font-semibold mb-6 text-[#F7941D]">{initiative.subtitle}</h3>
              <p className="mb-4 leading-relaxed">{initiative.description}</p>
              {initiative.note && (
                <p className="mt-6 italic text-gray-600">{initiative.note}</p>
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
