import { useState, useEffect } from 'react'

export default function LiveDistanceCounter() {
  const [distance, setDistance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [northPoleDeviation, setNorthPoleDeviation] = useState(null)

  useEffect(() => {
    // Calculate current distance based on reference date
    const calculateCurrentDistance = () => {
      const baseDistance = 446.5 // Reference distance at 2025-01-01
      const now = new Date()
      const referenceDate = new Date('2025-01-01T00:00:00Z')
      const secondsElapsed = (now - referenceDate) / 1000
      
      // Polaris parameters
      const radialVelocity = 3.76 // km/s (moving away)
      const kmPerLy = 9.4607304725808e12
      
      // Calculate distance change
      const distanceChange = (radialVelocity * secondsElapsed) / kmPerLy
      const currentDistance = baseDistance + distanceChange
      const changePerSecond = radialVelocity / kmPerLy
      
      // Calculate angular deviation from North Pole
      // Polaris declination: 89.264109444° (J2000.0)
      // North Pole: 90°
      // Deviation = 90° - declination
      // Precession causes slow change: ~0.0000139° per year (26,000 year cycle)
      const baseDeclination = 89.264109444 // J2000.0
      const precessionRate = 0.0000139 // degrees per year
      const yearsSinceJ2000 = (now - new Date('2000-01-01T12:00:00Z')) / (365.25 * 24 * 3600 * 1000)
      const currentDeclination = baseDeclination + (precessionRate * yearsSinceJ2000)
      const deviation = 90.0 - currentDeclination
      
      return {
        distance_ly: currentDistance,
        distance_change_per_second_ly: changePerSecond,
        distance_change_per_day_ly: changePerSecond * 86400,
        north_pole_deviation: deviation
      }
    }

    // Initial calculation
    const initialData = calculateCurrentDistance()
    setDistance(initialData)
    setNorthPoleDeviation(initialData.north_pole_deviation)
    setLastUpdate(new Date())
    setLoading(false)

    // Update every 3 seconds (optimized for performance)
    const interval = setInterval(() => {
      const updatedData = calculateCurrentDistance()
      setDistance(updatedData)
      setNorthPoleDeviation(updatedData.north_pole_deviation)
      setLastUpdate(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!distance) return null

  return (
    <div className="mt-6">
      <div className="glass-effect rounded-2xl px-8 py-6 max-w-2xl mx-auto border border-purple-500/30 shadow-lg shadow-purple-500/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-sm text-gray-400 uppercase tracking-wider">Live Distance</span>
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-3xl md:text-4xl font-mono font-bold">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                {distance.distance_ly.toFixed(12)}
              </span>
              <span className="text-xl text-gray-400 ml-2">ly</span>
            </div>
            {distance.distance_change_per_day_ly && (
              <div className="text-xs text-gray-500 mt-1">
                <span className="text-green-400">+</span>
                {(distance.distance_change_per_day_ly * 1000000).toFixed(6)} × 10⁻⁶ ly/day
              </div>
            )}
          </div>
        </div>
        
        {northPoleDeviation !== null && (
          <div className="mt-4 pt-4 border-t border-gray-700/50 text-center">
            <p className="text-xs text-gray-400">
              <span className="text-gray-500">Angular deviation from North Pole:</span>{' '}
              <span className="text-purple-300 font-mono font-semibold">
                {northPoleDeviation.toFixed(7)}°
              </span>
            </p>
          </div>
        )}
        
        {lastUpdate && (
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()} UTC
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

