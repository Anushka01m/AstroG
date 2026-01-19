import cv2
import numpy as np
import tempfile
import os
from typing import List, Dict, Any

VIDEO_PATH = r"C:/Users/HP/Videos/SPACERECORDING.mp4"
PIXEL_TO_KM = 500
TRAIL_LENGTH = 60

def detect_motion(video_path: str = None) -> List[Dict[str, Any]]:
    """
    Detect moving objects in a video file.
    
    Args:
        video_path: Path to video file. If None, uses default VIDEO_PATH
    
    Returns:
        List of detection results with frame info, position, and speed
    """
    if video_path is None:
        video_path = VIDEO_PATH
    
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        return {"error": "Could not open video file"}
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    prev_pos = None
    results = []

    frame_id = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (9, 9), 0)

        _, _, _, maxLoc = cv2.minMaxLoc(blur)
        cx, cy = maxLoc

        speed_km = 0
        if prev_pos:
            d = np.linalg.norm(np.array((cx, cy)) - np.array(prev_pos))
            speed_km = d * fps * PIXEL_TO_KM

        prev_pos = (cx, cy)

        results.append({
            "frame": frame_id,
            "x": int(cx),
            "y": int(cy),
            "speed_km_s": round(speed_km, 2)
        })

        frame_id += 1

    cap.release()
    return results

def detect_motion_from_bytes(video_bytes: bytes) -> Dict[str, Any]:
    """
    Detect moving objects from uploaded video bytes.
    
    Args:
        video_bytes: Raw video file bytes
    
    Returns:
        Detection results and metadata
    """
    # Save bytes to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_file:
        tmp_file.write(video_bytes)
        tmp_path = tmp_file.name
    
    try:
        # Run detection
        detections = detect_motion(tmp_path)
        
        # Get video info
        cap = cv2.VideoCapture(tmp_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        cap.release()
        
        # Calculate summary statistics
        speeds = [d['speed_km_s'] for d in detections]
        max_speed = max(speeds) if speeds else 0
        avg_speed = sum(speeds) / len(speeds) if speeds else 0
        
        return {
            "status": "success",
            "detections": detections,
            "metadata": {
                "total_frames": frame_count,
                "fps": fps,
                "width": width,
                "height": height,
                "duration_seconds": frame_count / fps if fps > 0 else 0
            },
            "summary": {
                "max_speed_km_s": round(max_speed, 2),
                "avg_speed_km_s": round(avg_speed, 2),
                "total_detections": len(detections)
            }
        }
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
