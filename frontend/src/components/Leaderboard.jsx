import { useState } from 'react'
import { getScores } from '../utils/gameUtils'

export default function Leaderboard({ gameType, mode = 'classic' }) {
  const [selectedMode, setSelectedMode] = useState(mode)
  const scores = getScores(gameType, selectedMode)

  return (
    <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
      <h3 className="text-xl font-bold text-gradient mb-4">🏆 Leaderboard</h3>
      
      {/* Mode selector for bounce game */}
      {gameType === 'bounce' && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {['classic', 'time', 'combo', 'precision', 'speed'].map(m => (
            <button
              key={m}
              onClick={() => setSelectedMode(m)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedMode === m
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'glass-effect text-gray-300 hover:text-white'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      )}

      {scores.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No scores yet. Be the first!</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {scores.map((score, index) => (
            <div
              key={index}
              className={`glass-effect rounded-lg p-3 flex items-center justify-between ${
                index === 0 ? 'border-2 border-yellow-500/50' : 'border border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-xl font-bold ${
                  index === 0 ? 'text-yellow-400' : 
                  index === 1 ? 'text-gray-300' : 
                  index === 2 ? 'text-orange-400' : 'text-gray-400'
                }`}>
                  #{index + 1}
                </div>
                <div>
                  <div className="font-semibold text-white">{score.score.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(score.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {score.bounces !== undefined && (
                <div className="text-xs text-gray-400">
                  {score.bounces} bounces
                </div>
              )}
              {score.maxHeight !== undefined && (
                <div className="text-xs text-gray-400">
                  {Math.floor(score.maxHeight)}px
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

