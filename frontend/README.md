# Polaris Distance Tracker - Frontend

Modern, high-performance frontend for visualizing Polaris distance data with high precision.

## 🚀 Features

- **Space-Themed Design**: Beautiful space-themed UI with animated starfield
- **Interactive Charts**: Chart.js powered visualizations for 10-year and 100-year intervals
- **High Performance**: Built with Vite + React for optimal performance
- **Responsive Design**: Tailwind CSS for mobile-first responsive layout
- **Real-time Data**: Loads and visualizes JSON data from high-precision calculations

## 🛠️ Tech Stack

- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Beautiful, responsive charts
- **React Chart.js 2** - React wrapper for Chart.js

## 📦 Installation

```bash
cd frontend
npm install
```

## 🎯 Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🏗️ Build

```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── DistanceChart.jsx    # Main chart component
│   │   ├── Header.jsx           # Navigation header
│   │   ├── StarBackground.jsx   # Animated starfield
│   │   └── StatsCard.jsx        # Statistics cards
│   ├── App.jsx                  # Main application
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/
│   ├── polaris_100years.json    # 100-year interval data
│   └── polaris_10years.json     # 10-year interval data
└── package.json
```

## 🎨 Design Features

- **Space Theme**: Dark space background with starfield animation
- **Gradient Effects**: Purple-to-pink gradients inspired by Space Apps Contest
- **Glass Morphism**: Modern glass-effect cards
- **Smooth Animations**: Floating elements and sparkle effects
- **Responsive Charts**: Interactive, zoomable distance charts

## 📊 Data Visualization

- **100-Year Intervals**: 54 data points from 2025 AD to 3200 BC
- **10-Year Intervals**: 524 data points for detailed analysis
- **Statistics**: Min, max, and average distance calculations
- **Precision Display**: Shows high precision (up to 10^18)

## 🌟 Standards

- ICRS Reference Frame
- J2000.0 Epoch
- CODATA 2018 / IAU 2012 Constants
- Uncertainty Propagation
- Data Provenance Tracking

