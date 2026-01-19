from fastapi import APIRouter, File, UploadFile, HTTPException
from backend.services.detection_service import detect_motion, detect_motion_from_bytes

router = APIRouter(prefix="/detect", tags=["Detection"])

@router.get("/video")
def detect_video():
    """Detect motion in default video"""
    data = detect_motion()
    return {
        "status": "success",
        "frames_detected": len(data),
        "data": data
    }

@router.post("/upload")
async def detect_uploaded_video(file: UploadFile = File(...)):
    """
    Detect moving objects in uploaded video file.
    
    Accepts video files (.mp4, .avi, .mov, etc.)
    Returns detection results with position and speed data.
    """
    # Validate file type
    allowed_formats = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo']
    if file.content_type not in allowed_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_formats)}"
        )
    
    try:
        # Read uploaded file bytes
        contents = await file.read()
        
        # Run detection on uploaded video
        result = detect_motion_from_bytes(contents)
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing video: {str(e)}"
        )
