import { Line } from 'react-chartjs-2'
import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
)

export default function DistanceChart({ data, title }) {
  const chartRef = useRef(null)
  const containerRef = useRef(null)
  const [currentYearIndex, setCurrentYearIndex] = useState(null)
  const [chartInstance, setChartInstance] = useState(null)
  const [starPosition, setStarPosition] = useState({ x: 0, y: 0 })
  const currentYear = 2025

  if (!data || !data.intervals) return null

  const intervals = data.intervals
  
  // Find current year index
  useEffect(() => {
    const index = intervals.findIndex(item => item.year === currentYear)
    setCurrentYearIndex(index)
  }, [intervals])
  
  // Update star position when chart is ready or resizes
  useEffect(() => {
    const updateStarPosition = () => {
      if (containerRef.current && currentYearIndex !== null && currentYearIndex >= 0 && intervals.length > 0) {
        const container = containerRef.current
        const containerRect = container.getBoundingClientRect()
        const chartWidth = containerRect.width
        const chartHeight = containerRect.height
        const padding = 50 // Approximate chart padding
        
        // Calculate X position (time axis)
        const xPos = padding + ((currentYearIndex / (intervals.length - 1)) * (chartWidth - padding * 2))
        
        // Calculate Y position (distance axis)
        const currentDistance = intervals[currentYearIndex].distance_ly
        const distances = intervals.map(i => i.distance_ly)
        const minDist = Math.min(...distances)
        const maxDist = Math.max(...distances)
        const yPos = padding + ((maxDist - currentDistance) / (maxDist - minDist)) * (chartHeight - padding * 2)
        
        setStarPosition({ x: xPos, y: yPos })
      }
    }
    
    updateStarPosition()
    
    // Update on resize
    window.addEventListener('resize', updateStarPosition)
    const timer = setTimeout(updateStarPosition, 500) // Update after chart animation
    
    return () => {
      window.removeEventListener('resize', updateStarPosition)
      clearTimeout(timer)
    }
  }, [currentYearIndex, intervals, chartInstance])

  // Custom point styling for current year
  const pointRadius = intervals.map((item, index) => 
    item.year === currentYear ? 8 : 2
  )
  const pointBackgroundColor = intervals.map((item, index) => 
    item.year === currentYear ? 'rgb(255, 215, 0)' : 'rgb(236, 72, 153)'
  )
  const pointBorderColor = intervals.map((item, index) => 
    item.year === currentYear ? 'rgb(255, 255, 255)' : 'rgb(147, 51, 234)'
  )
  const pointBorderWidth = intervals.map((item, index) => 
    item.year === currentYear ? 3 : 2
  )

  const chartData = {
    labels: intervals.map(item => item.period),
    datasets: [
      {
        label: 'Distance (Light Years)',
        data: intervals.map(item => item.distance_ly),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: pointRadius,
        pointHoverRadius: 8,
        pointBackgroundColor: pointBackgroundColor,
        pointBorderColor: pointBorderColor,
        pointBorderWidth: pointBorderWidth,
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart',
        },
      },
    ],
  }

  // Find current year label index
  const currentYearLabelIndex = intervals.findIndex(item => item.year === currentYear)
  const currentYearLabel = currentYearLabelIndex >= 0 ? intervals[currentYearLabelIndex].period : null

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      onComplete: () => {
        setChartInstance(chartRef.current)
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgb(196, 181, 253)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: 'rgb(255, 255, 255)',
        font: {
          size: 24,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(196, 181, 253)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `Distance: ${context.parsed.y.toFixed(12)} ly`
          },
        },
      },
      annotation: {
        annotations: currentYearLabelIndex >= 0 ? {
          currentYearLine: {
            type: 'line',
            xMin: currentYearLabelIndex,
            xMax: currentYearLabelIndex,
            borderColor: 'rgba(255, 215, 0, 0.6)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              content: `${currentYear} AD - NOW`,
              position: 'start',
              backgroundColor: 'rgba(255, 215, 0, 0.8)',
              color: 'rgb(0, 0, 0)',
              font: {
                size: 12,
                weight: 'bold',
              },
              padding: 6,
              borderRadius: 4,
            },
          },
        } : {},
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(196, 181, 253)',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
        grid: {
          color: 'rgba(147, 51, 234, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'rgb(196, 181, 253)',
          font: {
            size: 12,
          },
          callback: function(value) {
            return value.toFixed(3) + ' ly'
          },
        },
        grid: {
          color: 'rgba(147, 51, 234, 0.1)',
        },
        title: {
          display: true,
          text: 'Distance (Light Years)',
          color: 'rgb(196, 181, 253)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  }

  // Calculate statistics
  const distances = intervals.map(item => item.distance_ly)
  const minDistance = Math.min(...distances)
  const maxDistance = Math.max(...distances)
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length

  return (
    <div className="glass-effect rounded-2xl p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2 text-gradient">{title}</h2>
        <p className="text-gray-400">
          {data.metadata.description}
        </p>
      </div>

      {/* Chart Container */}
      <div className="h-96 mb-6 relative" ref={containerRef}>
        <Line 
          ref={chartRef}
          data={chartData} 
          options={options}
          plugins={[annotationPlugin]}
        />
        
        {/* Animated Current Year Star Overlay */}
        {currentYearIndex !== null && currentYearIndex >= 0 && starPosition.x > 0 && (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: `${starPosition.x}px`,
              top: `${starPosition.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            {/* Pulsing Star */}
            <div className="relative">
              {/* Outer glow rings - multiple layers */}
              <div className="absolute inset-0 animate-ping" style={{ animationDuration: '2s' }}>
                <div className="w-20 h-20 rounded-full bg-yellow-400/20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.3s', animationDuration: '2s' }}>
                <div className="w-16 h-16 rounded-full bg-yellow-300/30 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.6s', animationDuration: '2s' }}>
                <div className="w-12 h-12 rounded-full bg-orange-400/40 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"></div>
              </div>
              
              {/* Main rotating star */}
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
                  <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-400 drop-shadow-[0_0_12px_rgba(255,215,0,1)]">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                {/* Inner glow */}
                <div className="absolute inset-0 animate-pulse">
                  <div className="w-6 h-6 bg-yellow-300 rounded-full blur-sm -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"></div>
                </div>
              </div>
              
              {/* Sparkle particles around star */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping"
                  style={{
                    left: `${50 + Math.cos((i * Math.PI * 2) / 8) * 30}%`,
                    top: `${50 + Math.sin((i * Math.PI * 2) / 8) * 30}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '1.5s',
                    boxShadow: '0 0 6px rgba(255, 215, 0, 0.8)',
                  }}
                />
              ))}
            </div>
            
            {/* Year label with glow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/50 blur-md rounded-full animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-xl animate-pulse">
                  ⭐ {currentYear} AD - NOW
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Flowing timeline animation - past to future */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute inset-0 animate-flow-timeline">
            <div 
              className="absolute h-1 w-32 bg-gradient-to-r from-purple-500/0 via-purple-400/60 to-pink-500/0 blur-md"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
          <p className="text-sm text-gray-400 mb-1">Minimum Distance</p>
          <p className="text-xl font-bold text-purple-300">{minDistance.toFixed(12)} ly</p>
        </div>
        <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-500/30">
          <p className="text-sm text-gray-400 mb-1">Maximum Distance</p>
          <p className="text-xl font-bold text-pink-300">{maxDistance.toFixed(12)} ly</p>
        </div>
        <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
          <p className="text-sm text-gray-400 mb-1">Average Distance</p>
          <p className="text-xl font-bold text-orange-300">{avgDistance.toFixed(12)} ly</p>
        </div>
      </div>

      {/* Data Info */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Total Periods</p>
            <p className="text-white font-semibold">{data.statistics.total_periods}</p>
          </div>
          <div>
            <p className="text-gray-400">Time Span</p>
            <p className="text-white font-semibold">{data.time_span.total_years.toLocaleString()} years</p>
          </div>
          <div>
            <p className="text-gray-400">Interval</p>
            <p className="text-white font-semibold">{data.time_span.interval_years} years</p>
          </div>
          <div>
            <p className="text-gray-400">Precision</p>
            <p className="text-white font-semibold">10^{data.metadata.precision_max}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

