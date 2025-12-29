import { useState, useEffect, useRef } from 'react'
import {
  saveScore, getHighScore,
  unlockAchievement, getUnlockedAchievements, ACHIEVEMENTS,
  addXP, getLevel, getXPProgress,
  getCustomization, saveCustomization,
  incrementPlayCount
} from '../utils/gameUtils'

const PLANETS = [
  { name: 'Mercury', gravity: 3.7, emoji: '☿️' },
  { name: 'Venus', gravity: 8.87, emoji: '♀️' },
  { name: 'Earth', gravity: 9.81, emoji: '🌍' },
  { name: 'Mars', gravity: 3.71, emoji: '♂️' },
  { name: 'Jupiter', gravity: 24.79, emoji: '♃' },
  { name: 'Saturn', gravity: 10.44, emoji: '♄' },
  { name: 'Uranus', gravity: 8.87, emoji: '♅' },
  { name: 'Neptune', gravity: 11.15, emoji: '♆' }
]

export default function JumperGame() {
  const canvasRef = useRef(null)
  const [isRunning, setIsRunning] = useState(false)
  const [gravity, setGravity] = useState(9.81)
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(2)
  const [showPlanetPopup, setShowPlanetPopup] = useState(false)
  const [currentPlanet, setCurrentPlanet] = useState(PLANETS[2])
  const animationRef = useRef(null)
  const planetChangeIntervalRef = useRef(null)
  
  // Player state
  const [playerPos, setPlayerPos] = useState({ x: 400, y: 320 })
  const [playerVelocity, setPlayerVelocity] = useState({ x: 0, y: 0 })
  const playerSize = 20
  const [isOnPlatform, setIsOnPlatform] = useState(true)
  const canJump = useRef(true)
  const hasJumpedRef = useRef(false)
  
  // Camera/Scroll offset
  const [cameraY, setCameraY] = useState(0)
  const [maxHeight, setMaxHeight] = useState(0)
  
  // Platforms
  const [platforms, setPlatforms] = useState([])
  const platformWidth = 120
  const platformHeight = 15
  const nextPlatformY = useRef(350)
  
  // Scoring
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  
  // Achievements and leveling
  const [showAchievementPopup, setShowAchievementPopup] = useState(null)
  const [levelUpPopup, setLevelUpPopup] = useState(null)
  const level = getLevel()
  const xpProgress = getXPProgress()
  const highScore = getHighScore('jumper', 'classic')
  
  // Game over
  const [showGameOver, setShowGameOver] = useState(false)

  // Generate initial platforms
  useEffect(() => {
    const initialPlatforms = []
    let y = 350
    // First platform at starting position (center)
    initialPlatforms.push({
      x: 350,
      y: y,
      width: platformWidth,
      height: platformHeight
    })
    y -= 100 + Math.random() * 50
    for (let i = 0; i < 9; i++) {
      initialPlatforms.push({
        x: Math.random() * 700 + 50,
        y: y,
        width: platformWidth,
        height: platformHeight
      })
      y -= 100 + Math.random() * 50
    }
    setPlatforms(initialPlatforms)
    nextPlatformY.current = y
  }, [])

  // Planet change every 5 seconds
  useEffect(() => {
    if (!isRunning) return

    planetChangeIntervalRef.current = setInterval(() => {
      const nextIndex = (currentPlanetIndex + 1) % PLANETS.length
      setCurrentPlanetIndex(nextIndex)
      const newPlanet = PLANETS[nextIndex]
      setCurrentPlanet(newPlanet)
      setGravity(newPlanet.gravity)
      setShowPlanetPopup(true)
      setTimeout(() => setShowPlanetPopup(false), 2000)
    }, 5000)

    return () => {
      if (planetChangeIntervalRef.current) {
        clearInterval(planetChangeIntervalRef.current)
      }
    }
  }, [isRunning, currentPlanetIndex])

  // Jump function - one jump per click
  const jump = () => {
    if (!isRunning) {
      setIsRunning(true)
      canJump.current = true
      hasJumpedRef.current = false
      return
    }
    
    if (canJump.current && !hasJumpedRef.current) {
      const jumpStrength = Math.sqrt(gravity) * 35
      setPlayerVelocity(prev => ({
        x: (Math.random() - 0.5) * 5,
        y: -jumpStrength
      }))
      hasJumpedRef.current = true
      canJump.current = false
    }
  }

  // Handle click/tap
  const handleClick = (e) => {
    if (showGameOver) return
    jump()
  }

  // Main game loop
  useEffect(() => {
    if (!isRunning && !showGameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let pos = { ...playerPos }
    let vel = { ...playerVelocity }
    let currentDistance = distance
    let currentMaxHeight = maxHeight
    let currentScore = score
    let camY = cameraY
    let onPlatform = isOnPlatform
    
    const dt = 0.016
    const canvasWidth = 800
    const canvasHeight = 400

    let lastUpdateTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime) => {
      if (!isRunning && !showGameOver) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        return
      }

      if (currentTime - lastUpdateTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastUpdateTime = currentTime

      if (isRunning) {
        // Clear canvas
        ctx.fillStyle = '#0a0a0f'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // Apply gravity
        vel.y += gravity * dt * 15

        // Update position
        pos.x += vel.x * dt * 100
        pos.y += vel.y * dt * 100

        // Keep player in horizontal bounds
        if (pos.x < playerSize) {
          pos.x = playerSize
          vel.x *= -0.5
        }
        if (pos.x > canvasWidth - playerSize) {
          pos.x = canvasWidth - playerSize
          vel.x *= -0.5
        }

        // Platform collision
        onPlatform = false
        let landedOnPlatform = false
        platforms.forEach(platform => {
          const platformScreenY = platform.y - camY
          
          // Check if player is on top of platform (falling and within bounds)
          if (
            vel.y >= -5 && // Only check when falling or near stationary
            pos.y + playerSize >= platformScreenY - 2 &&
            pos.y + playerSize <= platformScreenY + platformHeight + 5 &&
            pos.x + playerSize >= platform.x &&
            pos.x - playerSize <= platform.x + platform.width
          ) {
            pos.y = platformScreenY - playerSize
            vel.y = 0
            onPlatform = true
            landedOnPlatform = true
            canJump.current = true
            hasJumpedRef.current = false
            setIsOnPlatform(true)
          }
        })
        
        if (!landedOnPlatform && !onPlatform) {
          setIsOnPlatform(false)
        }

        if (!onPlatform) {
          setIsOnPlatform(false)
        }

        // Update camera to follow player (keep player in center-bottom area)
        const targetCamY = pos.y - canvasHeight * 0.6
        if (targetCamY > camY) {
          camY = targetCamY
          setCameraY(camY)
        }

        // Generate new platforms as we go up
        if (camY < nextPlatformY.current - 500) {
          const newPlatforms = [...platforms]
          for (let i = 0; i < 5; i++) {
            newPlatforms.push({
              x: Math.random() * 700 + 50,
              y: nextPlatformY.current,
              width: platformWidth,
              height: platformHeight
            })
            nextPlatformY.current -= 100 + Math.random() * 50
          }
          // Remove old platforms that are too far below
          const visibleTop = camY - 200
          const filtered = newPlatforms.filter(p => p.y >= visibleTop)
          setPlatforms(filtered)
        }

        // Update distance and score
        const newDistance = Math.max(0, camY * -1)
        if (newDistance > currentDistance) {
          currentDistance = newDistance
          setDistance(currentDistance)
          currentScore = Math.floor(currentDistance / 10)
          setScore(currentScore)
        }

        // Track max height
        const heightFromStart = -camY
        if (heightFromStart > currentMaxHeight) {
          currentMaxHeight = heightFromStart
          setMaxHeight(currentMaxHeight)
        }

        // Game over if player falls too far below camera
        if (pos.y > canvasHeight + 100) {
          setIsRunning(false)
          setShowGameOver(true)
          
          // Save score
          const finalScore = currentScore
          saveScore('jumper', 'classic', finalScore, {
            distance: currentDistance,
            maxHeight: currentMaxHeight
          })
          
          // Check achievements
          const unlocked = getUnlockedAchievements()
          if (finalScore >= 100 && !unlocked.includes(ACHIEVEMENTS.JUMPER_100.id)) {
            unlockAchievement(ACHIEVEMENTS.JUMPER_100.id)
            setShowAchievementPopup(ACHIEVEMENTS.JUMPER_100)
            setTimeout(() => setShowAchievementPopup(null), 3000)
          }
          if (currentDistance >= 500 && !unlocked.includes(ACHIEVEMENTS.JUMPER_500.id)) {
            unlockAchievement(ACHIEVEMENTS.JUMPER_500.id)
            setShowAchievementPopup(ACHIEVEMENTS.JUMPER_500)
            setTimeout(() => setShowAchievementPopup(null), 3000)
          }
          
          // Check level up
          const levelResult = addXP(Math.floor(finalScore / 10))
          if (levelResult.leveledUp) {
            setLevelUpPopup(levelResult.newLevel)
            setTimeout(() => setLevelUpPopup(null), 3000)
          }
          
          incrementPlayCount()
        }

        // Update state (only if game is still running)
        if (isRunning) {
          setPlayerPos({ ...pos })
          setPlayerVelocity({ ...vel })
        }
      }

      // Draw background (gradient sky)
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
      skyGradient.addColorStop(0, '#1a1a2e')
      skyGradient.addColorStop(1, '#0f0f1e')
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Draw platforms
      platforms.forEach(platform => {
        const platformScreenY = platform.y - camY
        if (platformScreenY > -50 && platformScreenY < canvasHeight + 50) {
          // Platform gradient
          const platformGradient = ctx.createLinearGradient(
            platform.x, platformScreenY,
            platform.x, platformScreenY + platformHeight
          )
          platformGradient.addColorStop(0, '#4a5568')
          platformGradient.addColorStop(1, '#2d3748')
          ctx.fillStyle = platformGradient
          ctx.fillRect(platform.x, platformScreenY, platform.width, platformHeight)
          ctx.strokeStyle = '#718096'
          ctx.lineWidth = 2
          ctx.strokeRect(platform.x, platformScreenY, platform.width, platformHeight)
        }
      })

      // Draw player
      if (isRunning || showGameOver) {
        ctx.fillStyle = '#60a5fa'
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, playerSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Player shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.beginPath()
        ctx.ellipse(pos.x, pos.y + playerSize + 5, playerSize * 0.8, playerSize * 0.3, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw UI
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`Yükseklik: ${Math.floor(currentDistance)}`, 10, 25)
      ctx.fillText(`Skor: ${currentScore}`, 10, 50)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate(performance.now())

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, gravity, playerPos, playerVelocity, cameraY, platforms, distance, maxHeight, score, isOnPlatform, showGameOver])

  const reset = () => {
    setIsRunning(false)
    setShowGameOver(false)
    setScore(0)
    setDistance(0)
    setMaxHeight(0)
    setCameraY(0)
    setPlayerPos({ x: 400, y: 320 })
    setPlayerVelocity({ x: 0, y: 0 })
    setIsOnPlatform(true)
    canJump.current = true
    hasJumpedRef.current = false
    nextPlatformY.current = 250
    
    // Reset platforms
    const initialPlatforms = []
    let y = 350
    // First platform at starting position (center)
    initialPlatforms.push({
      x: 350,
      y: y,
      width: platformWidth,
      height: platformHeight
    })
    y -= 100 + Math.random() * 50
    for (let i = 0; i < 9; i++) {
      initialPlatforms.push({
        x: Math.random() * 700 + 50,
        y: y,
        width: platformWidth,
        height: platformHeight
      })
      y -= 100 + Math.random() * 50
    }
    setPlatforms(initialPlatforms)
    nextPlatformY.current = y
  }

  return (
    <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gradient">🦘 Zıplama Oyunu</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Level {level}</span>
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${xpProgress}%` }}></div>
            </div>
            <span className="text-purple-300 font-bold">High: {highScore}</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Tıklayarak zıpla! Platformlara basarak yukarı çık. Yerçekimi her 5 saniyede değişiyor.
        </p>
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 mb-4">
          <p className="text-xs text-gray-300">
            {currentPlanet.emoji} {currentPlanet.name} ({gravity.toFixed(2)} m/s²) | Yükseklik: {Math.floor(distance)} | Skor: {score}
          </p>
        </div>
      </div>

      {/* Planet Popup */}
      {showPlanetPopup && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="glass-effect rounded-lg p-6 border border-purple-500/30 animate-bounce">
            <p className="text-4xl text-center mb-2">{currentPlanet.emoji}</p>
            <p className="text-xl font-bold text-center text-white">{currentPlanet.name}</p>
            <p className="text-sm text-gray-400 text-center">Yerçekimi: {gravity.toFixed(2)} m/s²</p>
          </div>
        </div>
      )}

      {/* Achievement Popup */}
      {showAchievementPopup && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="glass-effect rounded-lg p-6 border border-yellow-500/30 animate-pulse">
            <p className="text-4xl text-center mb-2">🏆</p>
            <p className="text-xl font-bold text-center text-yellow-300">{showAchievementPopup.name}</p>
            <p className="text-sm text-gray-400 text-center">{showAchievementPopup.description}</p>
          </div>
        </div>
      )}

      {/* Level Up Popup */}
      {levelUpPopup && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="glass-effect rounded-lg p-6 border border-purple-500/30 animate-pulse">
            <p className="text-4xl text-center mb-2">⬆️</p>
            <p className="text-xl font-bold text-center text-purple-300">Level Up!</p>
            <p className="text-sm text-gray-400 text-center">Yeni Level: {levelUpPopup}</p>
          </div>
        </div>
      )}

      <div className="bg-black rounded-lg overflow-hidden border border-purple-500/30 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto cursor-pointer"
          onClick={handleClick}
          style={{ touchAction: 'none' }}
        />
        {!isRunning && !showGameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="glass-effect rounded-lg p-4 border border-purple-500/30">
              <p className="text-white font-semibold text-center">
                👆 Tıkla başla! Her tıklamada zıpla
              </p>
            </div>
          </div>
        )}
        {showGameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="glass-effect rounded-lg p-6 border border-red-500/30">
              <p className="text-white font-bold text-2xl text-center mb-2">Game Over!</p>
              <p className="text-gray-300 text-center mb-4">Final Skor: {score}</p>
              <p className="text-gray-400 text-center text-sm">Yükseklik: {Math.floor(distance)}</p>
              <button
                onClick={reset}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>🔄</span>
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}

