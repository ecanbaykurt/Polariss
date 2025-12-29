export default function SimpleModeToggle({ simpleMode, onToggle }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className={`text-sm ${simpleMode ? 'text-gray-400' : 'text-purple-300'}`}>
        Detailed
      </span>
      <button
        onClick={onToggle}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          simpleMode ? 'bg-purple-600' : 'bg-gray-600'
        }`}
        aria-label="Toggle simple mode"
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            simpleMode ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`text-sm font-semibold ${simpleMode ? 'text-purple-300' : 'text-gray-400'}`}>
        Simple
      </span>
      <span className="text-xs text-gray-500 ml-2">
        {simpleMode ? 'Easy to understand explanations' : 'Technical details'}
      </span>
    </div>
  )
}

