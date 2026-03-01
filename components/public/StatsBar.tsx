interface Stat {
  number: string
  label: string
}

interface StatsBarProps {
  stats?: Stat[]
}

const defaultStats: Stat[] = [
  { number: "12+", label: "Years of experience" },
  { number: "1,000+", label: "Residential units delivered" },
  { number: "300,000m²", label: "Largest single project" },
  { number: "2016", label: "Property investors since" }
]

export default function StatsBar({ stats = defaultStats }: StatsBarProps) {
  return (
    <section className="bg-gradient-to-r from-[#1B2A6B] to-[#2a3d8a] text-white py-12 my-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <span className="block text-4xl md:text-5xl font-bold text-[#F7941D] mb-2">
                {stat.number}
              </span>
              <span className="text-sm opacity-90">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
