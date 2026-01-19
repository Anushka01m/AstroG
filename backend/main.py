from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os

from backend.services.nasa_service import fetch_asteroids
from backend.utils.cache import get_cached_data, set_cache
from backend.models.asteroid import Asteroid
from backend.routes.detection import router as detection_router

app = FastAPI(title="AstroGuard Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection_router)

@app.get("/asteroids", response_model=List[Asteroid])
def get_asteroids():
    cached = get_cached_data()
    if cached:
        return cached

    data = fetch_asteroids()
    set_cache(data)
    return data

# Mount static files
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

