import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="py-6 px-4 relative z-20">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src="/polaris-logo.png" 
            alt="Polaris Logo" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-white">Polaris</h2>
            <p className="text-xs text-gray-400">Distance Tracker</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link 
            to="/data" 
            className={`transition-colors ${
              isActive('/data') 
                ? 'text-white font-semibold border-b-2 border-purple-500' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Data
          </Link>
          <Link 
            to="/games" 
            className={`transition-colors ${
              isActive('/games') 
                ? 'text-white font-semibold border-b-2 border-purple-500' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Games
          </Link>
          <Link 
            to="/calculators" 
            className={`transition-colors ${
              isActive('/calculators') 
                ? 'text-white font-semibold border-b-2 border-purple-500' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Calculators
          </Link>
          <Link 
            to="/resources" 
            className={`transition-colors ${
              isActive('/resources') 
                ? 'text-white font-semibold border-b-2 border-purple-500' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Resources
          </Link>
          <Link 
            to="/about" 
            className={`transition-colors ${
              isActive('/about') 
                ? 'text-white font-semibold border-b-2 border-purple-500' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}

