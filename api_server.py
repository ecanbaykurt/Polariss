"""
Polaris Real-Time API Server
Provides live distance calculations for frontend
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timezone
from decimal import Decimal, getcontext
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import OpenAI, but make it optional
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY')) if os.getenv('OPENAI_API_KEY') else None
except ImportError:
    OPENAI_AVAILABLE = False
    client = None

# Import from polaris.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from polaris import POLARIS, calculate_distance_high_precision, KM_PER_LIGHT_YEAR, DAYS_PER_YEAR, SECONDS_PER_DAY, Star

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Popular Stars Database - 20 most famous stars
POPULAR_STARS = [
    Star(name="Sirius", catalog_id="HIP 32349", distance_ly=8.66, radial_velocity_km_s=-5.50,
         distance_ly_uncertainty=0.01, ra_hours=6.752481, dec_degrees=-16.716116,
         proper_motion_ra_mas_yr=-546.05, proper_motion_dec_mas_yr=-1223.14,
         spectral_type="A1V", magnitude=-1.46),
    Star(name="Canopus", catalog_id="HIP 30438", distance_ly=310.0, radial_velocity_km_s=20.5,
         distance_ly_uncertainty=5.0, ra_hours=6.399198, dec_degrees=-52.695661,
         proper_motion_ra_mas_yr=19.93, proper_motion_dec_mas_yr=23.24,
         spectral_type="F0II", magnitude=-0.74),
    Star(name="Alpha Centauri A", catalog_id="HIP 71683", distance_ly=4.37, radial_velocity_km_s=-21.6,
         distance_ly_uncertainty=0.01, ra_hours=14.660766, dec_degrees=-60.835154,
         proper_motion_ra_mas_yr=-3679.25, proper_motion_dec_mas_yr=473.67,
         spectral_type="G2V", magnitude=0.01),
    Star(name="Arcturus", catalog_id="HIP 69673", distance_ly=36.7, radial_velocity_km_s=-5.19,
         distance_ly_uncertainty=0.3, ra_hours=14.261272, dec_degrees=19.182409,
         proper_motion_ra_mas_yr=-1093.45, proper_motion_dec_mas_yr=-1999.40,
         spectral_type="K1.5III", magnitude=-0.05),
    Star(name="Vega", catalog_id="HIP 91262", distance_ly=25.04, radial_velocity_km_s=-13.9,
         distance_ly_uncertainty=0.07, ra_hours=18.615649, dec_degrees=38.783693,
         proper_motion_ra_mas_yr=200.94, proper_motion_dec_mas_yr=286.23,
         spectral_type="A0V", magnitude=0.03),
    Star(name="Capella", catalog_id="HIP 24608", distance_ly=42.9, radial_velocity_km_s=29.8,
         distance_ly_uncertainty=0.5, ra_hours=5.278151, dec_degrees=45.997991,
         proper_motion_ra_mas_yr=75.52, proper_motion_dec_mas_yr=-426.86,
         spectral_type="G5III+G0III", magnitude=0.08),
    Star(name="Rigel", catalog_id="HIP 24436", distance_ly=860.0, radial_velocity_km_s=20.7,
         distance_ly_uncertainty=50.0, ra_hours=5.242298, dec_degrees=-8.201694,
         proper_motion_ra_mas_yr=1.87, proper_motion_dec_mas_yr=-0.56,
         spectral_type="B8Ia", magnitude=0.13),
    Star(name="Procyon", catalog_id="HIP 37279", distance_ly=11.46, radial_velocity_km_s=-3.2,
         distance_ly_uncertainty=0.05, ra_hours=7.655026, dec_degrees=5.224988,
         proper_motion_ra_mas_yr=-714.59, proper_motion_dec_mas_yr=-1036.80,
         spectral_type="F5IV-V", magnitude=0.38),
    Star(name="Betelgeuse", catalog_id="HIP 27989", distance_ly=640.0, radial_velocity_km_s=21.91,
         distance_ly_uncertainty=100.0, ra_hours=5.919531, dec_degrees=7.407063,
         proper_motion_ra_mas_yr=27.33, proper_motion_dec_mas_yr=10.86,
         spectral_type="M1-M2Ia-Iab", magnitude=0.50),
    Star(name="Achernar", catalog_id="HIP 7588", distance_ly=139.0, radial_velocity_km_s=16.0,
         distance_ly_uncertainty=2.0, ra_hours=1.628567, dec_degrees=-57.236757,
         proper_motion_ra_mas_yr=87.00, proper_motion_dec_mas_yr=-38.24,
         spectral_type="B6Vep", magnitude=0.46),
    Star(name="Hadar", catalog_id="HIP 68702", distance_ly=390.0, radial_velocity_km_s=-22.3,
         distance_ly_uncertainty=20.0, ra_hours=14.063798, dec_degrees=-60.373039,
         proper_motion_ra_mas_yr=-33.96, proper_motion_dec_mas_yr=-23.67,
         spectral_type="B1III", magnitude=0.61),
    Star(name="Altair", catalog_id="HIP 97649", distance_ly=16.73, radial_velocity_km_s=-26.1,
         distance_ly_uncertainty=0.05, ra_hours=19.846309, dec_degrees=8.868322,
         proper_motion_ra_mas_yr=536.82, proper_motion_dec_mas_yr=385.54,
         spectral_type="A7V", magnitude=0.76),
    Star(name="Spica", catalog_id="HIP 65474", distance_ly=262.0, radial_velocity_km_s=1.0,
         distance_ly_uncertainty=5.0, ra_hours=13.419883, dec_degrees=-11.161322,
         proper_motion_ra_mas_yr=-42.50, proper_motion_dec_mas_yr=-31.73,
         spectral_type="B1III-IV+B2V", magnitude=0.98),
    Star(name="Antares", catalog_id="HIP 80763", distance_ly=550.0, radial_velocity_km_s=-3.4,
         distance_ly_uncertainty=30.0, ra_hours=16.490132, dec_degrees=-26.432002,
         proper_motion_ra_mas_yr=-12.11, proper_motion_dec_mas_yr=-23.30,
         spectral_type="M1.5Iab-Ib", magnitude=1.06),
    Star(name="Pollux", catalog_id="HIP 37826", distance_ly=33.78, radial_velocity_km_s=3.23,
         distance_ly_uncertainty=0.09, ra_hours=7.755381, dec_degrees=28.026199,
         proper_motion_ra_mas_yr=-625.69, proper_motion_dec_mas_yr=-45.95,
         spectral_type="K0III", magnitude=1.14),
    Star(name="Fomalhaut", catalog_id="HIP 113368", distance_ly=25.13, radial_velocity_km_s=6.5,
         distance_ly_uncertainty=0.09, ra_hours=22.960838, dec_degrees=-29.622237,
         proper_motion_ra_mas_yr=328.95, proper_motion_dec_mas_yr=-164.67,
         spectral_type="A3V", magnitude=1.16),
    Star(name="Deneb", catalog_id="HIP 102098", distance_ly=2615.0, radial_velocity_km_s=-4.7,
         distance_ly_uncertainty=215.0, ra_hours=20.690533, dec_degrees=45.280338,
         proper_motion_ra_mas_yr=1.99, proper_motion_dec_mas_yr=1.95,
         spectral_type="A2Ia", magnitude=1.25),
    Star(name="Regulus", catalog_id="HIP 49669", distance_ly=79.3, radial_velocity_km_s=5.9,
         distance_ly_uncertainty=0.7, ra_hours=10.139589, dec_degrees=11.967209,
         proper_motion_ra_mas_yr=-249.40, proper_motion_dec_mas_yr=4.91,
         spectral_type="B7V", magnitude=1.36),
    Star(name="Adhara", catalog_id="HIP 33579", distance_ly=430.0, radial_velocity_km_s=27.3,
         distance_ly_uncertainty=20.0, ra_hours=6.977088, dec_degrees=-28.972083,
         proper_motion_ra_mas_yr=2.63, proper_motion_dec_mas_yr=2.29,
         spectral_type="B2II", magnitude=1.50),
    Star(name="Castor", catalog_id="HIP 36850", distance_ly=51.55, radial_velocity_km_s=5.2,
         distance_ly_uncertainty=0.19, ra_hours=7.576640, dec_degrees=31.888316,
         proper_motion_ra_mas_yr=-206.33, proper_motion_dec_mas_yr=-148.18,
         spectral_type="A1V+A2Vm", magnitude=1.58)
]

@app.route('/api/current-distance', methods=['GET'])
def get_current_distance():
    """Get current real-time distance to Polaris"""
    try:
        # Calculate current distance (0 years ago = current)
        distance, precision = calculate_distance_high_precision(POLARIS, 0, max_precision=18)
        
        # Get current time
        now = datetime.now(timezone.utc)
        
        # Calculate distance change per second for animation
        distance_change_per_second = POLARIS.radial_velocity_km_s * SECONDS_PER_DAY / float(KM_PER_LIGHT_YEAR) / 86400
        
        response = {
            "distance_ly": distance,
            "distance_km": float(Decimal(str(distance)) * KM_PER_LIGHT_YEAR),
            "distance_au": float(Decimal(str(distance)) * Decimal('63241.077')),  # 1 ly = 63241.077 AU
            "distance_parsec": float(Decimal(str(distance)) / Decimal('3.261563777167433')),
            "precision": precision,
            "timestamp": now.isoformat(),
            "radial_velocity_km_s": POLARIS.radial_velocity_km_s,
            "movement_direction": "away" if POLARIS.radial_velocity_km_s > 0 else "toward",
            "distance_change_per_second_ly": distance_change_per_second,
            "distance_change_per_hour_ly": distance_change_per_second * 3600,
            "distance_change_per_day_ly": distance_change_per_second * 86400,
            "uncertainty_ly": POLARIS.distance_ly_uncertainty
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/popular-stars', methods=['GET'])
def get_popular_stars():
    """Get data for 20 popular stars"""
    try:
        stars_data = []
        for star in POPULAR_STARS:
            distance, precision = calculate_distance_high_precision(star, 0, max_precision=18)
            stars_data.append({
                "name": star.name,
                "catalog_id": star.catalog_id,
                "distance_ly": distance,
                "distance_km": float(Decimal(str(distance)) * KM_PER_LIGHT_YEAR),
                "distance_au": float(Decimal(str(distance)) * Decimal('63241.077')),
                "distance_parsec": float(Decimal(str(distance)) / Decimal('3.261563777167433')),
                "radial_velocity_km_s": star.radial_velocity_km_s,
                "movement_direction": "away" if star.radial_velocity_km_s > 0 else "toward",
                "distance_ly_uncertainty": star.distance_ly_uncertainty,
                "ra_hours": star.ra_hours,
                "dec_degrees": star.dec_degrees,
                "spectral_type": star.spectral_type,
                "magnitude": star.magnitude,
                "proper_motion_ra_mas_yr": star.proper_motion_ra_mas_yr,
                "proper_motion_dec_mas_yr": star.proper_motion_dec_mas_yr
            })
        
        return jsonify({"stars": stars_data, "count": len(stars_data)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/star/<star_name>', methods=['GET'])
def get_star_info(star_name):
    """Get detailed info for a specific star"""
    try:
        star = None
        for s in POPULAR_STARS:
            if s.name.lower() == star_name.lower():
                star = s
                break
        
        if not star and star_name.lower() == "polaris":
            star = POLARIS
        
        if not star:
            return jsonify({"error": "Star not found"}), 404
        
        distance, precision = calculate_distance_high_precision(star, 0, max_precision=18)
        
        response = {
            "name": star.name,
            "catalog_id": star.catalog_id,
            "distance_ly": distance,
            "distance_km": float(Decimal(str(distance)) * KM_PER_LIGHT_YEAR),
            "distance_au": float(Decimal(str(distance)) * Decimal('63241.077')),
            "distance_parsec": float(Decimal(str(distance)) / Decimal('3.261563777167433')),
            "radial_velocity_km_s": star.radial_velocity_km_s,
            "movement_direction": "away" if star.radial_velocity_km_s > 0 else "toward",
            "distance_ly_uncertainty": star.distance_ly_uncertainty,
            "ra_hours": star.ra_hours,
            "dec_degrees": star.dec_degrees,
            "spectral_type": star.spectral_type,
            "magnitude": star.magnitude,
            "proper_motion_ra_mas_yr": star.proper_motion_ra_mas_yr,
            "proper_motion_dec_mas_yr": star.proper_motion_dec_mas_yr
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai-search', methods=['POST'])
def ai_search():
    """AI-powered search for space, astronomy, aerospace information"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        context = data.get('context', {})  # Can include star/planet info
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        if not OPENAI_AVAILABLE or not client:
            # Fallback response if OpenAI is not available
            return jsonify({
                "answer": "AI search is not available. Please set OPENAI_API_KEY environment variable.",
                "sources": [],
                "travel_time": None,
                "latest_research": None
            })
        
        # Build context-aware prompt
        system_prompt = """You are an expert AI assistant specialized in astronomy, space exploration, aerospace engineering, and material science. 
Provide accurate, detailed, and up-to-date information. When answering questions about celestial bodies:
- Calculate travel time using current propulsion technology (if applicable)
- Mention latest research findings
- Include relevant material science information for space applications
- Provide aerospace engineering insights
- Be specific about distances, times, and scientific facts"""
        
        user_prompt = f"""Query: {query}
        
Context: {json.dumps(context, indent=2) if context else 'None'}

Please provide:
1. A comprehensive answer
2. Travel time calculation (if applicable) - how many days/years would it take with current technology
3. Latest research findings (2020-2024)
4. Relevant material science considerations for space applications
5. Aerospace engineering insights

Format your response as JSON with keys: answer, travel_time, latest_research, material_science, aerospace_insights"""
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        answer_text = response.choices[0].message.content
        
        # Try to parse JSON response, fallback to plain text
        try:
            answer_data = json.loads(answer_text)
        except:
            answer_data = {
                "answer": answer_text,
                "travel_time": None,
                "latest_research": None,
                "material_science": None,
                "aerospace_insights": None
            }
        
        return jsonify({
            "answer": answer_data.get("answer", answer_text),
            "travel_time": answer_data.get("travel_time"),
            "latest_research": answer_data.get("latest_research"),
            "material_science": answer_data.get("material_science"),
            "aerospace_insights": answer_data.get("aerospace_insights"),
            "query": query
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "service": "Polaris API",
        "openai_available": OPENAI_AVAILABLE and client is not None
    })

if __name__ == '__main__':
    print("=" * 60)
    print("POLARIS REAL-TIME API SERVER")
    print("=" * 60)
    print("Starting server on http://localhost:5000")
    print("Endpoints:")
    print("  GET /api/current-distance - Real-time Polaris distance")
    print("  GET /api/popular-stars - Get 20 popular stars data")
    print("  GET /api/star/<name> - Get specific star info")
    print("  POST /api/ai-search - AI-powered search for space/astronomy info")
    print("  GET /api/health - Health check")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=False)

