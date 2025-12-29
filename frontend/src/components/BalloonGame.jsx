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

const HEIGHT_MILESTONES = [
  { height: 100, points: 100, name: 'First Flight' },
  { height: 200, points: 250, name: 'Sky Explorer' },
  { height: 300, points: 500, name: 'Cloud Surfer' },
  { height: 400, points: 1000, name: 'High Flyer' }
]

const BALLOON_COLORS = [
  { name: 'Red', gradient: ['#ff6b6b', '#c44569'] },
  { name: 'Blue', gradient: ['#4dabf7', '#339af0'] },
  { name: 'Green', gradient: ['#51cf66', '#40c057'] },
  { name: 'Purple', gradient: ['#9775fa', '#845ef7'] },
  { name: 'Orange', gradient: ['#ff922b', '#fd7e14'] },
  { name: 'Pink', gradient: ['#f783ac', '#f06595'] },
  { name: 'Yellow', gradient: ['#ffd43b', '#fcc419'] },
  { name: 'Cyan', gradient: ['#38d9a9', '#20c997'] }
]

export default function BalloonGame() {
  const canvasRef = useRef(null)
  const [isRunning, setIsRunning] = useState(false)
  const [gravity, setGravity] = useState(9.81)
  const [windSpeed, setWindSpeed] = useState(0)
  const [windDirection, setWindDirection] = useState(1)
  const [balloonSize, setBalloonSize] = useState(1.0)
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(2)
  const [showPlanetPopup, setShowPlanetPopup] = useState(false)
  const [currentPlanet, setCurrentPlanet] = useState(PLANETS[2])
  const [position, setPosition] = useState({ x: 400, y: 200 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const animationRef = useRef(null)
  const planetChangeIntervalRef = useRef(null)
  
  // Scoring system
  const [score, setScore] = useState(0)
  const [maxHeight, setMaxHeight] = useState(0)
  const [currentHeight, setCurrentHeight] = useState(0)
  const [starsCollected, setStarsCollected] = useState(0)
  const [stars, setStars] = useState([])
  const [achievedMilestones, setAchievedMilestones] = useState([])
  const [windCombo, setWindCombo] = useState(0)
  const [maxWindCombo, setMaxWindCombo] = useState(0)
  const [windComboTimer, setWindComboTimer] = useState(0)
  const [flightTime, setFlightTime] = useState(0)
  const [balanceBonus, setBalanceBonus] = useState(0)
  const balanceTargetHeight = useRef(200)
  
  // Achievements and leveling
  const [showAchievementPopup, setShowAchievementPopup] = useState(null)
  const [levelUpPopup, setLevelUpPopup] = useState(null)
  const level = getLevel()
  const xpProgress = getXPProgress()
  const highScore = getHighScore('balloon', 'classic')
  
  // Customization
  const [balloonColor, setBalloonColor] = useState(
    getCustomization('balloon', { colorIndex: 0 }).colorIndex || 0
  )

  // Generate stars
  const generateStar = () => {
    return {
      id: Date.now() + Math.random(),
      x: 50 + Math.random() * 700,
      y: 50 + Math.random() * 350,
      size: 10 + Math.random() * 10,
      points: Math.floor(10 + Math.random() * 40),
      color: `hsl(${Math.random() * 60 + 40}, 80%, 60%)`,
      twinkle: Math.random() * Math.PI * 2
    }
  }

  // Star generation
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setStars(prev => {
          const newStars = [...prev, generateStar()]
          if (newStars.length > 20) {
            newStars.shift()
          }
          return newStars
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isRunning])

  // Remove old stars
  useEffect(() => {
    if (stars.length > 0) {
      const timer = setTimeout(() => {
        setStars(prev => prev.filter(s => Date.now() - s.id < 15000))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [stars])

  // Wind combo system
  useEffect(() => {
    if (windComboTimer > 0 && isRunning && windSpeed > 5) {
      const timer = setTimeout(() => {
        setWindComboTimer(prev => Math.max(0, prev - 100))
        if (windComboTimer <= 100) {
          setWindCombo(0)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [windComboTimer, isRunning, windSpeed])

  // Flight time tracking
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setFlightTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRunning])

  // Balance bonus (keeping balloon at target height)
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const heightDiff = Math.abs(currentHeight - balanceTargetHeight.current)
        if (heightDiff < 30) {
          setBalanceBonus(prev => prev + 5)
          setScore(prev => prev + 5)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRunning, currentHeight])

  // Achievement checking
  useEffect(() => {
    if (maxHeight >= 300) {
      const unlocked = unlockAchievement(ACHIEVEMENTS.HEIGHT_300.id)
      if (unlocked) {
        setShowAchievementPopup(ACHIEVEMENTS.HEIGHT_300)
        setTimeout(() => setShowAchievementPopup(null), 3000)
      }
    }
    if (starsCollected >= 100) {
      const unlocked = unlockAchievement(ACHIEVEMENTS.COLLECT_100.id)
      if (unlocked) {
        setShowAchievementPopup(ACHIEVEMENTS.COLLECT_100)
        setTimeout(() => setShowAchievementPopup(null), 3000)
      }
    }
    if (maxWindCombo >= 10) {
      const unlocked = unlockAchievement(ACHIEVEMENTS.WIND_MASTER.id)
      if (unlocked) {
        setShowAchievementPopup(ACHIEVEMENTS.WIND_MASTER)
        setTimeout(() => setShowAchievementPopup(null), 3000)
      }
    }
  }, [maxHeight, starsCollected, maxWindCombo])

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
  }, [])

  const endGame = () => {
    setIsRunning(false)
    const xpResult = addXP(Math.floor(score / 10))
    if (xpResult.leveledUp) {
      setLevelUpPopup({ oldLevel: xpResult.oldLevel, newLevel: xpResult.newLevel })
      setTimeout(() => setLevelUpPopup(null), 3000)
    }
    saveScore('balloon', 'classic', score, {
      maxHeight,
      starsCollected,
      flightTime,
      maxWindCombo
    })
    incrementPlayCount()
  }

  const startGame = () => {
    setIsRunning(true)
    setScore(0)
    setMaxHeight(0)
    setStarsCollected(0)
    setStars([])
    setAchievedMilestones([])
    setWindCombo(0)
    setMaxWindCombo(0)
    setFlightTime(0)
    setBalanceBonus(0)
    setPosition({ x: 400, y: 200 })
    setVelocity({ x: 0, y: 0 })
    balanceTargetHeight.current = 200
  }

  // Main animation loop
  useEffect(() => {
    if (!isRunning) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let pos = { ...position }
    let vel = { ...velocity }
    let currentScore = score
    let currentMaxHeight = maxHeight
    let currentStarsCollected = starsCollected
    let currentWindCombo = windCombo
    let currentMaxWindCombo = maxWindCombo
    const achievedMilestonesRef = achievedMilestones
    const dt = 0.016
    const radius = 40 * balloonSize
    const buoyancyForce = 0.5
    const airResistance = 0.98
    const canvasHeight = 400
    const groundLevel = canvasHeight - 50

    let lastUpdateTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime) => {
      if (!isRunning) {
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

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Physics: Buoyancy vs Gravity
      const netGravity = (gravity - buoyancyForce * 10) * dt * 0.1
      vel.y += netGravity

      // Wind force (stronger wind = more combo potential)
      const windForce = windSpeed * windDirection * dt * 0.5
      vel.x += windForce
      if (windSpeed > 5) {
        currentWindCombo++
        if (currentWindCombo > currentMaxWindCombo) {
          currentMaxWindCombo = currentWindCombo
          setMaxWindCombo(currentMaxWindCombo)
        }
        setWindCombo(currentWindCombo)
        setWindComboTimer(3000)
        // Bonus points for wind combos
        if (currentWindCombo % 5 === 0) {
          currentScore += currentWindCombo * 2
          setScore(currentScore)
        }
      } else {
        currentWindCombo = 0
        setWindCombo(0)
      }

      // Air resistance
      vel.x *= airResistance
      vel.y *= airResistance

      // Update position
      pos.x += vel.x * dt * 100
      pos.y += vel.y * dt * 100

      // Calculate current height (from bottom)
      const height = canvasHeight - pos.y
      setCurrentHeight(height)
      
      if (height > currentMaxHeight) {
        currentMaxHeight = height
        setMaxHeight(currentMaxHeight)
        
        // Check height milestones
        HEIGHT_MILESTONES.forEach(milestone => {
          if (height >= milestone.height && !achievedMilestonesRef.includes(milestone.height)) {
            currentScore += milestone.points
            setAchievedMilestones(prev => {
              if (!prev.includes(milestone.height)) {
                return [...prev, milestone.height]
              }
              return prev
            })
            setScore(currentScore)
          }
        })
      }

      // Star collection
      const updatedStars = [...stars]
      updatedStars.forEach((star, index) => {
        const dist = Math.sqrt(Math.pow(star.x - pos.x, 2) + Math.pow(star.y - pos.y, 2))
        if (dist < radius + star.size) {
          // Collect star
          let points = star.points
          // Bonus for collecting in wind
          if (windSpeed > 10) {
            points *= 2
          }
          currentScore += points
          currentStarsCollected++
          updatedStars.splice(index, 1)
          setScore(currentScore)
          setStarsCollected(currentStarsCollected)
        }
      })
      setStars(updatedStars)

      // Boundary collision
      if (pos.x - radius < 0) {
        vel.x *= -0.5
        pos.x = radius
      }
      if (pos.x + radius > canvas.width) {
        vel.x *= -0.5
        pos.x = canvas.width - radius
      }
      if (pos.y - radius < 0) {
        vel.y *= -0.5
        pos.y = radius
      }
      if (pos.y + radius > canvas.height) {
        vel.y *= -0.5
        pos.y = canvas.height - radius
        // Penalty for hitting ground
        currentScore = Math.max(0, currentScore - 10)
      }

      // Draw sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      skyGradient.addColorStop(0, '#1a1a2e')
      skyGradient.addColorStop(0.5, '#16213e')
      skyGradient.addColorStop(1, '#0f172a')
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw height milestones
      HEIGHT_MILESTONES.forEach(milestone => {
        const y = canvasHeight - milestone.height
        if (achievedMilestones.includes(milestone.height)) {
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
        }
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
        ctx.setLineDash([])
        if (!achievedMilestones.includes(milestone.height)) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
          ctx.font = '12px monospace'
          ctx.fillText(`${milestone.name} (${milestone.height}px)`, 10, y - 5)
        }
      })

      // Draw wind indicator
      if (windSpeed > 0) {
        ctx.strokeStyle = `rgba(147, 51, 234, ${0.3 + windSpeed / 40})`
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let i = 0; i < canvas.width; i += 30) {
          const y = 50 + Math.sin(i * 0.1 + currentTime * 0.001) * 10
          ctx.moveTo(i, y)
          ctx.lineTo(i + 10 * windDirection, y)
        }
        ctx.stroke()
      }

      // Draw stars
      updatedStars.forEach(star => {
        const twinkle = Math.sin(star.twinkle + currentTime * 0.005) * 0.3 + 0.7
        ctx.fillStyle = star.color
        ctx.globalAlpha = twinkle
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
        
        // Star glow
        ctx.shadowBlur = 10
        ctx.shadowColor = star.color
        ctx.fill()
        ctx.shadowBlur = 0
        
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(star.points, star.x, star.y + 3)
      })

      // Draw balloon shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.beginPath()
      ctx.ellipse(pos.x, canvasHeight - 20, radius * 0.6, radius * 0.2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Draw balloon
      const balloonColors = BALLOON_COLORS[balloonColor].gradient
      const balloonGradient = ctx.createRadialGradient(
        pos.x - radius * 0.3, pos.y - radius * 0.3, 0,
        pos.x, pos.y, radius
      )
      balloonGradient.addColorStop(0, balloonColors[0])
      balloonGradient.addColorStop(0.7, balloonColors[1])
      balloonGradient.addColorStop(1, '#c44569')
      ctx.fillStyle = balloonGradient
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.beginPath()
      ctx.arc(pos.x - radius * 0.3, pos.y - radius * 0.3, radius * 0.4, 0, Math.PI * 2)
      ctx.fill()

      // Draw string
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y + radius)
      ctx.lineTo(pos.x, pos.y + radius + 30)
      ctx.stroke()

      // Draw basket
      ctx.fillStyle = '#8b4513'
      ctx.fillRect(pos.x - 15, pos.y + radius + 30, 30, 20)
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 2
      ctx.strokeRect(pos.x - 15, pos.y + radius + 30, 30, 20)

      // Draw stats
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`Score: ${currentScore}`, 10, 20)
      ctx.fillText(`Height: ${Math.floor(height)}px`, 10, 40)
      ctx.fillText(`Stars: ${currentStarsCollected}`, 10, 60)
      ctx.fillText(`Wind Combo: ${currentWindCombo}x`, 10, 80)
      ctx.fillText(`Flight Time: ${flightTime}s`, 10, 100)

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
  }, [isRunning, gravity, windSpeed, windDirection, balloonSize, position, velocity, stars, score, maxHeight, achievedMilestones, starsCollected, windCombo, flightTime, currentHeight, balanceBonus, balloonColor])

  const reset = () => {
    setIsRunning(false)
    setScore(0)
    setMaxHeight(0)
    setStarsCollected(0)
    setStars([])
    setAchievedMilestones([])
    setWindCombo(0)
    setMaxWindCombo(0)
    setFlightTime(0)
    setBalanceBonus(0)
    setPosition({ x: 400, y: 200 })
    setVelocity({ x: 0, y: 0 })
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
          <h2 className="text-2xl font-bold text-gradient">🎈 Balloon Physics Game</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Level {level}</span>
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${xpProgress}%` }}></div>
            </div>
            <span className="text-purple-300 font-bold">High: {highScore}</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Use wind to control the balloon! Collect stars, reach heights, master wind combos!
        </p>
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 mb-4">
          <p className="text-xs text-gray-300">
            {currentPlanet.emoji} {currentPlanet.name} ({gravity.toFixed(2)} m/s²) | 
            Score: {score} | Height: {Math.floor(currentHeight)}px | 
            Stars: {starsCollected} | Wind Combo: {windCombo}x
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Wind Speed: {windSpeed.toFixed(1)} m/s
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={windSpeed}
            onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Wind Direction: {windDirection > 0 ? '→ Right' : '← Left'}
          </label>
          <button
            onClick={() => setWindDirection(windDirection * -1)}
            className="w-full px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-semibold"
          >
            {windDirection > 0 ? '→' : '←'} Switch
          </button>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Balloon Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {BALLOON_COLORS.map((color, index) => (
              <button
                key={index}
                onClick={() => {
                  setBalloonColor(index)
                  saveCustomization('balloon', { colorIndex: index })
                }}
                className={`w-8 h-8 rounded-full border-2 ${
                  balloonColor === index ? 'border-white' : 'border-gray-600'
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
        <div className="flex-1"></div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-white">
            <span className="text-gray-400">Score: </span>
            <span className="font-bold text-yellow-300">{score}</span>
          </div>
          <div className="text-white">
            <span className="text-gray-400">Max Height: </span>
            <span className="font-bold text-green-300">{Math.floor(maxHeight)}px</span>
          </div>
          <div className="text-white">
            <span className="text-gray-400">Stars: </span>
            <span className="font-bold text-purple-300">{starsCollected}</span>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-lg overflow-hidden border border-purple-500/30 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto"
          style={{ touchAction: 'none' }}
        />
        {!isRunning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="glass-effect rounded-lg p-4 border border-purple-500/30">
              <p className="text-white font-semibold text-center">
                Click Start to begin flying!
              </p>
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
