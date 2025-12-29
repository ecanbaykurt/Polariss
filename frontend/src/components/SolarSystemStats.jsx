const STATS_DATA = [
    {
      label: "Stars",
      value: "1",
      description: "The Sun",
      icon: "⭐"
    },
    {
      label: "Planets",
      value: "8",
      description: "4 terrestrial, 4 gas giants",
      icon: "🪐"
    },
    {
      label: "Dwarf Planets",
      value: "5+",
      description: "Including Pluto, Ceres, Eris",
      icon: "🌑"
    },
    {
      label: "Moons",
      value: "290+",
      description: "Natural satellites",
      icon: "🌙"
    },
    {
      label: "Asteroids",
      value: "1.3M+",
      description: "Known asteroids",
      icon: "☄️"
    },
    {
      label: "Comets",
      value: "4,000+",
      description: "Known comets",
      icon: "💫"
    },
    {
      label: "Artificial Satellites",
      value: "8,000+",
      description: "Active and inactive",
      icon: "🛰️"
    },
    {
      label: "Age",
      value: "4.6B years",
      description: "Solar system age",
      icon: "⏰"
    }
  ]

export default function SolarSystemStats() {
  const stats = STATS_DATA

  return (
    <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold text-gradient mb-6 text-center">
        Solar System Statistics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-effect rounded-lg p-4 text-center transition-all duration-200 border border-white/10 hover:border-purple-500/30 hover:bg-white/5"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold text-gradient mb-1">
              {stat.value}
            </div>
            <div className="text-xs font-medium text-white/90 mb-0.5">
              {stat.label}
            </div>
            <div className="text-xs text-gray-400">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="glass-effect rounded-lg p-4 border border-blue-500/20">
            <div className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
              <span className="text-base">🌌</span>
              <span>Milky Way Galaxy</span>
            </div>
            <div className="text-gray-300 text-xs leading-relaxed">
              Our solar system is located in the Orion Arm, about 27,000 light-years from the galactic center.
            </div>
          </div>
          <div className="glass-effect rounded-lg p-4 border border-green-500/20">
            <div className="font-semibold text-green-300 mb-2 flex items-center gap-2">
              <span className="text-base">🚀</span>
              <span>Heliosphere</span>
            </div>
            <div className="text-gray-300 text-xs leading-relaxed">
              The Sun's magnetic field extends far beyond Pluto, creating a protective bubble around the solar system.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

