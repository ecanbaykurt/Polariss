import { useState, useEffect, useRef } from 'react'
import StarBackground from '../components/StarBackground'
import StarsDistanceChart from '../components/StarsDistanceChart'
import MagnitudeChart from '../components/MagnitudeChart'
import SpectralTypeChart from '../components/SpectralTypeChart'
import InfoTooltip from '../components/InfoTooltip'
import SimpleModeToggle from '../components/SimpleModeToggle'
import NearestStarsLive from '../components/NearestStarsLive'
import SolarSystemCarousel from '../components/SolarSystemCarousel'
import AISearch from '../components/AISearch'
import ResearchHub from '../components/ResearchHub'
import AnimatedPlaceholder from '../components/AnimatedPlaceholder'
import DistanceChart from '../components/DistanceChart'
import StatsCard from '../components/StatsCard'
import LiveDistanceCounter from '../components/LiveDistanceCounter'
import FuturePathChart from '../components/FuturePathChart'
import SolarSystemStats from '../components/SolarSystemStats'

export default function Data() {
  const [stars, setStars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('distance') // distance, name, magnitude
  const [selectedStar, setSelectedStar] = useState(null)
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [simpleMode, setSimpleMode] = useState(true)
  const [activeTab, setActiveTab] = useState('polaris') // 'stars', 'research', 'polaris'
  const [polarisTab, setPolarisTab] = useState('100years') // '100years', '10years'
  const [polarisData100, setPolarisData100] = useState(null)
  const [polarisData10, setPolarisData10] = useState(null)
  const [polarisLoading, setPolarisLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('polaris_welcome_shown')
  })
  const [searchFocused, setSearchFocused] = useState(false)
  const searchInputRef = useRef(null)
  const tabContentRef = useRef(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/popular-stars')
      .then(res => res.json())
      .then(data => {
        setStars(data.stars || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading stars:', err)
        setLoading(false)
      })
  }, [])

  // Load Polaris data when tab is active
  useEffect(() => {
    if (activeTab === 'polaris' && !polarisData100) {
      setPolarisLoading(true)
      Promise.all([
        fetch('/polaris_100years.json').then(res => res.json()),
        fetch('/polaris_10years.json').then(res => res.json())
      ])
        .then(([data100, data10]) => {
          setPolarisData100(data100)
          setPolarisData10(data10)
          setPolarisLoading(false)
        })
        .catch(err => {
          console.error('Error loading Polaris data:', err)
          setPolarisLoading(false)
        })
    }
  }, [activeTab, polarisData100])

  const filteredStars = stars
    .filter(star => {
      // If a star is selected from sidebar or dropdown, only show that star
      if (selectedStar && selectedStar.name !== star.name) {
        return false
      }
      // If search term exists, filter by search term
      if (searchTerm) {
        return star.name.toLowerCase().includes(searchTerm.toLowerCase())
      }
      // Otherwise, show all stars
      return true
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'distance':
          return a.distance_ly - b.distance_ly
        case 'magnitude':
          return a.magnitude - b.magnitude
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const getSpectralColor = (spectralType) => {
    if (!spectralType) return 'text-gray-400'
    const type = spectralType[0]
    const colors = {
      'O': 'text-blue-400',
      'B': 'text-blue-300',
      'A': 'text-white',
      'F': 'text-yellow-100',
      'G': 'text-yellow-300',
      'K': 'text-orange-400',
      'M': 'text-red-500'
    }
    return colors[type] || 'text-gray-400'
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-space-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading star data...</p>
          <p className="text-gray-400 text-sm mt-2">🌟 Please wait</p>
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
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-gradient star-title-3d">
              Famous Stars in the Night Sky
            </h1>
            <p className="text-sm text-gray-400 mb-8 max-w-2xl mx-auto">
              Click on stars to access detailed information. 
              Click on question marks to see explanations of terms.
            </p>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleTabChange('stars')
                }}
                className={`px-6 py-3 rounded-full transition-all font-semibold relative z-10 cursor-pointer ${
                  activeTab === 'stars'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'glass-effect text-gray-300 hover:text-white border border-white/10 hover:border-purple-500/30'
                }`}
              >
                ⭐ Stars & AI Search
              </button>
              <button
                onClick={() => handleTabChange('research')}
                className={`px-6 py-2 rounded-full transition-all font-semibold ${
                  activeTab === 'research'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'glass-effect text-gray-300 hover:text-white'
                }`}
              >
                📚 Research Hub
              </button>
              <button
                onClick={() => handleTabChange('polaris')}
                className={`px-6 py-2 rounded-full transition-all font-semibold ${
                  activeTab === 'polaris'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'glass-effect text-gray-300 hover:text-white'
                }`}
              >
                ⭐ Polaris
              </button>
            </div>

            {/* Simple Mode Toggle - Only show for stars tab */}
            {activeTab === 'stars' && (
              <div className="flex justify-center mb-6">
                <SimpleModeToggle 
                  simpleMode={simpleMode} 
                  onToggle={() => setSimpleMode(!simpleMode)} 
                />
              </div>
            )}

            {/* Star Search - Only show on stars tab */}
            {activeTab === 'stars' && (
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value
                      setSearchTerm(value)
                      // If search term changes and doesn't match selected star, clear selection
                      if (selectedStar && value !== selectedStar.name) {
                        setSelectedStar(null)
                      }
                      // If search matches a star exactly, select it
                      if (value) {
                        const matchingStar = stars.find(s => s.name.toLowerCase() === value.toLowerCase())
                        if (matchingStar) {
                          setSelectedStar(matchingStar)
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const value = searchTerm.trim()
                        if (value) {
                          // Try to find exact match first
                          let matchingStar = stars.find(s => s.name.toLowerCase() === value.toLowerCase())
                          
                          // If no exact match, find first partial match
                          if (!matchingStar) {
                            matchingStar = stars.find(s => 
                              s.name.toLowerCase().includes(value.toLowerCase())
                            )
                          }
                          
                          if (matchingStar) {
                            setSelectedStar(matchingStar)
                            setSearchTerm(matchingStar.name)
                            // Scroll to the selected star card if visible
                            setTimeout(() => {
                              const starElement = document.querySelector(`[data-star-name="${matchingStar.name}"]`)
                              if (starElement) {
                                starElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              }
                            }, 100)
                          }
                        }
                      }
                    }}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder={searchFocused || searchTerm ? "🔍 Search for stars, planets, galaxies..." : ""}
                    className="w-full px-6 py-4 pr-12 rounded-full glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg relative z-10"
                  />
                  {!searchFocused && !searchTerm && (
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                      <AnimatedPlaceholder isFocused={searchFocused} searchTerm={searchTerm} />
                    </div>
                  )}
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedStar(null)
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xl z-20"
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Tab Content */}
          <div ref={tabContentRef}>
          {/* Solar System Carousel - Show on stars tab */}
          {activeTab === 'stars' && (
            <>
              <div className="mb-12">
                <SolarSystemCarousel 
                  onPlanetSelect={(planet) => {
                    setSelectedPlanet(planet)
                    setSelectedStar(null)
                    setSearchTerm('')
                  }}
                  selectedPlanetName={selectedPlanet?.name}
                />
              </div>

              {/* AI Search - Show on stars tab */}
              <div className="mb-12">
                <AISearch selectedStar={selectedStar} selectedPlanet={selectedPlanet} />
              </div>
            </>
          )}

          {activeTab === 'research' && (
            <div className="mb-12">
              <ResearchHub />
            </div>
          )}

          {activeTab === 'polaris' && (
            <div className="mb-12">
              {polarisLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-white text-xl">Loading Polaris Data...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-12">
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

                  {polarisData100 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                      <StatsCard
                        title="Current Distance"
                        value={`${polarisData100.star.current_distance_ly.toFixed(3)} ly`}
                        subtitle="Reference Point"
                        gradient="from-blue-500 to-cyan-500"
                      />
                      <StatsCard
                        title="Radial Velocity"
                        value={`${polarisData100.star.radial_velocity_km_s} km/s`}
                        subtitle="Moving away from Earth"
                        gradient="from-purple-500 to-pink-500"
                      />
                      <StatsCard
                        title="Time Span"
                        value={`${polarisData100.time_span.total_years.toLocaleString()} years`}
                        subtitle="2025 AD to 3200 BC"
                        gradient="from-orange-500 to-red-500"
                      />
                      <StatsCard
                        title="Distance Range"
                        value={`${polarisData100.statistics.distance_range_ly.toFixed(6)} ly`}
                        subtitle="Total change"
                        gradient="from-green-500 to-emerald-500"
                      />
                    </div>
                  )}

                  <div className="flex justify-center mb-8 gap-4">
                    <button
                      onClick={() => setPolarisTab('100years')}
                      className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                        polarisTab === '100years'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                          : 'glass-effect text-gray-300 hover:text-white'
                      }`}
                    >
                      100-Year Intervals
                    </button>
                    <button
                      onClick={() => setPolarisTab('10years')}
                      className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                        polarisTab === '10years'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                          : 'glass-effect text-gray-300 hover:text-white'
                      }`}
                    >
                      10-Year Intervals
                    </button>
                  </div>

                  <div className="space-y-8">
                    {polarisTab === '100years' && polarisData100 && (
                      <DistanceChart data={polarisData100} title="100-Year Intervals" />
                    )}
                    {polarisTab === '10years' && polarisData10 && (
                      <DistanceChart data={polarisData10} title="10-Year Intervals" />
                    )}
                  </div>

                  {polarisData100 && (
                    <div className="mt-12 glass-effect rounded-2xl p-8">
                      <h2 className="text-3xl font-bold mb-6 text-gradient">Standard Compliance</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-purple-300">Reference Frame</h3>
                          <p className="text-gray-300">{polarisData100.metadata.reference_frame}</p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-purple-300">Epoch</h3>
                          <p className="text-gray-300">{polarisData100.metadata.epoch}</p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-purple-300">Precision</h3>
                          <p className="text-gray-300">Up to 10^{polarisData100.metadata.precision_max} decimal places</p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-purple-300">Data Source</h3>
                          <p className="text-gray-300">Hipparcos/GAIA EDR3 / SIMBAD</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Solar System Statistics - Show on stars tab */}
          {activeTab === 'stars' && (
            <div className="mb-12">
              <SolarSystemStats />
            </div>
          )}

          {/* 20 Stars List Section - Only show on stars tab */}
          {activeTab === 'stars' && stars.length > 0 && (
            <div className="mb-12">
              <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-gradient mb-4 text-center">
                  ⭐ The 20 Most Famous Stars
                </h2>
                <p className="text-center text-gray-400 text-sm mb-6">
                  All stars with their real distances from Earth
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {stars
                    .sort((a, b) => a.distance_ly - b.distance_ly)
                    .map((star, index) => (
                      <div
                        key={star.name}
                        data-star-name={star.name}
                        className="glass-effect rounded-lg p-3 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-purple-500/30 cursor-pointer"
                        onClick={() => setSelectedStar(star)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-purple-300">#{index + 1}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${getSpectralColor(star.spectral_type)}`}>
                            {star.spectral_type}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{star.name}</h3>
                        <div className="text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Distance:</span>
                            <span className="text-white font-semibold">{star.distance_ly.toFixed(2)} ly</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-400">Magnitude:</span>
                            <span className="text-white font-semibold">{star.magnitude.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Nearest 10 Stars Live Section - Only show on stars tab */}
          {activeTab === 'stars' && stars.length > 0 && (
            <div className="mb-12">
              <NearestStarsLive stars={stars} simpleMode={simpleMode} />
            </div>
          )}

          {/* Star Cards Grid - Only show on stars tab */}
          {activeTab === 'stars' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredStars.map((star, index) => (
              <div
                key={index}
                data-star-name={star.name}
                onClick={() => setSelectedStar(star)}
                className="glass-effect rounded-2xl p-5 md:p-6 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 group border-2 border-transparent hover:border-purple-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-gradient transition-colors">
                    {star.name}
                  </h3>
                  <span className={`text-xs md:text-sm px-2 py-1 rounded-full bg-white/10 ${getSpectralColor(star.spectral_type)} font-semibold`}>
                    {star.spectral_type}
                  </span>
                </div>
                
                <div className="space-y-3 text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 flex items-center">
                      {simpleMode ? '📏 Distance from Earth:' : 'Distance:'}
                      <InfoTooltip term="Distance" simple={simpleMode} />
                    </span>
                    <span className="text-white font-bold text-lg">{star.distance_ly.toFixed(2)} light years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 flex items-center">
                      {simpleMode ? '✨ Brightness:' : 'Apparent Magnitude:'}
                      <InfoTooltip term="Magnitude" simple={simpleMode} />
                    </span>
                    <span className="text-white font-semibold">{star.magnitude.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 flex items-center">
                      {simpleMode ? '🚀 Movement Speed:' : 'Radial Velocity:'}
                      <InfoTooltip term="Velocity" simple={simpleMode} />
                    </span>
                    <span className={`font-semibold ${star.movement_direction === 'away' ? 'text-red-400' : 'text-green-400'}`}>
                      {star.movement_direction === 'away' ? '→' : '←'} {Math.abs(star.radial_velocity_km_s).toFixed(2)} km/s
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${getSpectralColor(star.spectral_type)} bg-opacity-20`}>
                        {star.spectral_type}
                      </span>
                      {!simpleMode && (
                        <span className="text-xs text-gray-400">{star.catalog_id}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-xs text-purple-400 font-semibold">Click for details 👆</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {/* Charts Section - Only show on stars tab */}
          {activeTab === 'stars' && stars.length > 0 && (
            <div className="mt-12 space-y-8">
              <div className="glass-effect rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gradient mb-2 text-center">
                  📊 Visualizations
                </h2>
                <p className="text-center text-gray-400 text-sm">
                  Explore star distances, brightness, and types in charts
                </p>
              </div>
              <StarsDistanceChart stars={filteredStars} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MagnitudeChart stars={filteredStars} />
                <SpectralTypeChart stars={filteredStars} />
              </div>
            </div>
          )}

          {/* Welcome Modal */}
          {showWelcome && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="glass-effect rounded-2xl p-8 max-w-lg w-full">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🌟</div>
                  <h2 className="text-3xl font-bold text-gradient mb-4">Welcome!</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    On this page you can find information about the 20 most famous stars in the night sky.
                  </p>
                </div>
                <div className="space-y-4 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔍</span>
                    <div>
                      <div className="font-semibold text-white mb-1">Search</div>
                      <div className="text-sm text-gray-400">You can search by typing the star name</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📏</span>
                    <div>
                      <div className="font-semibold text-white mb-1">Sorting</div>
                      <div className="text-sm text-gray-400">You can sort by distance, brightness, or name</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <div>
                      <div className="font-semibold text-white mb-1">Help</div>
                      <div className="text-sm text-gray-400">Click on question marks to see explanations of terms</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <div className="font-semibold text-white mb-1">Simple/Detailed Mode</div>
                      <div className="text-sm text-gray-400">You can choose simple or detailed view with the button above</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowWelcome(false)
                    localStorage.setItem('polaris_welcome_shown', 'true')
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Let's Start! 🚀
                </button>
              </div>
            </div>
          )}

          {selectedStar && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStar(null)}>
              <div className="glass-effect rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-2">{selectedStar.name}</h2>
                    <p className="text-sm text-gray-400">
                      Star Details
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStar(null)}
                    className="text-gray-400 hover:text-white text-3xl md:text-4xl font-bold leading-none transition-transform hover:scale-110"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      {simpleMode ? '📋 Basic Information' : 'Basic Information'}
                    </h3>
                    <div className="space-y-3 text-sm">
                      {!simpleMode && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Catalog ID:</span>
                          <span className="text-white">{selectedStar.catalog_id}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center">
                          {simpleMode ? '🌈 Star Color/Type:' : 'Spectral Type:'}
                          <InfoTooltip term="Spectral Type" simple={simpleMode} />
                        </span>
                        <span className={`font-semibold text-lg ${getSpectralColor(selectedStar.spectral_type)}`}>
                          {selectedStar.spectral_type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center">
                          {simpleMode ? '✨ Apparent Brightness:' : 'Apparent Magnitude:'}
                          <InfoTooltip term="Magnitude" simple={simpleMode} />
                        </span>
                        <span className="text-white font-semibold">{selectedStar.magnitude.toFixed(2)}</span>
                      </div>
                      {simpleMode && (
                        <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <p className="text-xs text-gray-300">
                            💡 <strong>Tip:</strong> The smaller the brightness value, the brighter the star appears in the sky!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      {simpleMode ? '📏 Distance' : 'Distance'}
                      <InfoTooltip term="Distance" simple={simpleMode} />
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <span className="text-gray-300 flex items-center gap-1">
                          🌟 {simpleMode ? 'Light Years:' : 'Light Years:'}
                          {!simpleMode && <InfoTooltip term="Light Year" simple={simpleMode} />}
                        </span>
                        <span className="text-white font-bold text-lg">{selectedStar.distance_ly.toFixed(2)} ly</span>
                      </div>
                      {!simpleMode && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center gap-1">
                              Kilometers:
                              <InfoTooltip term="Light Year" simple={simpleMode} />
                            </span>
                            <span className="text-white">{(selectedStar.distance_km / 1e12).toFixed(4)} × 10¹² km</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 flex items-center gap-1">
                              Parsecs:
                              <InfoTooltip term="Parsec" simple={simpleMode} />
                            </span>
                            <span className="text-white">{selectedStar.distance_parsec.toFixed(4)} pc</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 flex items-center gap-1">
                              AU:
                              <InfoTooltip term="AU" simple={simpleMode} />
                            </span>
                            <span className="text-white">{(selectedStar.distance_au / 1e3).toFixed(2)} × 10³ AU</span>
                          </div>
                        </>
                      )}
                      {simpleMode && (
                        <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <p className="text-xs text-gray-300">
                            💡 <strong>Interesting:</strong> Light from {selectedStar.name} left {selectedStar.distance_ly.toFixed(0)} years ago! 
                            What you see now is its past appearance.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      {simpleMode ? '🚀 Motion' : 'Motion'}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <span className="text-gray-300 flex items-center gap-1">
                          {selectedStar.movement_direction === 'away' ? '🔴' : '🟢'} {simpleMode ? 'Speed:' : 'Radial Velocity:'}
                          {!simpleMode && <InfoTooltip term="Radial Velocity" simple={simpleMode} />}
                        </span>
                        <span className={`font-bold text-lg ${selectedStar.movement_direction === 'away' ? 'text-red-400' : 'text-green-400'}`}>
                          {selectedStar.radial_velocity_km_s.toFixed(2)} km/s
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">{simpleMode ? 'Direction:' : 'Direction:'}</span>
                        <span className={`font-semibold ${selectedStar.movement_direction === 'away' ? 'text-red-400' : 'text-green-400'}`}>
                          {selectedStar.movement_direction === 'away' 
                            ? (simpleMode ? '🔴 Moving Away from Earth' : 'Moving Away')
                            : (simpleMode ? '🟢 Moving Toward Earth' : 'Moving Toward')}
                        </span>
                      </div>
                      {!simpleMode && selectedStar.proper_motion_ra_mas_yr && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 flex items-center gap-1">
                              PM RA:
                              <InfoTooltip term="Proper Motion" simple={simpleMode} />
                            </span>
                            <span className="text-white">{selectedStar.proper_motion_ra_mas_yr.toFixed(2)} mas/yr</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">PM Dec:</span>
                            <span className="text-white">{selectedStar.proper_motion_dec_mas_yr.toFixed(2)} mas/yr</span>
                          </div>
                        </>
                      )}
                      {simpleMode && (
                        <div className="mt-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                          <p className="text-xs text-gray-300">
                            💡 <strong>Note:</strong> Stars are not fixed! They are all moving in space.
                            {selectedStar.movement_direction === 'away' 
                              ? ' This star is moving away from us.'
                              : ' This star is moving toward us.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3">
                      {simpleMode ? '📍 Position in Sky' : 'Coordinates'}
                    </h3>
                    <div className="space-y-3 text-sm">
                      {!simpleMode && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">RA (hours):</span>
                            <span className="text-white">{selectedStar.ra_hours?.toFixed(6) || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Dec (degrees):</span>
                            <span className="text-white">{selectedStar.dec_degrees?.toFixed(6) || 'N/A'}</span>
                          </div>
                        </>
                      )}
                      {simpleMode && selectedStar.ra_hours && (
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <p className="text-xs text-gray-300">
                            📍 To find this star in the sky, you can use a telescope or a star map application.
                            Coordinates: RA {selectedStar.ra_hours?.toFixed(2)}h, Dec {selectedStar.dec_degrees?.toFixed(2)}°
                          </p>
                        </div>
                      )}
                      {selectedStar.distance_ly_uncertainty && (
                        <div className="flex justify-between items-center bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                          <span className="text-gray-300">
                            {simpleMode ? '⚠️ Measurement Uncertainty:' : 'Uncertainty:'}
                          </span>
                          <span className="text-yellow-400 font-semibold">±{selectedStar.distance_ly_uncertainty} light years</span>
                        </div>
                      )}
                      {simpleMode && (
                        <div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <p className="text-xs text-gray-300">
                            💡 <strong>Info:</strong> Small uncertainties in astronomical measurements are normal. 
                            It's difficult to calculate exact distances because stars are very far away.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  )
}

