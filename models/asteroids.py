from pydantic import BaseModel

class Asteroid(BaseModel):
    name: str
    distance_km: float
    velocity_kms: float
    approach_date: str
    hazardous: bool
