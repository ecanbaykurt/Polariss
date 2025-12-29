import { useState, useEffect } from 'react'

const galaxyAndPlanetNames = [
  // Galaxies
  'Andromeda Galaxy',
  'Milky Way',
  'Whirlpool Galaxy',
  'Sombrero Galaxy',
  'Pinwheel Galaxy',
  'Black Eye Galaxy',
  'Cartwheel Galaxy',
  'Cigar Galaxy',
  'Triangulum Galaxy',
  
  // Planets
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
  'Proxima Centauri b',
  'Kepler-452b',
  'HD 209458 b',
  '51 Pegasi b',
  'TRAPPIST-1',
  'Gliese 581g',
  
  // Stars (for variety)
  'Sirius',
  'Vega',
  'Betelgeuse',
  'Rigel',
  'Antares'
]

export default function AnimatedPlaceholder({ isFocused, searchTerm }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    // Don't animate if input is focused or has text
    if (isFocused || searchTerm) {
      setDisplayText('')
      return
    }

    const currentName = galaxyAndPlanetNames[currentIndex]
    let timeoutId

    if (isTyping) {
      // Typing animation
      if (displayText.length < currentName.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentName.slice(0, displayText.length + 1))
        }, 100)
      } else {
        // Finished typing, wait then start deleting
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      // Deleting animation
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 50)
      } else {
        // Finished deleting, move to next name
        setIsTyping(true)
        setCurrentIndex((prev) => (prev + 1) % galaxyAndPlanetNames.length)
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [displayText, isTyping, currentIndex, isFocused, searchTerm])

  if (isFocused || searchTerm) {
    return null
  }

  return (
    <span className="text-gray-300">
      🔍 Search for{' '}
      <span className="text-purple-300 font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {displayText}
        <span className="inline-block w-0.5 h-5 bg-purple-400 ml-1 animate-pulse align-middle"></span>
      </span>
    </span>
  )
}

