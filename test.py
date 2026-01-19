import cv2
import numpy as np
from backend.services.detection_service import detect_motion, VIDEO_PATH, PIXEL_TO_KM, TRAIL_LENGTH

def play_video_demo():
    """Play video with motion detection visualization"""
    
    # Get detection results
    print("Running motion detection...")
    results = detect_motion()
    
    print(f"Detected {len(results)} frames")
    print(f"Sample results: {results[:5]}")
    
    # Now play video with visualization
    cap = cv2.VideoCapture(VIDEO_PATH)
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    # Create position trail for visualization
    trails = []
    
    frame_id = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_id < len(results):
            detection = results[frame_id]
            x = detection['x']
            y = detection['y']
            speed = detection['speed_km_s']
            
            # Draw detected point
            cv2.circle(frame, (x, y), 8, (0, 255, 0), -1)
            
            # Add to trail
            trails.append((x, y))
            if len(trails) > TRAIL_LENGTH:
                trails.pop(0)
            
            # Draw trail
            if len(trails) > 1:
                for i in range(len(trails) - 1):
                    alpha = i / len(trails)  # Fade effect
                    color = (0, int(255 * alpha), 255)
                    cv2.line(frame, trails[i], trails[i+1], color, 2)
            
            # Display info
            info = f"Speed: {speed} km/s | Frame: {frame_id}"
            cv2.putText(frame, info, (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Show frame
        cv2.imshow("Motion Detection Demo", frame)
        frame_id += 1
        
        # Press 'q' to quit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    play_video_demo()
