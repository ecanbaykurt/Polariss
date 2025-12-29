import { useState } from 'react'
import StarBackground from '../components/StarBackground'
import GravitySimulator from '../components/GravitySimulator'
import BalloonGame from '../components/BalloonGame'
import JumperGame from '../components/JumperGame'
import Leaderboard from '../components/Leaderboard'
import Achievements from '../components/Achievements'

export default function Games() {
  const [gameType, setGameType] = useState('bounce') // 'bounce', 'balloon', or 'jumper'

  return (
    <div className="min-h-screen bg-space-dark relative overflow-hidden">
      <StarBackground />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-gradient">
              🎮 Space Games
            </h1>
            <p className="text-xl text-purple-300 mb-4">
              Interactive Games & Simulations
            </p>
            <p className="text-sm text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience physics simulations and fun games inspired by space and astronomy
            </p>

            {/* Game Type Selector */}
            <div className="flex justify-center gap-3 mb-6 flex-wrap">
              <button
                onClick={() => setGameType('bounce')}
                className={`px-6 py-3 rounded-full transition-all font-semibold ${
                  gameType === 'bounce'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'glass-effect text-gray-300 hover:text-white hover:scale-105'
                }`}
              >
                ⚽ Ball Bounce
              </button>
              <button
                onClick={() => setGameType('balloon')}
                className={`px-6 py-3 rounded-full transition-all font-semibold ${
                  gameType === 'balloon'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'glass-effect text-gray-300 hover:text-white hover:scale-105'
                }`}
              >
                🎈 Balloon Game
              </button>
              <button
                onClick={() => setGameType('jumper')}
                className={`px-6 py-3 rounded-full transition-all font-semibold ${
                  gameType === 'jumper'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'glass-effect text-gray-300 hover:text-white hover:scale-105'
                }`}
              >
                🦘 Zıplama Oyunu
              </button>
            </div>
          </div>

          {/* Game Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {gameType === 'bounce' ? (
                <GravitySimulator />
              ) : gameType === 'balloon' ? (
                <BalloonGame />
              ) : (
                <JumperGame />
              )}
            </div>
            <div className="space-y-6">
              <Leaderboard gameType={gameType} />
              <Achievements />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


