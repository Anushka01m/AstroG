# backend/models/asteroid.py
from pydantic import BaseModel

class Asteroid(BaseModel):
    id: str
    name: str
    hazardous: bool
    absolute_magnitude: float
    estimated_diameter_km: float
    distance_km: float
    velocity_km_s: float
    approach_date: str
