export default function ResearchHub() {
  const planets = [
    { name: "Mercury", emoji: "☿️", distance: "0.39 AU", period: "88 days", note: "Closest to Sun" },
    { name: "Venus", emoji: "♀️", distance: "0.72 AU", period: "225 days", note: "Hottest planet" },
    { name: "Earth", emoji: "🌍", distance: "1.00 AU", period: "365 days", note: "Only known life" },
    { name: "Mars", emoji: "♂️", distance: "1.52 AU", period: "687 days", note: "Red Planet" },
    { name: "Jupiter", emoji: "♃", distance: "5.20 AU", period: "12 years", note: "Gas giant, 95 moons" },
    { name: "Saturn", emoji: "♄", distance: "9.58 AU", period: "29 years", note: "Iconic rings" },
    { name: "Uranus", emoji: "♅", distance: "19.22 AU", period: "84 years", note: "Rotates on its side" },
    { name: "Neptune", emoji: "♆", distance: "30.07 AU", period: "165 years", note: "Strongest winds" }
  ]

  const researchTopics = [
    {
      category: "Aerospace Engineering",
      items: [
        {
          title: "Propulsion Systems",
          description: "Latest advances in ion propulsion, nuclear thermal rockets, and solar sails",
          keywords: ["propulsion", "rocket engines", "thrust", "specific impulse"],
          difficulty: "Advanced"
        },
        {
          title: "Spacecraft Design",
          description: "Materials, structures, and systems for deep space missions",
          keywords: ["spacecraft", "mission design", "life support", "radiation shielding"],
          difficulty: "Intermediate"
        },
        {
          title: "Orbital Mechanics",
          description: "Hohmann transfers, Lagrange points, and interplanetary trajectories",
          keywords: ["orbital mechanics", "trajectory", "delta-v", "Hohmann transfer"],
          difficulty: "Advanced"
        }
      ]
    },
    {
      category: "Material Science",
      items: [
        {
          title: "Space-Grade Materials",
          description: "Materials that withstand extreme temperatures, radiation, and vacuum",
          keywords: ["composites", "ceramics", "titanium", "carbon fiber"],
          difficulty: "Intermediate"
        },
        {
          title: "Radiation Shielding",
          description: "Materials and techniques for protecting astronauts from cosmic radiation",
          keywords: ["radiation", "shielding", "polyethylene", "water"],
          difficulty: "Advanced"
        },
        {
          title: "Thermal Management",
          description: "Materials and systems for temperature control in space",
          keywords: ["thermal", "insulation", "heat pipes", "radiators"],
          difficulty: "Intermediate"
        }
      ]
    },
    {
      category: "Astronomy & Astrophysics",
      items: [
        {
          title: "Exoplanet Research",
          description: "Latest discoveries and methods for detecting habitable worlds",
          keywords: ["exoplanets", "habitable zone", "transit method", "spectroscopy"],
          difficulty: "Intermediate"
        },
        {
          title: "Stellar Evolution",
          description: "How stars form, evolve, and die across the universe",
          keywords: ["stellar evolution", "main sequence", "supernova", "white dwarf"],
          difficulty: "Advanced"
        },
        {
          title: "Dark Matter & Energy",
          description: "Current research on the universe's mysterious components",
          keywords: ["dark matter", "dark energy", "cosmology", "WMAP"],
          difficulty: "Expert"
        }
      ]
    },
    {
      category: "Space Exploration",
      items: [
        {
          title: "Mars Missions",
          description: "Current and planned missions to the Red Planet",
          keywords: ["Mars", "Perseverance", "Ingenuity", "sample return"],
          difficulty: "Intermediate"
        },
        {
          title: "Lunar Exploration",
          description: "Artemis program and future lunar bases",
          keywords: ["Moon", "Artemis", "lunar base", "regolith"],
          difficulty: "Intermediate"
        },
        {
          title: "Interstellar Travel",
          description: "Theoretical concepts and challenges for reaching other stars",
          keywords: ["interstellar", "Breakthrough Starshot", "warp drive", "generation ship"],
          difficulty: "Expert"
        }
      ]
    }
  ]

  const quickFacts = [
    {
      title: "Travel Time to Mars",
      fact: "With current technology: 6-9 months one way",
      details: "Using Hohmann transfer orbit. Future propulsion could reduce to 3 months."
    },
    {
      title: "Distance to Nearest Star",
      fact: "Proxima Centauri: 4.24 light-years",
      details: "At 10% speed of light, journey would take ~42 years"
    },
    {
      title: "Spacecraft Speed Record",
      fact: "Parker Solar Probe: 692,000 km/h",
      details: "Fastest human-made object, achieved using Venus gravity assists"
    },
    {
      title: "Radiation in Space",
      fact: "ISS receives ~0.5-1 mSv/day",
      details: "Earth surface: ~2.4 mSv/year. Mars surface: ~0.67 mSv/day"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-gradient mb-4">
          📚 Research Hub
        </h2>
        <p className="text-gray-300 text-sm mb-6">
          Comprehensive resources for aerospace engineers, astronomers, and space researchers.
          Find hard-to-locate information quickly.
        </p>

        {/* Solar System Stream */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-purple-300">🪐 Solar System Snapshot</h3>
              <p className="text-xs text-gray-400">Quick facts for all 8 planets — scrollable strip</p>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 min-w-max py-2">
              {planets.map((p, idx) => (
                <div
                  key={idx}
                  className="glass-effect rounded-xl px-4 py-3 border border-white/10 hover:border-purple-500/30 transition-all flex items-center gap-3 flex-shrink-0 min-w-[220px]"
                >
                  <div className="text-2xl">{p.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200">
                        {p.distance}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center justify-between mt-1">
                      <span>Period: {p.period}</span>
                      <span className="text-gray-300">{p.note}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {quickFacts.map((fact, idx) => (
            <div key={idx} className="glass-effect rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-sm font-bold text-blue-300 mb-1">{fact.title}</h3>
              <p className="text-white font-semibold mb-1">{fact.fact}</p>
              <p className="text-xs text-gray-400">{fact.details}</p>
            </div>
          ))}
        </div>

        {/* Research Topics */}
        {researchTopics.map((category, catIdx) => (
          <div key={catIdx} className="mb-6">
            <h3 className="text-xl font-bold text-purple-300 mb-3">
              {category.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="glass-effect rounded-lg p-4 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white">{item.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.difficulty === 'Expert' ? 'bg-red-500/20 text-red-400' :
                      item.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.keywords.map((keyword, kwIdx) => (
                      <span
                        key={kwIdx}
                        className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Research Tools */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-bold text-white mb-3">🔧 Research Tools & Databases</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong className="text-purple-300">NASA Technical Reports:</strong>
              <span className="text-gray-300 ml-2">ntrs.nasa.gov</span>
            </div>
            <div>
              <strong className="text-purple-300">arXiv Astrophysics:</strong>
              <span className="text-gray-300 ml-2">arxiv.org/list/astro-ph</span>
            </div>
            <div>
              <strong className="text-purple-300">ESA Publications:</strong>
              <span className="text-gray-300 ml-2">esa.int/publications</span>
            </div>
            <div>
              <strong className="text-purple-300">Materials Database:</strong>
              <span className="text-gray-300 ml-2">materialsproject.org</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

