import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function StarsDistanceChart({ stars }) {
  const chartData = {
    labels: stars.map(star => star.name),
    datasets: [
      {
        label: 'Distance (Light Years)',
        data: stars.map(star => star.distance_ly),
        backgroundColor: stars.map((star, idx) => {
          const colors = [
            'rgba(168, 85, 247, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(20, 184, 166, 0.8)'
          ]
          return colors[idx % colors.length]
        }),
        borderColor: stars.map((star, idx) => {
          const colors = [
            'rgba(168, 85, 247, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(251, 146, 60, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(20, 184, 166, 1)'
          ]
          return colors[idx % colors.length]
        }),
        borderWidth: 2
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
        text: 'Distance to Popular Stars',
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
          label: function(context) {
            const star = stars[context.dataIndex]
            return [
              `Distance: ${star.distance_ly.toFixed(2)} ly`,
              `Magnitude: ${star.magnitude.toFixed(2)}`,
              `Velocity: ${Math.abs(star.radial_velocity_km_s).toFixed(2)} km/s`
            ]
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#9ca3af',
          maxRotation: 45,
          minRotation: 45
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
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

