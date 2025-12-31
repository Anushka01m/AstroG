import requests
import os
from dotenv import load_dotenv

load_dotenv()

NASA_API_KEY = os.getenv("NASA_API_KEY")
NASA_NEO_URL = "https://api.nasa.gov/neo/rest/v1/feed"

def fetch_asteroids():
    params = {
        "api_key": NASA_API_KEY
    }

    response = requests.get(NASA_NEO_URL, params=params)
    response.raise_for_status()
    data = response.json()

    asteroids = []

    for date in data["near_earth_objects"]:
        for obj in data["near_earth_objects"][date]:
            close_data = obj["close_approach_data"][0]

            asteroid = {
                "name": obj["name"],
                "distance_km": float(close_data["miss_distance"]["kilometers"]),
                "velocity_kms": float(close_data["relative_velocity"]["kilometers_per_second"]),
                "approach_date": close_data["close_approach_date"],
                "hazardous": obj["is_potentially_hazardous_asteroid"]
            }

            asteroids.append(asteroid)

    return asteroids
