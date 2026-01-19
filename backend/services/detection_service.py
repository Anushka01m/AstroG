import cv2
import numpy as np

VIDEO_PATH = r"C:/Users/manas/Downloads/Moving comet.mp4"
PIXEL_TO_KM = 500
TRAIL_LENGTH = 60

def detect_motion(video_path=VIDEO_PATH):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)

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
