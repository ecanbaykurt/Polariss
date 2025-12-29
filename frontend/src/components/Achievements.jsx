import { getUnlockedAchievements, ACHIEVEMENTS } from '../utils/gameUtils'

export default function Achievements() {
  const unlocked = getUnlockedAchievements()
  const allAchievements = Object.values(ACHIEVEMENTS)

  return (
    <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
      <h3 className="text-xl font-bold text-gradient mb-4">
        🏅 Achievements ({unlocked.length}/{allAchievements.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {allAchievements.map(achievement => {
          const isUnlocked = unlocked.includes(achievement.id)
          return (
            <div
              key={achievement.id}
              className={`glass-effect rounded-lg p-3 flex items-center gap-3 ${
                isUnlocked 
                  ? 'border border-yellow-500/50 bg-yellow-500/10' 
                  : 'border border-white/10 opacity-50'
              }`}
            >
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-400">{achievement.desc}</div>
              </div>
              {isUnlocked && (
                <div className="text-yellow-400 text-xl">✓</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

