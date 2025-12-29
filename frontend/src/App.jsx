import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Data from './pages/Data'
import Games from './pages/Games'
import About from './pages/About'
import Calculators from './pages/Calculators'
import Resources from './pages/Resources'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-space-dark relative overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/data" replace />} />
          <Route path="/data" element={<Data />} />
          <Route path="/games" element={<Games />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
