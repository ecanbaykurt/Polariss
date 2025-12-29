# Polaris Distance Tracker

A Python application that tracks the distance to Polaris (the North Star) over time using radial velocity calculations. The tracker provides daily and minute-by-minute updates with AI-powered mathematical explanations.

## 🌟 Overview

Polaris Distance Tracker calculates and monitors the changing distance between Earth and Polaris using the star's radial velocity. The application models how the distance evolves over time, accounting for the star's movement relative to Earth.

### Key Features

- **Daily Distance Tracking**: Calculate and display Polaris distance changes over multiple days
- **Minute-by-Minute Updates**: Real-time tracking with minute-level precision
- **AI-Powered Explanations**: OpenAI integration provides clear mathematical explanations
- **Automatic Precision Calculation**: Dynamically adjusts decimal precision based on time intervals
- **Physical Constants**: Uses accurate astronomical constants for calculations

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technical Details](#technical-details)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [How It Works](#how-it-works)
- [Examples](#examples)
- [License](#license)

## 🚀 Installation

### Prerequisites

- Python 3.7 or higher
- OpenAI API key (optional, for AI explanations)

### Setup

1. Clone or download this repository

2. Install required dependencies:
```bash
pip install openai
```

3. (Optional) Set up OpenAI API key:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

## 💻 Usage

### Basic Usage

Run the daily tracker (default: 10 days):
```bash
python polaris.py
```

### Daily Tracker

The daily tracker shows distance changes over multiple days:
```python
from polaris import run_daily_tracker, POLARIS

# Track for 7 days
run_daily_tracker(POLARIS, days=7)
```

### Minute Tracker

The minute tracker provides real-time updates every minute:
```python
from polaris import run_minute_tracker, POLARIS

# Track for 5 minutes
run_minute_tracker(POLARIS, minutes=5)
```

**Note**: Uncomment the minute tracker line in the main block to use it.

## 🔬 Technical Details

### Physical Constants

- **Light Year in Kilometers**: `9.4607304725808e12 km`
- **Seconds Per Day**: `86400 s`

### Polaris Parameters

- **Name**: Polaris (α Ursae Minoris)
- **Current Distance**: `446.5 light years`
- **Radial Velocity**: `3.76 km/s` (moving away from Earth)

### Distance Calculation

The distance at any time `t` is calculated using:

```
distance(t) = initial_distance + (radial_velocity × time_in_seconds) / km_per_light_year
```

Where:
- `radial_velocity` is in km/s
- `time_in_seconds` is the elapsed time since the reference point
- The result is converted from kilometers to light years

## 📚 API Reference

### Classes

#### `Star`
A dataclass representing a star with its properties.

**Attributes:**
- `name` (str): Name of the star
- `distance_ly` (float): Current distance in light years
- `radial_velocity_km_s` (float): Radial velocity in km/s (positive = away, negative = toward)

**Example:**
```python
star = Star(
    name="Polaris",
    distance_ly=446.5,
    radial_velocity_km_s=3.76
)
```

### Functions

#### `km_to_light_year(km: float) -> float`
Converts kilometers to light years.

**Parameters:**
- `km` (float): Distance in kilometers

**Returns:**
- `float`: Distance in light years

#### `days_between(t0: datetime, t1: datetime) -> float`
Calculates the number of days between two datetime objects.

**Parameters:**
- `t0` (datetime): Start time
- `t1` (datetime): End time

**Returns:**
- `float`: Number of days between the two times

#### `distance_at_time(star: Star, t0: datetime, t: datetime) -> float`
Calculates the distance to a star at a specific time.

**Parameters:**
- `star` (Star): Star object with distance and velocity
- `t0` (datetime): Reference time (initial distance time)
- `t` (datetime): Target time

**Returns:**
- `float`: Distance in light years at time `t`

#### `required_decimals(star: Star, seconds: int) -> int`
Calculates the required decimal precision based on the expected change over a time period.

**Parameters:**
- `star` (Star): Star object
- `seconds` (int): Time period in seconds

**Returns:**
- `int`: Number of decimal places needed (between 6 and 18)

#### `explain_math(step: str, text: str) -> None`
Uses OpenAI API to provide mathematical explanations.

**Parameters:**
- `step` (str): Step description
- `text` (str): Mathematical concept to explain

**Note**: Requires OpenAI API key. Fails gracefully if unavailable.

#### `run_daily_tracker(star: Star, days: int = 7) -> None`
Runs the daily distance tracker.

**Parameters:**
- `star` (Star): Star to track
- `days` (int): Number of days to track (default: 7)

**Output:**
- Prints daily distance updates with timestamps

#### `run_minute_tracker(star: Star, minutes: int = 3) -> None`
Runs the minute-by-minute distance tracker.

**Parameters:**
- `star` (Star): Star to track
- `minutes` (int): Number of minutes to track (default: 3)

**Output:**
- Prints minute-by-minute distance updates
- Sleeps 60 seconds between updates

## ⚙️ Configuration

### Modifying Star Parameters

Edit the `POLARIS` constant in `polaris.py`:

```python
POLARIS = Star(
    name="Polaris",
    distance_ly=446.5,  # Update distance
    radial_velocity_km_s=3.76  # Update velocity
)
```

### Customizing Tracker Behavior

Modify the main block at the bottom of `polaris.py`:

```python
if __name__ == "__main__":
    run_daily_tracker(POLARIS, days=10)  # Change days
    # run_minute_tracker(POLARIS, minutes=5)  # Uncomment to use
```

## 📦 Dependencies

- **openai**: OpenAI API client for mathematical explanations
  - Install: `pip install openai`
  - Version: Latest stable release

### Standard Library Modules

- `dataclasses`: For the Star dataclass
- `datetime`: For time calculations
- `math`: For logarithmic calculations
- `time`: For sleep functionality in minute tracker

## 🔍 How It Works

1. **Initial Setup**: The application defines Polaris with its current distance (446.5 ly) and radial velocity (3.76 km/s away from Earth).

2. **Distance Calculation**: 
   - Calculates time difference from reference point
   - Multiplies radial velocity by time to get distance change in km
   - Converts km to light years
   - Adds to initial distance

3. **Precision Management**: 
   - Determines required decimal places based on expected change
   - Ensures meaningful precision without excessive digits
   - Range: 6 to 18 decimal places

4. **AI Explanations**: 
   - Uses OpenAI GPT-4.1-mini model
   - Provides clear, concise mathematical explanations
   - Fails gracefully if API is unavailable

5. **Tracking Modes**:
   - **Daily**: Calculates distance for each day from start date
   - **Minute**: Real-time updates every 60 seconds

## 📊 Examples

### Example 1: Daily Tracking Output

```
Tracking Polaris
Initial distance: 446.5 ly
Radial velocity: 3.76 km/s
Decimal precision: 9

Day  0  2024-01-01  Distance 446.500000000 ly
Day  1  2024-01-02  Distance 446.500000343 ly
Day  2  2024-01-03  Distance 446.500000686 ly
...
```

### Example 2: Custom Star Tracking

```python
from polaris import Star, run_daily_tracker

custom_star = Star(
    name="Vega",
    distance_ly=25.04,
    radial_velocity_km_s=-13.9  # Moving toward Earth
)

run_daily_tracker(custom_star, days=30)
```

### Example 3: Single Distance Calculation

```python
from polaris import POLARIS, distance_at_time
from datetime import datetime, timezone, timedelta

t0 = datetime.now(timezone.utc)
t_future = t0 + timedelta(days=365)  # One year later

future_distance = distance_at_time(POLARIS, t0, t_future)
print(f"Distance in one year: {future_distance:.12f} ly")
```

## 🎯 Use Cases

- **Educational**: Learn about stellar motion and distance calculations
- **Astronomical Modeling**: Track star distances over time
- **Research**: Model radial velocity effects on distance measurements
- **Demonstration**: Show real-time distance changes (minute tracker)

## ⚠️ Notes

- **Minute Tracker**: The minute tracker uses `time.sleep(60)`, which blocks execution. Use in appropriate contexts.
- **OpenAI API**: AI explanations require an API key. The application works without it but skips explanations.
- **Precision**: Very small time intervals require many decimal places. The precision calculator handles this automatically.
- **Modeling vs. Measurement**: This is a mathematical model. Actual astronomical measurements have different considerations.

## 🔮 Future Enhancements

Potential improvements:
- Support for multiple stars
- Graphical visualization of distance over time
- Export to CSV/JSON
- Web interface
- Historical data tracking
- Integration with astronomical databases

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Contact

For questions or suggestions, please open an issue in the repository.

---

**Note**: This is a scientific modeling tool. For actual astronomical observations, consult professional astronomical resources and databases.
