from fastapi import FastAPI
from services.nasa_service import fetch_asteroids
from utils.cache import get_cached_data, set_cache
from models.asteroid import Asteroid
from typing import List

app = FastAPI(title="AstroGuard Backend")

@app.get("/asteroids", response_model=List[Asteroid])
def get_asteroids():
    cached = get_cached_data()
    if cached:
        return cached

    data = fetch_asteroids()
    set_cache(data)
    return data
