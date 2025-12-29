import { useState, useEffect } from 'react'
import StarBackground from '../components/StarBackground'
import MeasurementConverter from '../components/MeasurementConverter'

export default function Calculators() {
  const [activeTab, setActiveTab] = useState('space')
  // Distance Converter
  const [distance, setDistance] = useState('')
  const [unit, setUnit] = useState('ly')
  const [result, setResult] = useState(null)

  // Travel Time Calculator
  const [velocity, setVelocity] = useState('')
  const [time, setTime] = useState('')
  const [velocityResult, setVelocityResult] = useState(null)

  // Time Dilation Calculator
  const [timeDilation, setTimeDilation] = useState('')
  const [dilationResult, setDilationResult] = useState(null)

  // Preset values for quick access
  const distancePresets = [
    { name: 'Polaris', value: 446.5, unit: 'ly', desc: 'North Star' },
    { name: 'Sirius', value: 8.66, unit: 'ly', desc: 'Brightest star' },
    { name: 'Alpha Centauri', value: 4.37, unit: 'ly', desc: 'Nearest star system' },
    { name: 'Vega', value: 25.04, unit: 'ly', desc: 'Summer Triangle star' },
    { name: 'Sun', value: 1, unit: 'au', desc: 'Our star' },
    { name: 'Proxima Centauri', value: 4.24, unit: 'ly', desc: 'Nearest star' }
  ]

  const velocityPresets = [
    { name: 'Walking Speed', value: 0.001, desc: '5 km/h' },
    { name: 'Car Speed', value: 0.03, desc: '100 km/h' },
    { name: 'Jet Plane', value: 0.25, desc: '900 km/h' },
    { name: 'Space Shuttle', value: 7.8, desc: 'Orbital velocity' },
    { name: 'Voyager 1', value: 17, desc: 'Fastest spacecraft' },
    { name: '10% Light Speed', value: 29979.2, desc: '0.1c' },
    { name: '50% Light Speed', value: 149896, desc: '0.5c' },
    { name: '90% Light Speed', value: 269813, desc: '0.9c' }
  ]

  const timePresets = [
    { name: '1 year', value: 1 },
    { name: '5 years', value: 5 },
    { name: '10 years', value: 10 },
    { name: '25 years', value: 25 },
    { name: '50 years', value: 50 },
    { name: '100 years', value: 100 }
  ]

  const dilationPresets = [
    { name: '10% light speed', value: 29979.2 },
    { name: '25% light speed', value: 74948.1 },
    { name: '50% light speed', value: 149896 },
    { name: '75% light speed', value: 224844 },
    { name: '90% light speed', value: 269813 },
    { name: '99% light speed', value: 296794 }
  ]

  // Auto-calculate distance converter on change
  useEffect(() => {
    if (distance && !isNaN(parseFloat(distance))) {
      convertDistance()
    } else {
      setResult(null)
    }
  }, [distance, unit])

  // Auto-calc travel when both fields are valid
  useEffect(() => {
    const v = parseFloat(velocity)
    const t = parseFloat(time)
    if (!isNaN(v) && v >= 0 && !isNaN(t) && t >= 0 && velocity !== '' && time !== '') {
      calculateTravelTime()
    } else {
      setVelocityResult(null)
    }
  }, [velocity, time])

  // Auto-calc time dilation when valid
  useEffect(() => {
    const v = parseFloat(timeDilation)
    if (!isNaN(v) && v >= 0 && timeDilation !== '') {
      calculateTimeDilation()
    } else {
      setDilationResult(null)
    }
  }, [timeDilation])

  const convertDistance = () => {
    const dist = parseFloat(distance)
    if (isNaN(dist) || dist < 0) {
      setResult(null)
      return
    }

    const lyToKm = 9.4607304725808e12
    const lyToAu = 63241.077
    const lyToPc = 0.306601

    let ly = dist
    if (unit === 'km') ly = dist / lyToKm
    else if (unit === 'au') ly = dist / lyToAu
    else if (unit === 'pc') ly = dist / lyToPc

    setResult({
      ly: ly.toFixed(6),
      km: (ly * lyToKm).toFixed(2),
      au: (ly * lyToAu).toFixed(2),
      pc: (ly * lyToPc).toFixed(6)
    })
  }

  const calculateTravelTime = () => {
    const v = parseFloat(velocity)
    const t = parseFloat(time)
    if (isNaN(v) || isNaN(t) || v < 0 || t < 0) {
      setVelocityResult(null)
      return
    }

    // Distance = velocity * time
    const distanceKm = v * t * 365.25 * 24 * 3600 // km if time in years
    const distanceLy = distanceKm / 9.4607304725808e12

    setVelocityResult({
      distance_km: distanceKm.toFixed(2),
      distance_ly: distanceLy.toFixed(6),
      years: t,
      velocity: v
    })
  }

  const calculateTimeDilation = () => {
    const v = parseFloat(timeDilation) // velocity in km/s
    if (isNaN(v) || v < 0) {
      setDilationResult(null)
      return
    }

    const c = 299792.458 // speed of light in km/s
    const beta = v / c
    const gamma = 1 / Math.sqrt(1 - beta * beta)

    if (beta >= 1) {
      setDilationResult({ error: 'Velocity cannot exceed speed of light (299,792.458 km/s)' })
      return
    }

    setDilationResult({
      gamma: gamma.toFixed(6),
      time_dilation_factor: (gamma - 1).toFixed(6),
      velocity_fraction: (beta * 100).toFixed(4)
    })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const formatNumber = (num) => {
    if (num >= 1e12) return parseFloat(num).toExponential(2)
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return parseFloat(num).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-space-dark relative overflow-hidden">
      <StarBackground />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-gradient">
              🧮 Space Calculators
            </h1>
            <p className="text-xl text-purple-300 mb-2">
              Easy-to-Use Astronomical Tools
            </p>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto mb-6">
              Convert distances, calculate travel times, and explore relativistic effects with real-time calculations
            </p>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => setActiveTab('space')}
                className={`px-6 py-3 rounded-full transition-all font-semibold relative z-10 cursor-pointer ${
                  activeTab === 'space'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'glass-effect text-gray-300 hover:text-white border border-white/10 hover:border-purple-500/30'
                }`}
              >
                🚀 Space Calculators
              </button>
              <button
                onClick={() => setActiveTab('measurement')}
                className={`px-6 py-3 rounded-full transition-all font-semibold relative z-10 cursor-pointer ${
                  activeTab === 'measurement'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'glass-effect text-gray-300 hover:text-white border border-white/10 hover:border-purple-500/30'
                }`}
              >
                📐 Unit Converter
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Space Calculators Tab */}
            {activeTab === 'space' && (
              <>
            {/* Distance Converter */}
            <div className="glass-effect rounded-2xl p-6 md:p-8 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">📏</div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gradient">Distance Converter</h2>
                  <p className="text-sm text-gray-400">Convert between light years, kilometers, AU, and parsecs</p>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Quick Presets:</p>
                <div className="flex flex-wrap gap-2">
                  {distancePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDistance(preset.value.toString())
                        setUnit(preset.unit)
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg glass-effect hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all"
                      title={preset.desc}
                    >
                      {preset.name} ({preset.value} {preset.unit})
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-purple-300 mb-2 text-sm font-semibold">
                    Distance Value
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="Enter distance..."
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 text-sm font-semibold">
                    From Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ly">Light Years (ly)</option>
                    <option value="km">Kilometers (km)</option>
                    <option value="au">Astronomical Units (AU)</option>
                    <option value="pc">Parsecs (pc)</option>
                  </select>
                </div>
              </div>

              {result && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Converted Results:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group" onClick={() => copyToClipboard(result.ly)}>
                      <div className="text-gray-400 text-xs mb-1">Light Years</div>
                      <div className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{result.ly}</div>
                      <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group" onClick={() => copyToClipboard(result.km)}>
                      <div className="text-gray-400 text-xs mb-1">Kilometers</div>
                      <div className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{parseFloat(result.km).toExponential(2)}</div>
                      <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group" onClick={() => copyToClipboard(result.au)}>
                      <div className="text-gray-400 text-xs mb-1">AU</div>
                      <div className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{result.au}</div>
                      <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group" onClick={() => copyToClipboard(result.pc)}>
                      <div className="text-gray-400 text-xs mb-1">Parsecs</div>
                      <div className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{result.pc}</div>
                      <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Travel Time Calculator */}
            <div className="glass-effect rounded-2xl p-6 md:p-8 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🚀</div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gradient">Travel Time Calculator</h2>
                  <p className="text-sm text-gray-400">Calculate how far you'd travel at a constant velocity</p>
                </div>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Velocity Presets:</p>
                  <div className="flex flex-wrap gap-2">
                    {velocityPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setVelocity(preset.value.toString())}
                        className="px-3 py-1.5 text-xs rounded-lg glass-effect hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all"
                        title={preset.desc}
                      >
                        {preset.name} ({preset.value} km/s)
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Time Presets:</p>
                  <div className="flex flex-wrap gap-2">
                    {timePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTime(preset.value.toString())}
                        className="px-3 py-1.5 text-xs rounded-lg glass-effect hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-purple-300 mb-2 text-sm font-semibold">
                    Velocity (km/s)
                  </label>
                  <input
                    type="number"
                    value={velocity}
                    onChange={(e) => setVelocity(e.target.value)}
                    placeholder="e.g., 17 (Voyager 1 speed)"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Speed of light: 299,792.458 km/s</p>
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 text-sm font-semibold">
                    Travel Time (years)
                  </label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Time in years</p>
                </div>
              </div>
              <button
                onClick={calculateTravelTime}
                disabled={!velocity || !time}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Calculate Distance
              </button>
              {velocityResult && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                  <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Travel Results:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer" onClick={() => copyToClipboard(velocityResult.distance_ly)}>
                      <div className="text-gray-400 text-xs mb-1">Distance Traveled</div>
                      <div className="text-2xl font-bold text-white">{velocityResult.distance_ly} ly</div>
                      <div className="text-xs text-gray-500 mt-1">{parseFloat(velocityResult.distance_km).toExponential(2)} km</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer" onClick={() => copyToClipboard(velocityResult.velocity.toString())}>
                      <div className="text-gray-400 text-xs mb-1">At Velocity</div>
                      <div className="text-xl font-bold text-white">{velocityResult.velocity} km/s</div>
                      <div className="text-xs text-gray-500 mt-1">{((velocityResult.velocity / 299792.458) * 100).toFixed(4)}% of light speed</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer" onClick={() => copyToClipboard(velocityResult.years.toString())}>
                      <div className="text-gray-400 text-xs mb-1">Time Elapsed</div>
                      <div className="text-2xl font-bold text-white">{velocityResult.years} years</div>
                      <div className="text-xs text-gray-500 mt-1">Constant velocity</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Dilation Calculator */}
            <div className="glass-effect rounded-2xl p-6 md:p-8 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">⏱️</div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gradient">Time Dilation Calculator</h2>
                  <p className="text-sm text-gray-400">Calculate relativistic time dilation effects (Einstein's theory)</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Velocity Presets:</p>
                <div className="flex flex-wrap gap-2">
                  {dilationPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTimeDilation(preset.value.toString())}
                      className="px-3 py-1.5 text-xs rounded-lg glass-effect hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-purple-300 mb-2 text-sm font-semibold">
                  Velocity (km/s)
                </label>
                <input
                  type="number"
                  value={timeDilation}
                  onChange={(e) => setTimeDilation(e.target.value)}
                  placeholder="e.g., 149896 (50% light speed)"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Enter velocity in km/s (max: 299,792.458 km/s = speed of light)</p>
              </div>
              <button
                onClick={calculateTimeDilation}
                disabled={!timeDilation}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Calculate Time Dilation
              </button>
              {dilationResult && (
                <div className="mt-6">
                  {dilationResult.error ? (
                    <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30 text-red-400">
                      ⚠️ {dilationResult.error}
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                      <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Relativistic Effects:</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer" onClick={() => copyToClipboard(dilationResult.gamma)}>
                          <div className="text-gray-400 text-xs mb-1">Gamma Factor (γ)</div>
                          <div className="text-2xl font-bold text-white">{dilationResult.gamma}</div>
                          <div className="text-xs text-gray-500 mt-1">Lorentz factor</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer" onClick={() => copyToClipboard((parseFloat(dilationResult.time_dilation_factor) * 100).toFixed(4) + '%')}>
                          <div className="text-gray-400 text-xs mb-1">Time Dilation</div>
                          <div className="text-2xl font-bold text-white">{(parseFloat(dilationResult.time_dilation_factor) * 100).toFixed(4)}%</div>
                          <div className="text-xs text-gray-500 mt-1">Time slows by this amount</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer" onClick={() => copyToClipboard(dilationResult.velocity_fraction + '%')}>
                          <div className="text-gray-400 text-xs mb-1">% of Light Speed</div>
                          <div className="text-2xl font-bold text-white">{dilationResult.velocity_fraction}%</div>
                          <div className="text-xs text-gray-500 mt-1">Fraction of c</div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <p className="text-xs text-yellow-300">
                          💡 <strong>Note:</strong> At {dilationResult.velocity_fraction}% of light speed, time passes {dilationResult.gamma}x slower for the moving object compared to a stationary observer.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
              </>
            )}

            {/* Measurement Converter Tab */}
            {activeTab === 'measurement' && (
              <MeasurementConverter />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
