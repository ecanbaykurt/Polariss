import { useState, useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'

export default function FuturePathChart() {
  const [chartData, setChartData] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    // Polaris parameters
    const baseDistance = 446.5 // Reference distance at 2025-01-01
    const referenceDate = new Date('2025-01-01T00:00:00Z')
    const radialVelocity = 3.76 // km/s (moving away)
    const kmPerLy = 9.4607304725808e12

    // Calculate distance for a given date
    const calculateDistance = (date) => {
      const secondsFromReference = (date - referenceDate) / 1000
      const distanceChange = (radialVelocity * secondsFromReference) / kmPerLy
      return baseDistance + distanceChange
    }

    // Generate data: last 30 days + next 30 days
    const generateData = () => {
      const now = new Date()
      const pastDays = []
      const futureDays = []
      const pastLabels = []
      const futureLabels = []
      const pastDistances = []
      const futureDistances = []

      // Generate past 30 days (day by day)
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0) // Start of day
        
        const distance = calculateDistance(date)
        const label = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        })
        
        pastDays.push({ date, distance, label })
        pastLabels.push(label)
        pastDistances.push(distance)
      }

      // Generate next 30 days (prediction, day by day)
      for (let i = 1; i <= 30; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() + i)
        date.setHours(0, 0, 0, 0) // Start of day
        
        const distance = calculateDistance(date)
        const label = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        })
        
        futureDays.push({ date, distance, label })
        futureLabels.push(label)
        futureDistances.push(distance)
      }

      // Current time index is at the end of past data (index 30)
      const currentTimeIndex = pastDays.length - 1

      return {
        pastLabels,
        futureLabels,
        pastDistances,
        futureDistances,
        allLabels: [...pastLabels, ...futureLabels],
        allDistances: [...pastDistances, ...futureDistances],
        currentTimeIndex,
        currentDistance: pastDistances[pastDistances.length - 1]
      }
    }

    // Initial data
    const initialData = generateData()
    setChartData(initialData)

    // Update every minute
    const interval = setInterval(() => {
      const updatedData = generateData()
      setChartData(updatedData)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (!chartData) {
    return (
      <div className="glass-effect rounded-2xl p-6">
        <div className="animate-pulse text-center text-gray-400">Loading historical and predicted data...</div>
      </div>
    )
  }

  // Custom plugin to draw space shuttle at the end of the prediction line
  const spaceShuttlePlugin = {
    id: 'spaceShuttle',
    afterDatasetsDraw: (chart) => {
      const ctx = chart.ctx
      const meta = chart.getDatasetMeta(1) // Future prediction dataset
      if (!meta.data || meta.data.length === 0) return

      // Get the last point (end of prediction)
      const lastPoint = meta.data[meta.data.length - 1]
      const x = lastPoint.x
      const y = lastPoint.y

      // Save context
      ctx.save()

      // Calculate direction of travel (angle of the line at the end)
      let angle = 0
      if (meta.data.length >= 2) {
        const secondLastPoint = meta.data[meta.data.length - 2]
        const dx = x - secondLastPoint.x
        const dy = y - secondLastPoint.y
        angle = Math.atan2(dy, dx) + Math.PI / 2 // Point upward along the line
      } else {
        angle = -Math.PI / 2 // Point straight up if no previous point
      }

      // Draw space shuttle shape
      ctx.translate(x, y)
      ctx.rotate(angle) // Rotate to point in direction of travel

      // Shuttle body (main triangle)
      ctx.beginPath()
      ctx.fillStyle = 'rgba(236, 72, 153, 0.9)'
      ctx.strokeStyle = 'rgb(147, 51, 234)'
      ctx.lineWidth = 2
      
      // Main body triangle (pointing upward)
      ctx.moveTo(0, -18) // Nose
      ctx.lineTo(-10, 10) // Bottom left
      ctx.lineTo(10, 10) // Bottom right
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Wings
      ctx.beginPath()
      ctx.fillStyle = 'rgba(147, 51, 234, 0.9)'
      ctx.strokeStyle = 'rgb(147, 51, 234)'
      ctx.lineWidth = 1.5
      // Left wing
      ctx.moveTo(-10, 8)
      ctx.lineTo(-16, 14)
      ctx.lineTo(-10, 12)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      // Right wing
      ctx.moveTo(10, 8)
      ctx.lineTo(16, 14)
      ctx.lineTo(10, 12)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Engine glow (at bottom)
      ctx.beginPath()
      ctx.fillStyle = 'rgba(251, 146, 60, 0.8)'
      ctx.arc(0, 10, 5, 0, Math.PI * 2)
      ctx.fill()
      // Inner engine glow
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.arc(0, 10, 2, 0, Math.PI * 2)
      ctx.fill()

      // Window (cockpit)
      ctx.beginPath()
      ctx.fillStyle = 'rgba(147, 197, 253, 0.95)'
      ctx.arc(0, -8, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Glow effect
      ctx.shadowBlur = 15
      ctx.shadowColor = 'rgba(236, 72, 153, 0.8)'
      ctx.beginPath()
      ctx.arc(0, 0, 20, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(236, 72, 153, 0.2)'
      ctx.fill()

      ctx.restore()
    }
  }

  // Custom plugin to draw vertical line at current time
  const currentTimePlugin = {
    id: 'currentTime',
    afterDatasetsDraw: (chart) => {
      const ctx = chart.ctx
      const meta = chart.getDatasetMeta(0) // Past data dataset
      if (!meta.data || meta.data.length === 0) return

      // Get current time point (last point of past data)
      const currentPoint = meta.data[meta.data.length - 1]
      const x = currentPoint.x
      const yScale = chart.scales.y

      // Draw vertical line
      ctx.save()
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(x, yScale.top)
      ctx.lineTo(x, yScale.bottom)
      ctx.stroke()
      ctx.restore()
    }
  }

  const data = {
    labels: chartData.allLabels,
    datasets: [
      // Historical data (last 30 days)
      {
        label: 'Historical Distance',
        data: chartData.allDistances.map((d, i) => i <= chartData.currentTimeIndex ? d : null),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 1,
      },
      // Predicted future data (next 30 days)
      {
        label: 'Predicted Distance',
        data: chartData.allDistances.map((d, i) => i > chartData.currentTimeIndex ? d : null),
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 4,
        borderDash: [5, 5],
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(236, 72, 153)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
      },
      // Current position marker
      {
        label: 'Current Position',
        data: chartData.allDistances.map((d, i) => i === chartData.currentTimeIndex ? d : null),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.9)',
        pointRadius: 10,
        pointHoverRadius: 12,
        pointBorderWidth: 3,
        pointBorderColor: 'rgb(255, 255, 255)',
        showLine: false
      }
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
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
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Polaris Distance: Last 30 Days & Next 30 Days Prediction',
        color: 'rgb(255, 255, 255)',
        font: {
          size: 22,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 25,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(196, 181, 253)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2,
        padding: 15,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: function(context) {
            return context[0].label
          },
          label: function(context) {
            const datasetLabel = context.dataset.label || ''
            const value = context.parsed.y
            if (datasetLabel === 'Current Position') {
              return `Current: ${value.toFixed(12)} ly`
            }
            return `${datasetLabel}: ${value.toFixed(12)} ly`
          },
          afterBody: function(context) {
            if (context.length > 0) {
              const index = context[0].dataIndex
              const isHistorical = index <= chartData.currentTimeIndex
              return isHistorical ? 'Historical Data' : 'Predicted Data'
            }
            return ''
          }
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(196, 181, 253)',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
          maxTicksLimit: 20,
          callback: function(value, index) {
            // Show every 5th label to avoid crowding
            if (index % 5 === 0 || index === chartData.currentTimeIndex) {
              return this.getLabelForValue(value)
            }
            return ''
          }
        },
        grid: {
          color: 'rgba(147, 51, 234, 0.15)',
          drawOnChartArea: true,
        },
        title: {
          display: true,
          text: 'Date (Last 30 Days → Next 30 Days)',
          color: 'rgb(196, 181, 253)',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: {
            top: 10,
            bottom: 5,
          }
        },
      },
      y: {
        ticks: {
          color: 'rgb(196, 181, 253)',
          font: {
            size: 12,
          },
          callback: function(value) {
            return value.toFixed(9) + ' ly'
          },
          precision: 12,
        },
        grid: {
          color: 'rgba(147, 51, 234, 0.15)',
          drawOnChartArea: true,
        },
        title: {
          display: true,
          text: 'Distance (Light Years)',
          color: 'rgb(196, 181, 253)',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: {
            top: 5,
            bottom: 10,
          }
        },
      },
    },
  }

  // Calculate statistics
  const historicalDistances = chartData.pastDistances
  const predictedDistances = chartData.futureDistances
  const minHistorical = Math.min(...historicalDistances)
  const maxHistorical = Math.max(...historicalDistances)
  const minPredicted = Math.min(...predictedDistances)
  const maxPredicted = Math.max(...predictedDistances)
  const totalChange = predictedDistances[predictedDistances.length - 1] - chartData.currentDistance

  return (
    <div className="glass-effect rounded-2xl p-6 md:p-8 mt-6 border border-purple-500/30">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
          🚀 Historical & Predicted Distance Trajectory
        </h2>
        <p className="text-sm text-gray-400">
          Daily distance tracking for Polaris - Last 30 days (historical) and next 30 days (predicted)
        </p>
      </div>

      {/* Chart Container */}
      <div className="h-96 mb-6">
        <Line 
          ref={chartRef}
          data={data} 
          options={options}
          plugins={[currentTimePlugin, spaceShuttlePlugin]}
        />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
          <p className="text-sm text-gray-400 mb-1">Historical Range</p>
          <p className="text-lg font-bold text-purple-300">
            {(maxHistorical - minHistorical).toFixed(12)} ly
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Last 30 days variation
          </p>
        </div>
        <div className="bg-pink-900/30 rounded-lg p-4 border border-pink-500/30">
          <p className="text-sm text-gray-400 mb-1">Predicted Range</p>
          <p className="text-lg font-bold text-pink-300">
            {(maxPredicted - minPredicted).toFixed(12)} ly
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Next 30 days variation
          </p>
        </div>
        <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
          <p className="text-sm text-gray-400 mb-1">Current Distance</p>
          <p className="text-lg font-bold text-green-300">
            {chartData.currentDistance.toFixed(12)} ly
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Today's distance
          </p>
        </div>
        <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
          <p className="text-sm text-gray-400 mb-1">30-Day Change</p>
          <p className="text-lg font-bold text-orange-300">
            +{totalChange.toFixed(12)} ly
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Predicted increase
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-400 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Historical Data (Last 30 Days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded" style={{ border: '2px dashed rgba(236, 72, 153, 0.5)' }}></div>
          <span>Predicted Data (Next 30 Days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span>Current Position</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <span>Space Shuttle (End of Prediction)</span>
        </div>
      </div>
    </div>
  )
}
