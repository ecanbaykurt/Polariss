// Game Utilities - Shared across all games

// Score and Leaderboard Management
export const saveScore = (gameType, mode, score, metadata = {}) => {
  const scores = getScores(gameType, mode)
  const newScore = {
    score,
    date: new Date().toISOString(),
    ...metadata
  }
  scores.push(newScore)
  scores.sort((a, b) => b.score - a.score) // Sort descending
  scores.splice(100) // Keep top 100
  localStorage.setItem(`game_scores_${gameType}_${mode}`, JSON.stringify(scores))
  return newScore
}

export const getScores = (gameType, mode) => {
  const stored = localStorage.getItem(`game_scores_${gameType}_${mode}`)
  return stored ? JSON.parse(stored) : []
}

export const getHighScore = (gameType, mode) => {
  const scores = getScores(gameType, mode)
  return scores.length > 0 ? scores[0].score : 0
}

// Achievement System
export const ACHIEVEMENTS = {
  // Ball Bounce Game
  BOUNCE_100: { id: 'bounce_100', name: 'Bounce Master', desc: 'Reach 100 bounces', icon: '⚽' },
  BOUNCE_500: { id: 'bounce_500', name: 'Bounce Legend', desc: 'Reach 500 bounces', icon: '⚽' },
  COMBO_10: { id: 'combo_10', name: 'Combo Master', desc: 'Achieve 10x combo', icon: '🔥' },
  TARGET_50: { id: 'target_50', name: 'Sharp Shooter', desc: 'Hit 50 targets', icon: '🎯' },
  SCORE_10000: { id: 'score_10000', name: 'High Scorer', desc: 'Score 10,000 points', icon: '⭐' },
  
  // Balloon Game
  HEIGHT_300: { id: 'height_300', name: 'Sky High', desc: 'Reach 300px height', icon: '🎈' },
  COLLECT_100: { id: 'collect_100', name: 'Star Collector', desc: 'Collect 100 stars', icon: '⭐' },
  WIND_MASTER: { id: 'wind_master', name: 'Wind Master', desc: 'Master wind control', icon: '💨' },
  
  // Jumper Game
  JUMPER_100: { id: 'jumper_100', name: 'Jumper Novice', desc: 'Score 100 points', icon: '🦘' },
  JUMPER_500: { id: 'jumper_500', name: 'Jumper Master', desc: 'Reach 500m height', icon: '🦘' },
  
  // General
  PLAY_10: { id: 'play_10', name: 'Dedicated Player', desc: 'Play 10 games', icon: '🎮' },
  LEVEL_10: { id: 'level_10', name: 'Level Up', desc: 'Reach level 10', icon: '📈' }
}

export const unlockAchievement = (achievementId) => {
  const unlocked = getUnlockedAchievements()
  if (!unlocked.includes(achievementId)) {
    unlocked.push(achievementId)
    localStorage.setItem('game_achievements', JSON.stringify(unlocked))
    return true
  }
  return false
}

export const getUnlockedAchievements = () => {
  const stored = localStorage.getItem('game_achievements')
  return stored ? JSON.parse(stored) : []
}

// Level and XP System
export const addXP = (amount) => {
  const currentXP = getXP()
  const currentLevel = getLevel()
  const newXP = currentXP + amount
  const newLevel = calculateLevel(newXP)
  
  localStorage.setItem('game_xp', newXP.toString())
  
  // Level up notification
  if (newLevel > currentLevel) {
    localStorage.setItem('game_level', newLevel.toString())
    return { leveledUp: true, oldLevel: currentLevel, newLevel, xpGained: amount }
  }
  
  return { leveledUp: false, xpGained: amount }
}

export const getXP = () => {
  return parseInt(localStorage.getItem('game_xp') || '0')
}

export const getLevel = () => {
  return parseInt(localStorage.getItem('game_level') || '1')
}

export const calculateLevel = (xp) => {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export const getXPForNextLevel = (currentLevel) => {
  return Math.pow(currentLevel, 2) * 100
}

export const getXPProgress = () => {
  const xp = getXP()
  const level = getLevel()
  const xpForNext = getXPForNextLevel(level)
  const xpForCurrent = getXPForNextLevel(level - 1)
  const progress = ((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100
  return Math.max(0, Math.min(100, progress))
}

// Customization
export const saveCustomization = (gameType, customization) => {
  localStorage.setItem(`game_customization_${gameType}`, JSON.stringify(customization))
}

export const getCustomization = (gameType, defaultCustomization) => {
  const stored = localStorage.getItem(`game_customization_${gameType}`)
  return stored ? JSON.parse(stored) : defaultCustomization
}

// Game Stats
export const incrementPlayCount = () => {
  const count = getPlayCount()
  localStorage.setItem('game_play_count', (count + 1).toString())
  return count + 1
}

export const getPlayCount = () => {
  return parseInt(localStorage.getItem('game_play_count') || '0')
}

