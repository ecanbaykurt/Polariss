import { useState, useEffect, useRef } from 'react'
import {
  saveScore, getHighScore,
  unlockAchievement, ACHIEVEMENTS,
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

const GAME_MODES = {
  CLASSIC: { id: 'classic', name: 'Classic', desc: 'Free play mode' },
  TIME_CHALLENGE: { id: 'time', name: 'Time Challenge', desc: 'Score as much as possible in 60 seconds' },
  COMBO_CHALLENGE: { id: 'combo', name: 'Combo Challenge', desc: 'Achieve high combos' },
  PRECISION: { id: 'precision', name: 'Precision Mode', desc: 'Small targets, high scores' },
  SPEED: { id: 'speed', name: 'Speed Mode', desc: 'Fast moving targets' }
}

const POWER_UPS = {
  SLOW_MOTION: { id: 'slow', name: 'Slow Motion', icon: '⏱️', duration: 5000 },
  SCORE_MULTIPLIER: { id: 'multiplier', name: 'Score x2', icon: '⭐', duration: 10000 },
  MAGNET: { id: 'magnet', name: 'Magnet', icon: '🧲', duration: 8000 },
  MEGA_BOUNCE: { id: 'megabounce', name: 'Mega Bounce', icon: '💥', duration: 15000 },
  SHIELD: { id: 'shield', name: 'Shield', icon: '🛡️', duration: 12000 }
}

const BALL_COLORS = [
  { name: 'Purple', gradient: ['#a78bfa', '#7c3aed'] },
  { name: 'Blue', gradient: ['#60a5fa', '#3b82f6'] },
  { name: 'Green', gradient: ['#4ade80', '#22c55e'] },
  { name: 'Red', gradient: ['#f87171', '#ef4444'] },
  { name: 'Orange', gradient: ['#fb923c', '#f97316'] },
  { name: 'Pink', gradient: ['#f472b6', '#ec4899'] },
  { name: 'Yellow', gradient: ['#fbbf24', '#f59e0b'] },
  { name: 'Cyan', gradient: ['#22d3ee', '#06b6d4'] }
]

export default function GravitySimulator({ selectedPlanet, selectedStar }) {
  const canvasRef = useRef(null)
  
  // Core game state
  const [isRunning, setIsRunning] = useState(false)
  const [gameMode, setGameMode] = useState(GAME_MODES.CLASSIC.id)
  const [mass, setMass] = useState(1)
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 400, y: 375 })
  const [gravity, setGravity] = useState(9.81)
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(2)
  const [showPlanetPopup, setShowPlanetPopup] = useState(false)
  const [currentPlanet, setCurrentPlanet] = useState(PLANETS[2])
  const animationRef = useRef(null)
  const planetChangeIntervalRef = useRef(null)
  const [bounceCount, setBounceCount] = useState(0)
  const [maxHeight, setMaxHeight] = useState(0)
  const groundY = useRef(390)
  
  // Paddle (raket) - Scratch oyunu gibi
  const [paddleX, setPaddleX] = useState(350)
  const [paddleWidth, setPaddleWidth] = useState(100)
  const paddleHeight = 15
  
  // Scoring and game features
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3) // Can sistemi - Scratch oyunu gibi
  const [targets, setTargets] = useState([])
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [comboTimer, setComboTimer] = useState(0)
  const [targetsHit, setTargetsHit] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [showGameOver, setShowGameOver] = useState(false)
  
  // Power-ups
  const [activePowerUps, setActivePowerUps] = useState({})
  const [availablePowerUps, setAvailablePowerUps] = useState([])
  const [scoreMultiplier, setScoreMultiplier] = useState(1)
  
  // Achievements and leveling
  const [showAchievementPopup, setShowAchievementPopup] = useState(null)
  const [levelUpPopup, setLevelUpPopup] = useState(null)
  const level = getLevel()
  const xpProgress = getXPProgress()
  const highScore = getHighScore('bounce', gameMode)
  
  // Customization
  const [ballColor, setBallColor] = useState(
    getCustomization('bounce', { colorIndex: 0 }).colorIndex || 0
  )
  const [showCustomization, setShowCustomization] = useState(false)
  
  // Target generation
  const generateTarget = () => {
    const sizes = gameMode === GAME_MODES.PRECISION.id 
      ? [15, 20] 
      : gameMode === GAME_MODES.SPEED.id 
      ? [30, 40] 
      : [25, 35]
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    const x = size + Math.random() * (800 - size * 2)
    const y = 50 + Math.random() * (340 - size * 2)
    return {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
      points: Math.floor(size === 15 ? 100 : size === 30 ? 50 : size === 20 ? 75 : 25),
      color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
    }
  }

  // Initialize targets
  useEffect(() => {
    if (isRunning && gameMode !== GAME_MODES.CLASSIC.id) {
      const interval = setInterval(() => {
        setTargets(prev => {
          const newTargets = [...prev, generateTarget()]
          // Keep max 10 targets on screen
          if (newTargets.length > 10) {
            newTargets.shift()
          }
          return newTargets
        })
      }, gameMode === GAME_MODES.SPEED.id ? 1500 : 3000)
      return () => clearInterval(interval)
    }
  }, [isRunning, gameMode])

  // Remove targets that are too old
  useEffect(() => {
    if (targets.length > 0) {
      const timer = setTimeout(() => {
        setTargets(prev => prev.filter(t => Date.now() - t.id < 15000))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [targets])

  // Combo timer
  useEffect(() => {
    if (comboTimer > 0 && isRunning) {
      const timer = setTimeout(() => {
        setComboTimer(prev => Math.max(0, prev - 100))
        if (comboTimer <= 100) {
          setCombo(0)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [comboTimer, isRunning])

  // Power-up generation
  useEffect(() => {
    if (isRunning && score > 0 && score % 500 === 0) {
      const powerUpTypes = Object.values(POWER_UPS)
      const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
      setAvailablePowerUps(prev => [...prev, {
        ...randomPowerUp,
        id: Date.now(),
        x: 100 + Math.random() * 600,
        y: 100 + Math.random() * 200
      }])
    }
  }, [score, isRunning])

  // Power-up effects
  useEffect(() => {
    if (activePowerUps[POWER_UPS.SCORE_MULTIPLIER.id]) {
      setScoreMultiplier(2)
    } else {
      setScoreMultiplier(1)
    }
  }, [activePowerUps])

  // Time challenge mode
  useEffect(() => {
    if (isRunning && gameMode === GAME_MODES.TIME_CHALLENGE.id) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRunning, gameMode])

  // Achievement checking
  useEffect(() => {
    if (bounceCount >= 100) unlockAchievement(ACHIEVEMENTS.BOUNCE_100.id)
    if (bounceCount >= 500) unlockAchievement(ACHIEVEMENTS.BOUNCE_500.id)
    if (maxCombo >= 10) unlockAchievement(ACHIEVEMENTS.COMBO_10.id)
    if (targetsHit >= 50) unlockAchievement(ACHIEVEMENTS.TARGET_50.id)
    if (score >= 10000) unlockAchievement(ACHIEVEMENTS.SCORE_10000.id)
  }, [bounceCount, maxCombo, targetsHit, score])

  // Auto-change planet
  useEffect(() => {
    if (isRunning) {
      planetChangeIntervalRef.current = setInterval(() => {
        setCurrentPlanetIndex(prev => {
          const nextIndex = (prev + 1) % PLANETS.length
          const nextPlanet = PLANETS[nextIndex]
          setGravity(nextPlanet.gravity)
          setCurrentPlanet(nextPlanet)
          setShowPlanetPopup(true)
          setTimeout(() => setShowPlanetPopup(false), 2000)
          return nextIndex
        })
      }, 5000)
    } else {
      if (planetChangeIntervalRef.current) {
        clearInterval(planetChangeIntervalRef.current)
      }
    }
    return () => {
      if (planetChangeIntervalRef.current) {
        clearInterval(planetChangeIntervalRef.current)
      }
    }
  }, [isRunning])

  // Initialize
  useEffect(() => {
    const earth = PLANETS.find(p => p.name === 'Earth')
    if (earth) {
      setGravity(earth.gravity)
      setCurrentPlanet(earth)
      setCurrentPlanetIndex(PLANETS.findIndex(p => p.name === 'Earth'))
    }
    const radius = 15 + mass * 3
    const groundLevel = groundY.current - radius
    setPosition({ x: 400, y: groundLevel })
  }, [])

  const endGame = () => {
    setIsRunning(false)
    const xpResult = addXP(Math.floor(score / 10))
    if (xpResult.leveledUp) {
      setLevelUpPopup({ oldLevel: xpResult.oldLevel, newLevel: xpResult.newLevel })
      setTimeout(() => setLevelUpPopup(null), 3000)
    }
    saveScore('bounce', gameMode, score, {
      bounces: bounceCount,
      maxCombo,
      targetsHit,
      maxHeight
    })
    incrementPlayCount()
  }

  const startGame = () => {
    setIsRunning(true)
    setScore(0)
    setLives(3)
    setTargetsHit(0)
    setCombo(0)
    setMaxCombo(0)
    setBounceCount(0)
    setMaxHeight(0)
    setTimeLeft(60)
    setGameStartTime(Date.now())
    setActivePowerUps({})
    setAvailablePowerUps([])
    setShowGameOver(false)
    const radius = 15 + mass * 3
    const paddleYPosition = groundY.current - paddleHeight - 5
    // Start ball above paddle with upward velocity
    const startY = paddleYPosition - radius - 50
    setPosition({ x: 400, y: startY })
    setVelocity({ x: (Math.random() - 0.5) * 5, y: -25 }) // Start with upward velocity
    setPaddleX(350)
  }

  // Mouse movement for paddle control
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isRunning) return
      const canvas = canvasRef.current
      if (!canvas) return
      
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const newPaddleX = Math.max(
        paddleWidth / 2,
        Math.min(canvas.width - paddleWidth / 2, mouseX)
      )
      setPaddleX(newPaddleX)
    }

    if (isRunning) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isRunning, paddleWidth])

  // Main animation loop
  useEffect(() => {
    if (!isRunning) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let pos = { ...position }
    let vel = { ...velocity }
    let bounceCounter = bounceCount
    let maxHeightReached = maxHeight
    let currentScore = score
    let currentCombo = combo
    let currentMaxCombo = maxCombo
    let currentTargetsHit = targetsHit
    let currentLives = lives
    const dt = 0.016
    const radius = 15 + mass * 3
    const bounceDamping = activePowerUps[POWER_UPS.MEGA_BOUNCE.id] ? 0.95 : 0.85
    const paddleYPosition = groundY.current - paddleHeight - 5
    const slowMotion = activePowerUps[POWER_UPS.SLOW_MOTION.id] ? 0.5 : 1
    const magnetRange = activePowerUps[POWER_UPS.MAGNET.id] ? 100 : 0

    let lastUpdateTime = 0
    const targetFPS = 45
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime) => {
      if (!isRunning) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        return
      }

      if (currentTime - lastUpdateTime < frameInterval * slowMotion) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastUpdateTime = currentTime

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Apply magnet effect
      if (magnetRange > 0 && targets.length > 0) {
        targets.forEach(target => {
          const dist = Math.sqrt(Math.pow(target.x - pos.x, 2) + Math.pow(target.y - pos.y, 2))
          if (dist < magnetRange) {
            const angle = Math.atan2(target.y - pos.y, target.x - pos.x)
            vel.x += Math.cos(angle) * 2 * dt
            vel.y += Math.sin(angle) * 2 * dt
          }
        })
      }

      // Update velocity (gravity)
      vel.y += (gravity * dt * 15 * slowMotion)

      // Update position
      pos.x += vel.x * dt * 100 * slowMotion
      pos.y += vel.y * dt * 100 * slowMotion

      // Track max height (from paddle level)
      const currentHeight = paddleYPosition - pos.y
      if (currentHeight > maxHeightReached) {
        maxHeightReached = currentHeight
        setMaxHeight(maxHeightReached)
      }

      // Check target collisions
      const updatedTargets = [...targets]
      updatedTargets.forEach((target, index) => {
        const dist = Math.sqrt(Math.pow(target.x - pos.x, 2) + Math.pow(target.y - pos.y, 2))
        if (dist < radius + target.size) {
          // Hit target
          const points = target.points * scoreMultiplier * (1 + currentCombo * 0.1)
          currentScore += Math.floor(points)
          currentCombo++
          if (currentCombo > currentMaxCombo) {
            currentMaxCombo = currentCombo
          }
          currentTargetsHit++
          setComboTimer(3000)
          updatedTargets.splice(index, 1)
          setScore(currentScore)
          setCombo(currentCombo)
          setMaxCombo(currentMaxCombo)
          setTargetsHit(currentTargetsHit)
        }
      })
      setTargets(updatedTargets)

      // Check power-up collisions
      const updatedPowerUps = [...availablePowerUps]
      updatedPowerUps.forEach((powerUp, index) => {
        const dist = Math.sqrt(Math.pow(powerUp.x - pos.x, 2) + Math.pow(powerUp.y - pos.y, 2))
        if (dist < radius + 20) {
          // Collect power-up
          setActivePowerUps(prev => ({
            ...prev,
            [powerUp.id]: { type: powerUp.id, expiresAt: Date.now() + powerUp.duration }
          }))
          setTimeout(() => {
            setActivePowerUps(prev => {
              const newActive = { ...prev }
              delete newActive[powerUp.id]
              return newActive
            })
          }, powerUp.duration)
          updatedPowerUps.splice(index, 1)
        }
      })
      setAvailablePowerUps(updatedPowerUps)

      // Bounce off walls
      if (pos.x - radius < 0) {
        vel.x *= -0.9
        pos.x = radius
        currentCombo = 0
        setCombo(0)
      }
      if (pos.x + radius > canvas.width) {
        vel.x *= -0.9
        pos.x = canvas.width - radius
        currentCombo = 0
        setCombo(0)
      }

      // Paddle collision (Scratch oyunu gibi) - paddleYPosition already defined above
      const paddleTop = paddleYPosition
      const paddleBottom = paddleYPosition + paddleHeight
      const paddleLeft = paddleX - paddleWidth / 2
      const paddleRight = paddleX + paddleWidth / 2

      // Check if ball hits paddle from above (only when falling)
      if (vel.y > 0 && 
          pos.y + radius >= paddleTop && 
          pos.y - radius <= paddleBottom &&
          pos.x + radius >= paddleLeft && 
          pos.x - radius <= paddleRight) {
        
        // Hit paddle - bounce up
        bounceCounter++
        setBounceCount(bounceCounter)
        
        // Calculate bounce angle based on where ball hits paddle (Scratch gibi)
        const hitPos = (pos.x - paddleX) / (paddleWidth / 2) // -1 to 1
        const bounceAngle = hitPos * Math.PI / 3 // Max 60 degrees
        
        const bounceStrength = Math.sqrt(gravity) * 30
        vel.x = Math.sin(bounceAngle) * bounceStrength
        vel.y = -Math.abs(Math.cos(bounceAngle) * bounceStrength)
        
        pos.y = paddleTop - radius
        
        // Score for hitting paddle
        currentScore += 10 * scoreMultiplier
        setScore(currentScore)
      }

      // Ball fell below paddle - lose a life (Scratch oyunu gibi)
      // Only lose life if ball is clearly below paddle and falling
      if (pos.y > paddleYPosition + paddleHeight + 20 && vel.y > 0) {
        currentLives--
        setLives(currentLives)
        if (currentLives <= 0) {
          setIsRunning(false)
          setShowGameOver(true)
        } else {
          // Reset ball position above paddle
          const resetY = paddleYPosition - radius - 50
          pos.x = 400
          pos.y = resetY
          vel.x = (Math.random() - 0.5) * 5
          vel.y = -25
          setPosition({ ...pos })
          setVelocity({ ...vel })
        }
      }

      // Draw ground
      const groundGradient = ctx.createLinearGradient(0, groundY.current, 0, canvas.height)
      groundGradient.addColorStop(0, '#4a5568')
      groundGradient.addColorStop(1, '#2d3748')
      ctx.fillStyle = groundGradient
      ctx.fillRect(0, groundY.current, canvas.width, canvas.height - groundY.current)
      ctx.strokeStyle = '#718096'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, groundY.current)
      ctx.lineTo(canvas.width, groundY.current)
      ctx.stroke()

      // Draw paddle (Scratch oyunu gibi - mavi raket) - use same paddleYPosition from collision check
      const paddleGradient = ctx.createLinearGradient(paddleX - paddleWidth / 2, paddleYPosition, paddleX + paddleWidth / 2, paddleYPosition + paddleHeight)
      paddleGradient.addColorStop(0, '#60a5fa')
      paddleGradient.addColorStop(0.5, '#3b82f6')
      paddleGradient.addColorStop(1, '#2563eb')
      ctx.fillStyle = paddleGradient
      ctx.fillRect(paddleX - paddleWidth / 2, paddleYPosition, paddleWidth, paddleHeight)
      ctx.strokeStyle = '#1e40af'
      ctx.lineWidth = 2
      ctx.strokeRect(paddleX - paddleWidth / 2, paddleYPosition, paddleWidth, paddleHeight)
      
      // Paddle highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.fillRect(paddleX - paddleWidth / 2, paddleYPosition, paddleWidth, paddleHeight / 3)

      // Draw targets
      updatedTargets.forEach(target => {
        ctx.fillStyle = target.color
        ctx.beginPath()
        ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 14px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(target.points, target.x, target.y + 5)
      })

      // Draw power-ups
      updatedPowerUps.forEach(powerUp => {
        ctx.fillStyle = 'rgba(147, 51, 234, 0.8)'
        ctx.beginPath()
        ctx.arc(powerUp.x, powerUp.y, 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = '20px'
        ctx.textAlign = 'center'
        ctx.fillText(powerUp.icon, powerUp.x, powerUp.y + 7)
      })

      // Draw ball
      const ballColors = BALL_COLORS[ballColor].gradient
      const ballGradient = ctx.createRadialGradient(
        pos.x - radius * 0.3, pos.y - radius * 0.3, 0,
        pos.x, pos.y, radius
      )
      ballGradient.addColorStop(0, ballColors[0])
      ballGradient.addColorStop(1, ballColors[1])
      ctx.fillStyle = ballGradient
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.beginPath()
      ctx.arc(pos.x - radius * 0.3, pos.y - radius * 0.3, radius * 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Draw shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.beginPath()
      ctx.ellipse(pos.x, groundY.current, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Draw stats (Scratch oyunu gibi)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`Zıplatma: ${bounceCounter}`, 10, 25)
      ctx.fillText(`Can: ${lives}`, canvas.width - 100, 25)
      ctx.font = '14px monospace'
      ctx.fillText(`Score: ${currentScore}`, 10, 45)
      ctx.fillText(`Combo: ${currentCombo}x`, 10, 65)
      if (gameMode === GAME_MODES.TIME_CHALLENGE.id) {
        ctx.fillText(`Time: ${timeLeft}s`, 10, 85)
      }

      setPosition(pos)
      setVelocity(vel)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate(performance.now())

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, gravity, mass, position, velocity, bounceCount, maxHeight, targets, availablePowerUps, activePowerUps, scoreMultiplier, ballColor, combo, gameMode, timeLeft, paddleX, paddleWidth, lives])

  const handleCanvasClick = (e) => {
    // Just start the game on click - paddle is controlled by mouse movement
    if (!isRunning) {
      startGame()
    }
  }

  const reset = () => {
    setIsRunning(false)
    setScore(0)
    setLives(3)
    setTargets([])
    setCombo(0)
    setMaxCombo(0)
    setTargetsHit(0)
    setBounceCount(0)
    setMaxHeight(0)
    setTimeLeft(60)
    setActivePowerUps({})
    setAvailablePowerUps([])
    setShowGameOver(false)
    const radius = 15 + mass * 3
    const paddleYPosition = groundY.current - paddleHeight - 5
    const startY = paddleYPosition - radius - 50
    setPosition({ x: 400, y: startY })
    setVelocity({ x: 0, y: 0 })
    setPaddleX(350)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  return (
    <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gradient">⚽ Ball Bounce Game</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Level {level}</span>
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${xpProgress}%` }}></div>
            </div>
            <span className="text-purple-300 font-bold">High: {highScore}</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Move your mouse to control the paddle! Keep the ball in the air. Gravity changes every 5 seconds.
        </p>
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-300">
              {currentPlanet.emoji} {currentPlanet.name} ({gravity.toFixed(2)} m/s²)
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-white">Zıplatma: <span className="font-bold text-purple-300">{bounceCount}</span></span>
              <span className="text-white">Can: <span className="font-bold text-red-300">{lives}</span></span>
              <span className="text-white">Score: <span className="font-bold text-yellow-300">{score}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Mode Selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Game Mode:</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(GAME_MODES).map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                if (!isRunning) {
                  setGameMode(mode.id)
                  reset()
                }
              }}
              disabled={isRunning}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                gameMode === mode.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'glass-effect text-gray-300 hover:text-white'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={mode.desc}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Mass: {mass.toFixed(1)} kg
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
            disabled={isRunning}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Ball Color
          </label>
          <div className="flex gap-2">
            {BALL_COLORS.map((color, index) => (
              <button
                key={index}
                onClick={() => {
                  setBallColor(index)
                  saveCustomization('bounce', { colorIndex: index })
                }}
                disabled={isRunning}
                className={`w-8 h-8 rounded-full border-2 ${
                  ballColor === index ? 'border-white' : 'border-gray-600'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${color.gradient[0]}, ${color.gradient[1]})`
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-3 flex-wrap">
        <button
          onClick={() => {
            if (isRunning) {
              endGame()
            } else {
              startGame()
            }
          }}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isRunning
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {isRunning ? '⏸️ Pause' : '▶️ Start'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 font-semibold"
        >
          🔄 Reset
        </button>
        <button
          onClick={() => setShowCustomization(!showCustomization)}
          className="px-6 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-semibold"
        >
          ⚙️ Customize
        </button>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-white">
            <span className="text-gray-400">Score: </span>
            <span className="font-bold text-yellow-300">{score}</span>
          </div>
          <div className="text-white">
            <span className="text-gray-400">Combo: </span>
            <span className="font-bold text-orange-300">{combo}x</span>
          </div>
          <div className="text-white">
            <span className="text-gray-400">Targets: </span>
            <span className="font-bold text-green-300">{targetsHit}</span>
          </div>
        </div>
      </div>

      {/* Active Power-ups */}
      {Object.keys(activePowerUps).length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {Object.entries(activePowerUps).map(([id, powerUp]) => (
            <div key={id} className="px-3 py-1 bg-purple-500/20 rounded-lg text-sm text-purple-300">
              {Object.values(POWER_UPS).find(p => p.id === powerUp.type)?.icon} {
                Object.values(POWER_UPS).find(p => p.id === powerUp.type)?.name
              }
            </div>
          ))}
        </div>
      )}

      <div className="bg-black rounded-lg overflow-hidden border border-purple-500/30 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto cursor-none"
          onClick={handleCanvasClick}
          style={{ touchAction: 'none' }}
        />
        {!isRunning && !showGameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="glass-effect rounded-lg p-4 border border-purple-500/30">
              <p className="text-white font-semibold text-center">
                👆 Click to start! Move mouse to control paddle
              </p>
            </div>
          </div>
        )}
        {showGameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="glass-effect rounded-lg p-6 border border-red-500/30">
              <p className="text-white font-bold text-2xl text-center mb-2">Game Over!</p>
              <p className="text-gray-300 text-center mb-4">Final Score: {score}</p>
              <p className="text-gray-400 text-center text-sm">Zıplatma: {bounceCount}</p>
            </div>
          </div>
        )}
      </div>

      {/* Planet Popup */}
      {showPlanetPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="glass-effect rounded-2xl p-8 border-2 border-purple-500/70 shadow-2xl bg-space-dark/95 backdrop-blur-xl animate-[fadeInScale_0.3s_ease-out]">
            <div className="text-center">
              <div className="text-7xl mb-4 animate-bounce">{currentPlanet.emoji}</div>
              <h3 className="text-3xl font-bold text-gradient mb-2">{currentPlanet.name}</h3>
              <p className="text-lg text-purple-300 font-semibold">
                Gravity: {currentPlanet.gravity.toFixed(2)} m/s²
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Popup */}
      {showAchievementPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="glass-effect rounded-2xl p-6 border-2 border-yellow-500/70 shadow-2xl bg-space-dark/95 backdrop-blur-xl animate-[fadeInScale_0.3s_ease-out]">
            <div className="text-center">
              <div className="text-5xl mb-2">{showAchievementPopup.icon}</div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-1">{showAchievementPopup.name}</h3>
              <p className="text-gray-300">{showAchievementPopup.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Popup */}
      {levelUpPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="glass-effect rounded-2xl p-8 border-2 border-green-500/70 shadow-2xl bg-space-dark/95 backdrop-blur-xl animate-[fadeInScale_0.3s_ease-out]">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-300 mb-2">Level Up!</h3>
              <p className="text-2xl text-white">
                {levelUpPopup.oldLevel} → {levelUpPopup.newLevel}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
