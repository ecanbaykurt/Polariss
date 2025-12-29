import { useState, useEffect, useRef } from 'react'

export default function SolarSystemCarousel({ onPlanetSelect, selectedPlanetName }) {
  const [isPaused, setIsPaused] = useState(false)
  const scrollContainerRef = useRef(null)
  const animationRef = useRef(null)

  const planets = [
    {
      name: "Mercury",
      emoji: "☿️",
      distance: "0.39 AU",
      period: "88 days",
      description: "Closest planet to the Sun, extreme temperature variations",
      color: "from-gray-500 to-gray-700"
    },
    {
      name: "Venus",
      emoji: "♀️",
      distance: "0.72 AU",
      period: "225 days",
      description: "Hottest planet, thick toxic atmosphere",
      color: "from-yellow-500 to-orange-600"
    },
    {
      name: "Earth",
      emoji: "🌍",
      distance: "1.00 AU",
      period: "365 days",
      description: "Our home planet, only known place with life",
      color: "from-blue-500 to-green-500"
    },
    {
      name: "Mars",
      emoji: "♂️",
      distance: "1.52 AU",
      period: "687 days",
      description: "The Red Planet, potential for past or present life",
      color: "from-red-500 to-orange-600"
    },
    {
      name: "Jupiter",
      emoji: "♃",
      distance: "5.20 AU",
      period: "12 years",
      description: "Largest planet, gas giant with 95 known moons",
      color: "from-orange-500 to-amber-600"
    },
    {
      name: "Saturn",
      emoji: "♄",
      distance: "9.58 AU",
      period: "29 years",
      description: "Famous for its spectacular ring system",
      color: "from-yellow-400 to-amber-500"
    },
    {
      name: "Uranus",
      emoji: "♅",
      distance: "19.22 AU",
      period: "84 years",
      description: "Ice giant, rotates on its side",
      color: "from-cyan-400 to-blue-500"
    },
    {
      name: "Neptune",
      emoji: "♆",
      distance: "30.07 AU",
      period: "165 years",
      description: "Farthest planet, strongest winds in the solar system",
      color: "from-blue-600 to-indigo-700"
    }
  ]

  // Duplicate planets for seamless loop
  const duplicatedPlanets = [...planets, ...planets, ...planets]

  useEffect(() => {
    if (!scrollContainerRef.current) return

    // Start from the middle set of planets for seamless loop
    if (scrollContainerRef.current) {
      const cardWidth = 336 // 320px card + 16px gap
      scrollContainerRef.current.scrollLeft = cardWidth * planets.length
    }

    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    let scrollPosition = scrollContainerRef.current?.scrollLeft || 0
    const scrollSpeed = 0.3 // pixels per frame (adjust for speed)
    const cardWidth = 336 // 320px card + 16px gap
    const resetPoint = cardWidth * planets.length

    const animate = () => {
      if (!isPaused && scrollContainerRef.current) {
        scrollPosition += scrollSpeed
        
        // Reset position when we've scrolled through one set of planets
        if (scrollPosition >= resetPoint * 2) {
          scrollPosition = resetPoint
        }
        
        scrollContainerRef.current.scrollLeft = scrollPosition
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused, planets.length])

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-1">
            🪐 Solar System Planets
          </h2>
          <p className="text-sm text-gray-400">
            Click on a planet to explore its details
          </p>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-4 py-2 rounded-lg glass-effect hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all"
          title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
        >
          {isPaused ? "▶️ Resume" : "⏸️ Pause"}
        </button>
      </div>

      <div className="relative">
        {/* Gradient fade on left */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-space-dark via-space-dark/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Gradient fade on right */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-space-dark/80 to-space-dark z-10 pointer-events-none"></div>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-hidden scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedPlanets.map((planet, index) => {
            const isSelected = selectedPlanetName === planet.name
            return (
              <div
                key={`${planet.name}-${index}`}
                onClick={() => onPlanetSelect && onPlanetSelect(planet)}
                className={`flex-shrink-0 w-80 glass-effect rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 border ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/50' 
                    : 'border-white/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20'
                }`}
              >
                <div className="flex flex-col items-center text-center mb-4">
                  <div className={`text-6xl mb-3 bg-gradient-to-br ${planet.color} p-4 rounded-full w-20 h-20 flex items-center justify-center shadow-lg`}>
                    {planet.emoji}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {planet.name}
                  </h3>
                  {isSelected && (
                    <span className="text-xs px-3 py-1 rounded-full bg-purple-500/30 text-purple-300 mb-2">
                      Selected
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-400">Distance:</span>
                    <span className="text-white font-bold text-lg">{planet.distance}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-400">Orbital Period:</span>
                    <span className="text-white font-bold text-lg">{planet.period}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-4 leading-relaxed text-center">
                  {planet.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

