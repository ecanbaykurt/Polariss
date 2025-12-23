"""
POLARIS DISTANCE TRACKER
Daily / Minute update using radial velocity
Includes OpenAI math explanation agents
"""

# STEP 1 — Install requirements
# pip install openai

from dataclasses import dataclass
from datetime import datetime, timezone
import math
import time

# STEP 2 — Physical constants
KM_PER_LIGHT_YEAR = 9.4607304725808e12
SECONDS_PER_DAY = 86400

# STEP 3 — Polaris parameters
@dataclass
class Star:
    name: str
    distance_ly: float
    radial_velocity_km_s: float  # + away, − toward Earth

POLARIS = Star(
    name="Polaris",
    distance_ly=446.5,
    radial_velocity_km_s=3.76
)

# STEP 4 — Unit conversions
def km_to_light_year(km):
    return km / KM_PER_LIGHT_YEAR

# STEP 5 — Time difference in days
def days_between(t0, t1):
    return (t1 - t0).total_seconds() / SECONDS_PER_DAY

# STEP 6 — Distance evolution model
def distance_at_time(star, t0, t):
    delta_days = days_between(t0, t)
    delta_km = star.radial_velocity_km_s * SECONDS_PER_DAY * delta_days
    delta_ly = km_to_light_year(delta_km)
    return star.distance_ly + delta_ly

# STEP 7 — Precision estimator
def required_decimals(star, seconds):
    delta_km = abs(star.radial_velocity_km_s) * seconds
    delta_ly = km_to_light_year(delta_km)
    if delta_ly == 0:
        return 6
    return max(6, min(18, int(-math.log10(delta_ly)) + 2))

# STEP 8 — OpenAI math explainer agent
def explain_math(step, text):
    try:
        from openai import OpenAI
        client = OpenAI()

        system = (
            "You are a scientific math explainer. "
            "Explain the math clearly in short sentences. "
            "No dashes. No emojis."
        )

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {"role": "system", "content": system},
                {"role": "user", "content": f"{step}\n{text}"}
            ],
            temperature=0.2,
            max_output_tokens=120
        )

        print("\n[AI Explanation]")
        print(response.output_text)

    except Exception:
        print("\n[AI explanation skipped]")

# STEP 9 — Daily tracker
def run_daily_tracker(star, days=7):
    t0 = datetime.now(timezone.utc)
    decimals = required_decimals(star, SECONDS_PER_DAY)

    explain_math(
        "Daily distance update",
        "Distance change equals radial velocity multiplied by time. "
        "Velocity is in km per second. "
        "Time is converted to days and then to kilometers. "
        "Kilometers are converted to light years."
    )

    print(f"\nTracking {star.name}")
    print(f"Initial distance: {star.distance_ly} ly")
    print(f"Radial velocity: {star.radial_velocity_km_s} km/s")
    print(f"Decimal precision: {decimals}\n")

    for i in range(days + 1):
        t = t0 + i * (datetime.fromtimestamp(SECONDS_PER_DAY, tz=timezone.utc) -
                      datetime.fromtimestamp(0, tz=timezone.utc))
        d = distance_at_time(star, t0, t)
        print(f"Day {i:2d}  {t.date()}  Distance {d:.{decimals}f} ly")

# STEP 10 — Minute live tracker
def run_minute_tracker(star, minutes=3):
    t0 = datetime.now(timezone.utc)
    decimals = required_decimals(star, 60)

    explain_math(
        "Minute updates",
        "Distance change per minute is extremely small. "
        "Many decimal places are required. "
        "This is a modeled change, not a measurable one."
    )

    for _ in range(minutes):
        t = datetime.now(timezone.utc)
        d = distance_at_time(star, t0, t)
        print(f"{t.isoformat()}  {d:.{decimals}f} ly")
        time.sleep(60)

# STEP 11 — Run
if __name__ == "__main__":
    run_daily_tracker(POLARIS, days=10)
    # run_minute_tracker(POLARIS, minutes=5)
