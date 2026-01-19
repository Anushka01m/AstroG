from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from backend.services.detection_service import detect_motion, detect_motion_from_bytes, process_and_annotate_video
import os

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
    Returns: Annotated video file.
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
        
        # Process and Annotate (Returns path to temp file)
        output_path = process_and_annotate_video(contents)
        
        # Return the file
        return FileResponse(
            path=output_path,
            media_type="video/webm",
            filename="analysis_result.webm"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing video: {str(e)}"
        )
