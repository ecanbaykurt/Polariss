# Real Astronomical Data Sources

## Overview

Polaris Distance Tracker uses real astronomical data from multiple authoritative sources:

1. **GAIA EDR3** (European Space Agency) - Most accurate, priority source
2. **Hipparcos Catalog** - ESA's Hipparcos mission data
3. **SIMBAD** (CDS, Strasbourg) - Astronomical database

## Data Fetching

### Automatic Data Update

Run the data fetcher to get latest values:

```bash
python3 data_fetcher.py
```

Or use the update script:

```bash
python3 update_with_real_data.py
```

### Current Polaris Data (GAIA EDR3)

- **Distance**: 446.18 ± 0.5 light years (136.8 parsec)
- **Radial Velocity**: 3.76 ± 0.10 km/s (moving away)
- **Proper Motion RA**: -18.11 mas/yr
- **Proper Motion Dec**: -17.22 mas/yr
- **Parallax**: 7.31 ± 0.02 mas
- **Source**: GAIA EDR3
- **Last Updated**: 2025-12-23

## Data Sources Details

### GAIA EDR3
- **Source**: European Space Agency
- **Mission**: GAIA (Global Astrometric Interferometer for Astrophysics)
- **Data Release**: Early Data Release 3 (EDR3)
- **Accuracy**: Highest precision parallax and proper motion measurements
- **Access**: Via VizieR or GAIA Archive

### Hipparcos
- **Source**: European Space Agency
- **Mission**: Hipparcos (High Precision Parallax Collecting Satellite)
- **Catalog**: HIP catalog
- **Accuracy**: High precision, but older than GAIA
- **Access**: Via VizieR

### SIMBAD
- **Source**: Centre de Données astronomiques de Strasbourg (CDS)
- **Type**: Astronomical database
- **Coverage**: Comprehensive star catalog
- **Access**: Via SIMBAD API or web interface

## API Endpoints

### SIMBAD
- Base URL: `http://simbad.u-strasbg.fr/simbad/sim-id`
- Format: JSON
- Identifier: "HIP 11767" or "Polaris"

### VizieR (for GAIA/Hipparcos)
- Base URL: `http://vizier.u-strasbg.fr/viz-bin/VizieR`
- Catalogs: I/350/gaiaedr3, I/239/hip_main

## Data Priority

1. **GAIA EDR3** - Most accurate, preferred source
2. **Hipparcos** - Fallback if GAIA unavailable
3. **SIMBAD** - Fallback for general data

## Notes

- GAIA EDR3 provides the most accurate distance measurements
- Radial velocity data is consistent across sources
- Proper motion values are from GAIA EDR3
- All distances are converted from parsecs to light years
- Uncertainty values are propagated through calculations


