export default function StatsCard({ title, value, subtitle, gradient }) {
  return (
    <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform duration-300">
      <div className={`bg-gradient-to-br ${gradient} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <span className="text-2xl">📊</span>
      </div>
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  )
}


