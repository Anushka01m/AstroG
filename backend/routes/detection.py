from fastapi import APIRouter
from backend.services.detection_service import detect_motion

router = APIRouter(prefix="/detect", tags=["Detection"])

@router.get("/video")
def detect_video():
    data = detect_motion()
    return {
        "status": "success",
        "frames_detected": len(data),
        "data": data
    }
