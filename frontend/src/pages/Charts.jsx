import { useState, useEffect } from 'react'
import DistanceChart from '../components/DistanceChart'
import StarBackground from '../components/StarBackground'
import StatsCard from '../components/StatsCard'
import LiveDistanceCounter from '../components/LiveDistanceCounter'
import FuturePathChart from '../components/FuturePathChart'

export default function Charts() {
  const [data100, setData100] = useState(null)
  const [data10, setData10] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('100years')

  useEffect(() => {
    Promise.all([
      fetch('/polaris_100years.json').then(res => res.json()),
      fetch('/polaris_10years.json').then(res => res.json())
    ])
      .then(([data100, data10]) => {
        setData100(data100)
        setData10(data10)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-space-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Polaris Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-dark relative overflow-hidden">
      <StarBackground />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 mt-8">
            <div className="relative inline-block mb-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-[0.2em] mb-2 relative z-10">
                <span className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-pulse hover:scale-110 transition-transform duration-300">
                  P
                </span>
                <span className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
                  O
                </span>
                <span className="inline-block bg-gradient-to-r from-pink-500 via-orange-500 to-purple-500 bg-clip-text text-transparent animate-pulse hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
                  L
                </span>
                <span className="inline-block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
                  A
                </span>
                <span className="inline-block bg-gradient-to-r from-purple-500 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.4s' }}>
                  R
                </span>
                <span className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
                  I
                </span>
                <span className="inline-block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.6s' }}>
                  S
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-purple-300 mb-4 font-light">
              Distance Tracker
            </p>
            
            <LiveDistanceCounter />
            
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mt-6">
              High-Precision Astronomical Distance Calculation System
              <br />
              <span className="text-xs">Tracking Polaris from 2025 AD to 3200 BC</span>
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <FuturePathChart />
          </div>

          {data100 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <StatsCard
                title="Current Distance"
                value={`${data100.star.current_distance_ly.toFixed(3)} ly`}
                subtitle="Reference Point"
                gradient="from-blue-500 to-cyan-500"
              />
              <StatsCard
                title="Radial Velocity"
                value={`${data100.star.radial_velocity_km_s} km/s`}
                subtitle="Moving away from Earth"
                gradient="from-purple-500 to-pink-500"
              />
              <StatsCard
                title="Time Span"
                value={`${data100.time_span.total_years.toLocaleString()} years`}
                subtitle="2025 AD to 3200 BC"
                gradient="from-orange-500 to-red-500"
              />
              <StatsCard
                title="Distance Range"
                value={`${data100.statistics.distance_range_ly.toFixed(6)} ly`}
                subtitle="Total change"
                gradient="from-green-500 to-emerald-500"
              />
            </div>
          )}

          <div className="flex justify-center mb-8 gap-4">
            <button
              onClick={() => setActiveTab('100years')}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                activeTab === '100years'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'glass-effect text-gray-300 hover:text-white'
              }`}
            >
              100-Year Intervals
            </button>
            <button
              onClick={() => setActiveTab('10years')}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                activeTab === '10years'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'glass-effect text-gray-300 hover:text-white'
              }`}
            >
              10-Year Intervals
            </button>
          </div>

          <div className="space-y-8">
            {activeTab === '100years' && data100 && (
              <DistanceChart data={data100} title="100-Year Intervals" />
            )}
            {activeTab === '10years' && data10 && (
              <DistanceChart data={data10} title="10-Year Intervals" />
            )}
          </div>

          {data100 && (
            <div className="mt-12 glass-effect rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gradient">Standard Compliance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-300">Reference Frame</h3>
                  <p className="text-gray-300">{data100.metadata.reference_frame}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-300">Epoch</h3>
                  <p className="text-gray-300">{data100.metadata.epoch}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-300">Precision</h3>
                  <p className="text-gray-300">Up to 10^{data100.metadata.precision_max} decimal places</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-300">Data Source</h3>
                  <p className="text-gray-300">Hipparcos/GAIA EDR3 / SIMBAD</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}


