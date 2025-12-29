export default function SolarSystemSidebar({ onStarSelect, selectedStarName, stars = [], onPlanetSelect, selectedPlanetName }) {
  const planets = [
    {
      name: "Mercury",
      emoji: "☿️",
      distance: "0.39 AU",
      period: "88 days",
      description: "Closest planet to the Sun, extreme temperature variations"
    },
    {
      name: "Venus",
      emoji: "♀️",
      distance: "0.72 AU",
      period: "225 days",
      description: "Hottest planet, thick toxic atmosphere"
    },
    {
      name: "Earth",
      emoji: "🌍",
      distance: "1.00 AU",
      period: "365 days",
      description: "Our home planet, only known place with life"
    },
    {
      name: "Mars",
      emoji: "♂️",
      distance: "1.52 AU",
      period: "687 days",
      description: "The Red Planet, potential for past or present life"
    },
    {
      name: "Jupiter",
      emoji: "♃",
      distance: "5.20 AU",
      period: "12 years",
      description: "Largest planet, gas giant with 95 known moons"
    },
    {
      name: "Saturn",
      emoji: "♄",
      distance: "9.58 AU",
      period: "29 years",
      description: "Famous for its spectacular ring system"
    },
    {
      name: "Uranus",
      emoji: "♅",
      distance: "19.22 AU",
      period: "84 years",
      description: "Ice giant, rotates on its side"
    },
    {
      name: "Neptune",
      emoji: "♆",
      distance: "30.07 AU",
      period: "165 years",
      description: "Farthest planet, strongest winds in the solar system"
    }
  ]

  return (
    <div className="hidden lg:block fixed left-0 top-0 h-full w-80 bg-space-dark/95 backdrop-blur-lg border-r border-purple-500/30 z-20 overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gradient mb-2">
            ☀️ Solar System
          </h2>
          <p className="text-sm text-gray-400">
            Planets in our solar system
          </p>
        </div>

        <div className="space-y-3">
          {planets.map((planet, index) => {
            const isSelected = selectedPlanetName === planet.name
            return (
            <div
              key={planet.name}
              onClick={() => onPlanetSelect && onPlanetSelect(planet)}
              className={`glass-effect rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 border ${
                isSelected 
                  ? 'border-purple-500 bg-purple-500/20' 
                  : 'border-white/10 hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{planet.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-white">
                      {planet.name}
                    </h3>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Distance:</span>
                      <span className="text-white font-semibold">{planet.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Orbital Period:</span>
                      <span className="text-white font-semibold">{planet.period}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {planet.description}
                  </p>
                </div>
              </div>
            </div>
            )
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="glass-effect rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">☀️</span>
              <h3 className="text-lg font-bold text-white">The Sun</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Our star, a G-type main-sequence star. It contains 99.86% of the solar system's mass and provides energy for all life on Earth.
            </p>
          </div>
        </div>

        {/* Featured Stars Section */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gradient mb-2">
              ⭐ Featured Stars
            </h2>
            <p className="text-sm text-gray-400">
              Click to search and view details
            </p>
          </div>

          <div className="space-y-3">
            {/* Sirius Card */}
            {(() => {
              const sirius = stars.find(s => s.name === 'Sirius')
              if (!sirius) return null
              const isSelected = selectedStarName === 'Sirius'
              return (
                <div
                  onClick={() => onStarSelect && onStarSelect(sirius)}
                  className={`glass-effect rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 border ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-white/10 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">⭐</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-white">Sirius</h3>
                        {isSelected && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-xs text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Distance:</span>
                          <span className="text-white font-semibold">{sirius.distance_ly.toFixed(2)} ly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Magnitude:</span>
                          <span className="text-white font-semibold">{sirius.magnitude.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white font-semibold">{sirius.spectral_type}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        The brightest star in the night sky, also known as the "Dog Star"
                      </p>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Vega Card */}
            {(() => {
              const vega = stars.find(s => s.name === 'Vega')
              if (!vega) return null
              const isSelected = selectedStarName === 'Vega'
              return (
                <div
                  onClick={() => onStarSelect && onStarSelect(vega)}
                  className={`glass-effect rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 border ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-white/10 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">✨</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-white">Vega</h3>
                        {isSelected && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-xs text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Distance:</span>
                          <span className="text-white font-semibold">{vega.distance_ly.toFixed(2)} ly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Magnitude:</span>
                          <span className="text-white font-semibold">{vega.magnitude.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white font-semibold">{vega.spectral_type}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        One of the brightest stars, part of the Summer Triangle asterism
                      </p>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

