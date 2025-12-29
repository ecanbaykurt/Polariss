import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Scatter } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function MagnitudeChart({ stars }) {
  const chartData = {
    datasets: [
      {
        label: 'Stars',
        data: stars.map(star => ({
          x: star.distance_ly,
          y: star.magnitude
        })),
        backgroundColor: stars.map((star, idx) => {
          const colors = [
            'rgba(168, 85, 247, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)'
          ]
          return colors[idx % colors.length]
        }),
        borderColor: stars.map((star, idx) => {
          const colors = [
            'rgba(168, 85, 247, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(251, 146, 60, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(59, 130, 246, 1)'
          ]
          return colors[idx % colors.length]
        }),
        borderWidth: 2,
        pointRadius: 6
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Distance vs Apparent Magnitude',
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
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            const index = context[0].dataIndex
            return stars[index].name
          },
          label: function(context) {
            const index = context.dataIndex
            const star = stars[index]
            return [
              `Distance: ${star.distance_ly.toFixed(2)} ly`,
              `Magnitude: ${star.magnitude.toFixed(2)}`,
              `Spectral Type: ${star.spectral_type}`
            ]
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Distance (Light Years)',
          color: '#9ca3af'
        },
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Apparent Magnitude',
          color: '#9ca3af'
        },
        reverse: true,
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  }

  return (
    <div className="glass-effect rounded-2xl p-6 mb-8">
      <div className="h-96">
        <Scatter data={chartData} options={options} />
      </div>
    </div>
  )
}

