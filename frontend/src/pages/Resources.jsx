import StarBackground from '../components/StarBackground'

export default function Resources() {
  const resources = [
    {
      category: "Data Sources",
      items: [
        { name: "GAIA EDR3", desc: "European Space Agency's star catalog", url: "https://gea.esac.esa.int/archive/" },
        { name: "SIMBAD", desc: "Database of astronomical objects", url: "http://simbad.u-strasbg.fr/simbad/" },
        { name: "NASA Exoplanet Archive", desc: "Exoplanet data and tools", url: "https://exoplanetarchive.ipac.caltech.edu/" }
      ]
    },
    {
      category: "Educational",
      items: [
        { name: "NASA Astrophysics", desc: "Educational resources and materials", url: "https://science.nasa.gov/astrophysics" },
        { name: "ESA Education", desc: "European Space Agency education", url: "https://www.esa.int/Education" },
        { name: "Stellarium Web", desc: "Interactive star map", url: "https://stellarium-web.org/" }
      ]
    },
    {
      category: "Tools & Calculators",
      items: [
        { name: "Wolfram Alpha", desc: "Astronomical calculations", url: "https://www.wolframalpha.com/" },
        { name: "Astronomy Calculator", desc: "Various astronomical tools", url: "https://www.calculator.net/astronomy-calculator.html" },
        { name: "Space Math", desc: "NASA Space Math problems", url: "https://spacemath.gsfc.nasa.gov/" }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-space-dark relative overflow-hidden">
      <StarBackground />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-gradient">
              Resources
            </h1>
            <p className="text-xl text-purple-300 mb-8">
              Resources for Space Enthusiasts & Creatives
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="glass-effect rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gradient">Astronomical Constants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-purple-300 font-semibold mb-2">Speed of Light</div>
                  <div className="text-white text-sm">299,792.458 km/s</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-purple-300 font-semibold mb-2">Light Year</div>
                  <div className="text-white text-sm">9.461 × 10¹² km</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-purple-300 font-semibold mb-2">Parsec</div>
                  <div className="text-white text-sm">3.262 light years</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-purple-300 font-semibold mb-2">Astronomical Unit</div>
                  <div className="text-white text-sm">149,597,870.7 km</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-purple-300 font-semibold mb-2">Solar Mass</div>
                  <div className="text-white text-sm">1.989 × 10³⁰ kg</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-purple-300 font-semibold mb-2">Julian Year</div>
                  <div className="text-white text-sm">365.25 days</div>
                </div>
              </div>
            </div>

            {resources.map((category, idx) => (
              <div key={idx} className="glass-effect rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-purple-300">{category.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all hover:scale-105 block"
                    >
                      <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}


