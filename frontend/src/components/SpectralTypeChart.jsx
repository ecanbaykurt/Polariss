import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function SpectralTypeChart({ stars }) {
  const spectralTypes = {}
  stars.forEach(star => {
    if (star.spectral_type) {
      const type = star.spectral_type[0]
      spectralTypes[type] = (spectralTypes[type] || 0) + 1
    }
  })

  const colors = {
    'O': 'rgba(59, 130, 246, 0.8)',
    'B': 'rgba(96, 165, 250, 0.8)',
    'A': 'rgba(255, 255, 255, 0.8)',
    'F': 'rgba(254, 243, 199, 0.8)',
    'G': 'rgba(251, 191, 36, 0.8)',
    'K': 'rgba(251, 146, 60, 0.8)',
    'M': 'rgba(239, 68, 68, 0.8)'
  }

  const borderColors = {
    'O': 'rgba(59, 130, 246, 1)',
    'B': 'rgba(96, 165, 250, 1)',
    'A': 'rgba(255, 255, 255, 1)',
    'F': 'rgba(254, 243, 199, 1)',
    'G': 'rgba(251, 191, 36, 1)',
    'K': 'rgba(251, 146, 60, 1)',
    'M': 'rgba(239, 68, 68, 1)'
  }

  const chartData = {
    labels: Object.keys(spectralTypes).sort(),
    datasets: [
      {
        label: 'Number of Stars',
        data: Object.keys(spectralTypes).sort().map(type => spectralTypes[type]),
        backgroundColor: Object.keys(spectralTypes).sort().map(type => colors[type] || 'rgba(156, 163, 175, 0.8)'),
        borderColor: Object.keys(spectralTypes).sort().map(type => borderColors[type] || 'rgba(156, 163, 175, 1)'),
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          padding: 15,
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Spectral Type Distribution',
        color: '#a855f7',
        font: {
          size: 20,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#a855f7',
        bodyColor: '#fff',
        borderColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1
      }
    }
  }

  return (
    <div className="glass-effect rounded-2xl p-6 mb-8">
      <div className="h-96">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}


