import { useState, useEffect } from 'react'

const UNIT_CATEGORIES = {
  length: {
    name: 'Length',
    icon: '📏',
    units: {
      m: { name: 'Meter (m)', toBase: 1 },
      km: { name: 'Kilometer (km)', toBase: 1000 },
      cm: { name: 'Centimeter (cm)', toBase: 0.01 },
      mm: { name: 'Millimeter (mm)', toBase: 0.001 },
      in: { name: 'Inch (in)', toBase: 0.0254 },
      ft: { name: 'Foot (ft)', toBase: 0.3048 },
      yd: { name: 'Yard (yd)', toBase: 0.9144 },
      mi: { name: 'Mile (mi)', toBase: 1609.344 },
      nmi: { name: 'Nautical Mile (nmi)', toBase: 1852 },
      au: { name: 'Astronomical Unit (AU)', toBase: 149597870700 },
      ly: { name: 'Light Year (ly)', toBase: 9.4607304725808e15 },
      pc: { name: 'Parsec (pc)', toBase: 3.08567758149137e16 }
    }
  },
  volume: {
    name: 'Volume',
    icon: '💧',
    units: {
      m3: { name: 'Cubic Meter (m³)', toBase: 1 },
      l: { name: 'Liter (L)', toBase: 0.001 },
      ml: { name: 'Milliliter (mL)', toBase: 0.000001 },
      gal: { name: 'US Gallon (gal)', toBase: 0.00378541 },
      'gal-uk': { name: 'UK Gallon (gal)', toBase: 0.00454609 },
      floz: { name: 'US Fluid Ounce (fl oz)', toBase: 0.0000295735 },
      cup: { name: 'US Cup (cup)', toBase: 0.000236588 },
      pt: { name: 'US Pint (pt)', toBase: 0.000473176 },
      qt: { name: 'US Quart (qt)', toBase: 0.000946353 },
      in3: { name: 'Cubic Inch (in³)', toBase: 0.0000163871 },
      ft3: { name: 'Cubic Foot (ft³)', toBase: 0.0283168 }
    }
  },
  pressure: {
    name: 'Pressure',
    icon: '🌡️',
    units: {
      pa: { name: 'Pascal (Pa)', toBase: 1 },
      kpa: { name: 'Kilopascal (kPa)', toBase: 1000 },
      mpa: { name: 'Megapascal (MPa)', toBase: 1000000 },
      bar: { name: 'Bar (bar)', toBase: 100000 },
      atm: { name: 'Atmosphere (atm)', toBase: 101325 },
      psi: { name: 'PSI (psi)', toBase: 6894.76 },
      torr: { name: 'Torr (torr)', toBase: 133.322 },
      mbar: { name: 'Millibar (mbar)', toBase: 100 }
    }
  },
  mass: {
    name: 'Mass',
    icon: '⚖️',
    units: {
      kg: { name: 'Kilogram (kg)', toBase: 1 },
      g: { name: 'Gram (g)', toBase: 0.001 },
      mg: { name: 'Milligram (mg)', toBase: 0.000001 },
      lb: { name: 'Pound (lb)', toBase: 0.453592 },
      oz: { name: 'Ounce (oz)', toBase: 0.0283495 },
      t: { name: 'Metric Ton (t)', toBase: 1000 },
      'short-ton': { name: 'US Ton (short ton)', toBase: 907.185 },
      'long-ton': { name: 'UK Ton (long ton)', toBase: 1016.05 }
    }
  },
  temperature: {
    name: 'Temperature',
    icon: '🌡️',
    units: {
      k: { name: 'Kelvin (K)', toBase: 1, offset: 0 },
      c: { name: 'Celsius (°C)', toBase: 1, offset: 273.15 },
      f: { name: 'Fahrenheit (°F)', toBase: 1, offset: 459.67 },
      r: { name: 'Rankine (°R)', toBase: 1, offset: 0 }
    },
    isTemperature: true
  },
  force: {
    name: 'Force',
    icon: '💪',
    units: {
      n: { name: 'Newton (N)', toBase: 1 },
      kn: { name: 'Kilonewton (kN)', toBase: 1000 },
      lbf: { name: 'Pound-force (lbf)', toBase: 4.44822 },
      kgf: { name: 'Kilogram-force (kgf)', toBase: 9.80665 },
      dyn: { name: 'Dyne (dyn)', toBase: 0.00001 }
    }
  },
  energy: {
    name: 'Energy',
    icon: '⚡',
    units: {
      j: { name: 'Joule (J)', toBase: 1 },
      kj: { name: 'Kilojoule (kJ)', toBase: 1000 },
      mj: { name: 'Megajoule (MJ)', toBase: 1000000 },
      cal: { name: 'Calorie (cal)', toBase: 4.184 },
      kcal: { name: 'Kilocalorie (kcal)', toBase: 4184 },
      btu: { name: 'BTU (BTU)', toBase: 1055.06 },
      kwh: { name: 'Kilowatt-hour (kWh)', toBase: 3600000 },
      ev: { name: 'Electron Volt (eV)', toBase: 1.602176634e-19 }
    }
  },
  power: {
    name: 'Power',
    icon: '🔋',
    units: {
      w: { name: 'Watt (W)', toBase: 1 },
      kw: { name: 'Kilowatt (kW)', toBase: 1000 },
      mw: { name: 'Megawatt (MW)', toBase: 1000000 },
      hp: { name: 'Horsepower (hp)', toBase: 745.7 },
      'hp-metric': { name: 'Metric Horsepower (PS)', toBase: 735.499 },
      btu_h: { name: 'BTU/hour (BTU/h)', toBase: 0.293071 }
    }
  },
  velocity: {
    name: 'Velocity',
    icon: '🚀',
    units: {
      'm/s': { name: 'Meter/Second (m/s)', toBase: 1 },
      'km/h': { name: 'Kilometer/Hour (km/h)', toBase: 0.277778 },
      'km/s': { name: 'Kilometer/Second (km/s)', toBase: 1000 },
      'mph': { name: 'Miles/Hour (mph)', toBase: 0.44704 },
      'ft/s': { name: 'Feet/Second (ft/s)', toBase: 0.3048 },
      'knot': { name: 'Knot (kn)', toBase: 0.514444 },
      'c': { name: 'Speed of Light (c)', toBase: 299792458 }
    }
  },
  acceleration: {
    name: 'Acceleration',
    icon: '📈',
    units: {
      'm/s2': { name: 'Meter/Second² (m/s²)', toBase: 1 },
      'km/h2': { name: 'Kilometer/Hour² (km/h²)', toBase: 0.0000771605 },
      'ft/s2': { name: 'Feet/Second² (ft/s²)', toBase: 0.3048 },
      'g': { name: 'Standard Gravity (g)', toBase: 9.80665 }
    }
  },
  angle: {
    name: 'Angle',
    icon: '📐',
    units: {
      deg: { name: 'Degree (°)', toBase: 1 },
      rad: { name: 'Radian (rad)', toBase: 57.2958 },
      grad: { name: 'Gradian (grad)', toBase: 0.9 },
      arcmin: { name: 'Arcminute (arcmin)', toBase: 0.0166667 },
      arcsec: { name: 'Arcsecond (arcsec)', toBase: 0.000277778 }
    }
  }
}

