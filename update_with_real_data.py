"""
Update Polaris parameters with real data from Hipparcos/GAIA EDR3 / SIMBAD
Run this script to fetch latest data and update calculations
"""

from data_fetcher import AstronomicalDataFetcher
from polaris import POLARIS, Star
import json

def update_polaris_with_real_data():
    """Fetch real data and update POLARIS object"""
    
    print("=" * 60)
    print("UPDATING POLARIS WITH REAL ASTRONOMICAL DATA")
    print("=" * 60)
    print("\nFetching data from:")
    print("  - GAIA EDR3 (most accurate)")
    print("  - Hipparcos catalog")
    print("  - SIMBAD database")
    print("\n")
    
    fetcher = AstronomicalDataFetcher()
    real_data = fetcher.get_best_available_data()
    
    if not real_data:
        print("⚠ Could not fetch real data, keeping default values")
        return POLARIS
    
    # Update Polaris parameters
    updated_params = fetcher.update_polaris_parameters(real_data)
    
    if updated_params:
        print("\n" + "=" * 60)
        print("UPDATED PARAMETERS:")
        print("=" * 60)
        print(f"Distance: {updated_params['distance_ly']:.3f} ± {updated_params['distance_ly_uncertainty']:.3f} ly")
        print(f"Radial Velocity: {updated_params['radial_velocity_km_s']:.2f} ± {updated_params['radial_velocity_uncertainty_km_s']:.2f} km/s")
        print(f"Source: {updated_params['source']}")
        print(f"Priority: {updated_params['data_priority']}")
        print("=" * 60)
        
        # Create updated Star object
        updated_polaris = Star(
            name=updated_params['name'],
            distance_ly=updated_params['distance_ly'],
            radial_velocity_km_s=updated_params['radial_velocity_km_s'],
            distance_ly_uncertainty=updated_params['distance_ly_uncertainty'],
            radial_velocity_uncertainty_km_s=updated_params['radial_velocity_uncertainty_km_s'],
            catalog_id=POLARIS.catalog_id,
            ra_hours=POLARIS.ra_hours,
            dec_degrees=POLARIS.dec_degrees,
            proper_motion_ra_mas_yr=updated_params.get('proper_motion_ra_mas_yr', POLARIS.proper_motion_ra_mas_yr),
            proper_motion_dec_mas_yr=updated_params.get('proper_motion_dec_mas_yr', POLARIS.proper_motion_dec_mas_yr),
            spectral_type=POLARIS.spectral_type,
            magnitude=POLARIS.magnitude
        )
        
        # Save updated data
        output = {
            "original": {
                "distance_ly": POLARIS.distance_ly,
                "radial_velocity_km_s": POLARIS.radial_velocity_km_s,
            },
            "updated": {
                "distance_ly": updated_polaris.distance_ly,
                "distance_ly_uncertainty": updated_polaris.distance_ly_uncertainty,
                "radial_velocity_km_s": updated_polaris.radial_velocity_km_s,
                "radial_velocity_uncertainty_km_s": updated_polaris.radial_velocity_uncertainty_km_s,
            },
            "source_data": real_data,
            "metadata": {
                "source": updated_params['source'],
                "priority": updated_params['data_priority'],
                "fetch_date": updated_params.get('fetch_date')
            }
        }
        
        with open("polaris_real_data.json", "w") as f:
            json.dump(output, f, indent=2)
        
        print("\n✓ Updated data saved to polaris_real_data.json")
        print("\nTo use updated data, update POLARIS in polaris.py with:")
        print(f"  distance_ly={updated_polaris.distance_ly}")
        print(f"  radial_velocity_km_s={updated_polaris.radial_velocity_km_s}")
        
        return updated_polaris
    
    return POLARIS

if __name__ == "__main__":
    updated = update_polaris_with_real_data()
    print(f"\n✓ Update complete! New distance: {updated.distance_ly:.3f} ly")


