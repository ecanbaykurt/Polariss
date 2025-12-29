import StarBackground from '../components/StarBackground'

export default function About() {
  return (
    <div className="min-h-screen bg-space-dark relative overflow-hidden">
      <StarBackground />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-gradient">
              About
            </h1>
            <p className="text-xl text-purple-300 mb-8">
              Learn about Polaris Distance Tracker
            </p>
          </div>

          <AboutContent />
        </main>
      </div>
    </div>
  )
}

function AboutContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-effect rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gradient">About Polaris Distance Tracker</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            Polaris Distance Tracker is a high-precision astronomical distance calculation system 
            that tracks the distance to Polaris (the North Star) and other prominent stars in real-time.
          </p>
          <p>
            This tool uses NASA-standard calculations with data from GAIA EDR3, Hipparcos, and SIMBAD 
            catalogs to provide accurate distance measurements with uncertainties.
          </p>
          <p>
            The system calculates historical distances using radial velocity integration, allowing you 
            to see how far Polaris was from Earth at any point in time from 3200 BC to the present.
          </p>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gradient">Standards & Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">Reference Frame</h3>
            <p className="text-gray-300">ICRS (International Celestial Reference System)</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">Epoch</h3>
            <p className="text-gray-300">J2000.0</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">Precision</h3>
            <p className="text-gray-300">Up to 10¹⁸ decimal places</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-purple-300 mb-3">Data Sources</h3>
            <p className="text-gray-300">GAIA EDR3, Hipparcos, SIMBAD</p>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gradient">For Creatives</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            This platform is designed to be a helpful resource for artists, writers, game developers, 
            and other creatives working on space-themed projects. The interactive calculators and 
            visualizations can help you:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Understand astronomical scales and distances</li>
            <li>Calculate travel times and distances for science fiction</li>
            <li>Visualize stellar motion and proper motion</li>
            <li>Access accurate star data for world-building</li>
            <li>Create scientifically accurate space environments</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