export default function MeasurementConverter() {
  const [activeCategory, setActiveCategory] = useState('length')
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('km')
  const [showDetails, setShowDetails] = useState(false)
  const [singleResult, setSingleResult] = useState(null)
  const [allResults, setAllResults] = useState({})

  const category = UNIT_CATEGORIES[activeCategory]
  const isTemperature = category?.isTemperature

  // Update fromUnit and toUnit when category changes
  useEffect(() => {
    if (category && Object.keys(category.units).length > 0) {
      const unitKeys = Object.keys(category.units)
      setFromUnit(unitKeys[0])
      setToUnit(unitKeys.length > 1 ? unitKeys[1] : unitKeys[0])
      setValue('')
      setSingleResult(null)
      setAllResults({})
      setShowDetails(false)
    }
  }, [activeCategory])

  useEffect(() => {
    // Kategori değiştiğinde önce unit'ler güncellensin, sonra convert çağrılsın
    if (!category || !category.units) {
      setSingleResult(null)
      setAllResults({})
      return
    }

    // fromUnit ve toUnit'in yeni kategoride geçerli olduğundan emin ol
    if (!category.units[fromUnit] || !category.units[toUnit]) {
      setSingleResult(null)
      setAllResults({})
      return
    }

    if (value && !isNaN(parseFloat(value))) {
      convert()
    } else {
      setSingleResult(null)
      setAllResults({})
    }
  }, [value, fromUnit, toUnit, activeCategory, showDetails, category])

  const convert = () => {
    // Güvenlik kontrolleri
    if (!category || !category.units) {
      setSingleResult(null)
      setAllResults({})
      return
    }

    const inputValue = parseFloat(value)
    if (isNaN(inputValue)) {
      setSingleResult(null)
      setAllResults({})
      return
    }

    const units = category.units
    const fromUnitData = units[fromUnit]
    const toUnitData = units[toUnit]

    // fromUnit veya toUnit yeni kategoride geçerli değilse
    if (!fromUnitData || !toUnitData) {
      setSingleResult(null)
      setAllResults({})
      return
    }

    let convertedValue

    if (isTemperature) {
      // Temperature conversion is special
      let kelvin
      if (fromUnit === 'k') kelvin = inputValue
      else if (fromUnit === 'c') kelvin = inputValue + 273.15
      else if (fromUnit === 'f') kelvin = (inputValue - 32) * 5/9 + 273.15
      else if (fromUnit === 'r') kelvin = inputValue * 5/9

      if (toUnit === 'k') convertedValue = kelvin
      else if (toUnit === 'c') convertedValue = kelvin - 273.15
      else if (toUnit === 'f') convertedValue = (kelvin - 273.15) * 9/5 + 32
      else if (toUnit === 'r') convertedValue = kelvin * 9/5
    } else {
      // Standard conversion
      const baseValue = inputValue * fromUnitData.toBase
      convertedValue = baseValue / toUnitData.toBase
    }

    setSingleResult({
      value: convertedValue,
      fromUnit: fromUnitData.name,
      toUnit: toUnitData.name
    })

    // Calculate all results for details view
    if (showDetails) {
      const newResults = {}
      if (isTemperature) {
        let kelvin
        if (fromUnit === 'k') kelvin = inputValue
        else if (fromUnit === 'c') kelvin = inputValue + 273.15
        else if (fromUnit === 'f') kelvin = (inputValue - 32) * 5/9 + 273.15
        else if (fromUnit === 'r') kelvin = inputValue * 5/9

        Object.keys(units).forEach(unitKey => {
          let converted
          if (unitKey === 'k') converted = kelvin
          else if (unitKey === 'c') converted = kelvin - 273.15
          else if (unitKey === 'f') converted = (kelvin - 273.15) * 9/5 + 32
          else if (unitKey === 'r') converted = kelvin * 9/5
          newResults[unitKey] = converted.toFixed(2)
        })
      } else {
        const baseValue = inputValue * fromUnitData.toBase
        Object.keys(units).forEach(unitKey => {
          const unitData = units[unitKey]
          const converted = baseValue / unitData.toBase
          newResults[unitKey] = converted.toFixed(6)
        })
      }
      setAllResults(newResults)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const formatNumber = (num) => {
    const n = parseFloat(num)
    if (Math.abs(n) >= 1e12) return n.toExponential(3)
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(3) + 'M'
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(3) + 'K'
    if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(3)
    return parseFloat(num).toFixed(6)
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-gradient mb-4">Select Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.keys(UNIT_CATEGORIES).map(catKey => {
            const cat = UNIT_CATEGORIES[catKey]
            return (
              <button
                key={catKey}
                onClick={() => {
                  setActiveCategory(catKey)
                }}
                className={`p-4 rounded-lg transition-all border ${
                  activeCategory === catKey
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500 shadow-lg shadow-purple-500/50'
                    : 'glass-effect text-gray-300 hover:text-white border-white/10 hover:border-purple-500/30'
                }`}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="text-sm font-semibold">{cat.name}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Converter */}
      {category && category.units && (
        <div className="glass-effect rounded-2xl p-6 md:p-8 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gradient">{category.name} Converter</h2>
              <p className="text-sm text-gray-400">Convert between {category.name.toLowerCase()} units</p>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-purple-300 mb-2 text-sm font-semibold">
              From Unit
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {Object.keys(category.units).map(unitKey => (
                <option key={unitKey} value={unitKey}>
                  {category.units[unitKey].name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-purple-300 mb-2 text-sm font-semibold">
              To Unit
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {Object.keys(category.units).map(unitKey => (
                <option key={unitKey} value={unitKey}>
                  {category.units[unitKey].name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-purple-300 mb-2 text-sm font-semibold">
              Value
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Single Result */}
        {singleResult && (
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Result:</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">
                    {formatNumber(singleResult.value)}
                  </span>
                  <span className="text-lg text-purple-300">
                    {singleResult.toUnit.split('(')[0].trim()}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {value} {singleResult.fromUnit.split('(')[0].trim()} = {formatNumber(singleResult.value)} {singleResult.toUnit.split('(')[0].trim()}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(singleResult.value.toString())}
                className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-sm font-semibold transition-all border border-purple-500/30"
              >
                Copy
              </button>
            </div>
            {!showDetails && (
              <button
                onClick={() => setShowDetails(true)}
                className="text-sm text-purple-300 hover:text-purple-200 underline"
              >
                Show all conversions →
              </button>
            )}
          </div>
        )}

        {/* Detailed Results */}
        {showDetails && Object.keys(allResults).length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">All Conversions:</p>
              <button
                onClick={() => setShowDetails(false)}
                className="text-sm text-purple-300 hover:text-purple-200 underline"
              >
                Hide details
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.keys(category.units).map(unitKey => {
                if (unitKey === fromUnit) return null
                const unitData = category.units[unitKey]
                const resultValue = allResults[unitKey]
                return (
                  <div
                    key={unitKey}
                    onClick={() => copyToClipboard(resultValue)}
                    className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="text-gray-400 text-xs mb-1">{unitData.name.split('(')[0].trim()}</div>
                    <div className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {formatNumber(resultValue)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to copy
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  )
}

