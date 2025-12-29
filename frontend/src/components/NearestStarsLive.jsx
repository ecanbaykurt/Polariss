import { useState, useEffect, useMemo } from 'react'

export default function NearestStarsLive({ stars, simpleMode = true }) {
  const [liveDistances, setLiveDistances] = useState({})
  const [lastUpdate, setLastUpdate] = useState(null)

  // Get nearest 10 stars - memoize to avoid unnecessary recalculations
  const nearestStars = useMemo(() => {
    return [...stars]
      .sort((a, b) => a.distance_ly - b.distance_ly)
      .slice(0, 10)
  }, [stars])

  useEffect(() => {
    const calculateLiveDistances = () => {
      const now = new Date()
      const kmPerLy = 9.4607304725808e12
      const referenceDate = new Date('2025-01-01T00:00:00Z')
      const secondsElapsed = (now - referenceDate) / 1000

      const distances = {}
      nearestStars.forEach(star => {
        // Calculate distance change based on radial velocity
        const distanceChange = (star.radial_velocity_km_s * secondsElapsed) / kmPerLy
        const currentDistance = star.distance_ly + distanceChange
        const changePerSecond = star.radial_velocity_km_s / kmPerLy

        distances[star.name] = {
          distance_ly: currentDistance,
          change_per_second: changePerSecond,
          change_per_day: changePerSecond * 86400,
          movement_direction: star.movement_direction
        }
      })

      setLiveDistances(distances)
      setLastUpdate(now)
    }

    // Initial calculation
    calculateLiveDistances()

    // Update every 3 seconds (optimized for performance)
    const interval = setInterval(calculateLiveDistances, 3000)

    return () => clearInterval(interval)
  }, [nearestStars])

  if (nearestStars.length === 0) return null

  return (
    <div className="glass-effect rounded-2xl p-6 mb-8 border border-purple-500/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-2">
            🌟 Nearest 10 Stars - Real-Time Distances
          </h2>
          <p className="text-sm text-gray-400">
            {simpleMode 
              ? 'Star distances from Earth are updating every second'
              : 'Real-time distance updates based on radial velocity'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="space-y-3">
        {nearestStars.map((star, index) => {
          const liveData = liveDistances[star.name]
          if (!liveData) return null

          return (
            <div
              key={star.name}
              className="glass-effect rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 border border-white/10 hover:border-purple-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{star.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        liveData.movement_direction === 'away' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {liveData.movement_direction === 'away' ? '→ Moving Away' : '← Moving Toward'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {simpleMode ? 'Speed:' : 'Radial Velocity:'} {Math.abs(star.radial_velocity_km_s).toFixed(2)} km/s
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-gradient">
                    {liveData.distance_ly.toFixed(6)}
                    <span className="text-lg text-gray-400 ml-1">ly</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {liveData.movement_direction === 'away' ? '+' : '-'}
                    {(Math.abs(liveData.change_per_day) * 1000000).toFixed(3)} × 10⁻⁶ ly/day
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {lastUpdate && (
        <div className="mt-4 pt-4 border-t border-gray-700/50 text-center">
          <p className="text-xs text-gray-500">
            {simpleMode ? 'Last update:' : 'Last updated:'} {lastUpdate.toLocaleTimeString('en-US')} UTC
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {simpleMode 
              ? 'Distances calculated using kinematic extrapolation based on radial velocity'
              : 'Distances calculated using kinematic extrapolation based on radial velocity'}
          </p>
        </div>
      )}
    </div>
  )
}

