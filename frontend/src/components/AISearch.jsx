import { useState } from 'react'

export default function AISearch({ selectedStar, selectedPlanet }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const context = {}
      if (selectedStar) {
        context.star = {
          name: selectedStar.name,
          distance_ly: selectedStar.distance_ly || null,
          magnitude: selectedStar.magnitude || null,
          spectral_type: selectedStar.spectral_type || null
        }
      }
      if (selectedPlanet) {
        context.planet = selectedPlanet
      }

      const response = await fetch('http://localhost:5000/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, context })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResults(data)
      }
    } catch (err) {
      console.error('AI Search error:', err)
      setError(err.message || 'Failed to fetch AI results. Make sure the API server is running and OPENAI_API_KEY is set.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="glass-effect rounded-2xl p-6 border border-purple-500/30 mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          🤖 AI Research Assistant
        </h2>
        <p className="text-sm text-gray-400">
          Ask questions about space, astronomy, aerospace engineering, and material science
        </p>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask: How long to reach Sirius? Latest research on exoplanets? Materials for space travel?"
          className="flex-1 px-4 py-3 rounded-lg glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔍 Searching...' : '🔍 Search'}
        </button>
      </div>

      {selectedStar && (
        <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-xs text-gray-300">
            💡 Context: Searching with <strong>{selectedStar.name}</strong> selected
            {selectedStar.distance_ly && ` (${selectedStar.distance_ly.toFixed(2)} ly away)`}
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <h3 className="text-lg font-bold text-white mb-2">📝 Answer</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {results.answer}
            </p>
          </div>

          {results.travel_time && (
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h3 className="text-lg font-bold text-white mb-2">🚀 Travel Time</h3>
              <p className="text-gray-300 text-sm">{results.travel_time}</p>
            </div>
          )}

          {results.latest_research && (
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <h3 className="text-lg font-bold text-white mb-2">🔬 Latest Research</h3>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{results.latest_research}</p>
            </div>
          )}

          {results.material_science && (
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-2">🧪 Material Science</h3>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{results.material_science}</p>
            </div>
          )}

          {results.aerospace_insights && (
            <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <h3 className="text-lg font-bold text-white mb-2">✈️ Aerospace Insights</h3>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{results.aerospace_insights}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

