import requests
import os
from dotenv import load_dotenv
from datetime import date

load_dotenv()

NASA_API_KEY = os.getenv("NASA_API_KEY")
NASA_NEO_URL = "https://api.nasa.gov/neo/rest/v1/feed"

def fetch_asteroids():
    today = date.today().isoformat()

    params = {
        "start_date": today,
        "end_date": today,
        "api_key": NASA_API_KEY
    }

    response = requests.get(NASA_NEO_URL, params=params)
    response.raise_for_status()
    data = response.json()

    asteroids = []

    for obj in data["near_earth_objects"][today]:
        close_data = obj["close_approach_data"][0]

        asteroid = {
            "id": obj["id"],
            "name": obj["name"],
            "hazardous": obj["is_potentially_hazardous_asteroid"],
            "absolute_magnitude": obj["absolute_magnitude_h"],
            "estimated_diameter_km": obj["estimated_diameter"]["kilometers"]["estimated_diameter_max"],
            "distance_km": float(close_data["miss_distance"]["kilometers"]),
            "velocity_km_s": float(close_data["relative_velocity"]["kilometers_per_second"]),
            "approach_date": close_data["close_approach_date"]
        }

        asteroids.append(asteroid)

    return asteroids

