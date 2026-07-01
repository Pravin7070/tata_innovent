import cv2
import time
import threading
from .terrain_service import process
from .state_manager import update
from app.database.database import SessionLocal
from app.models.models import AnalysisResult

class RealtimeManager:
    def __init__(self, source=0, fps=15, save_interval=10):
        self.source = source
        self.fps = fps
        self.cap = None
        self.running = False
        self.frame_count = 0
        self.save_interval = save_interval
        self._lock = threading.Lock()
        self._thread = None

    def start(self, source=None):
        if source is not None:
            self.source = source

        if self.running:
            return True

        self.frame_count = 0
        self.cap = cv2.VideoCapture(self.source)
        if not self.cap.isOpened():
            self.running = False
            return False

        self.running = True
        return True

    def start_background(self):
        if self._thread and self._thread.is_alive():
            return

        self._thread = threading.Thread(target=self.run, daemon=True)
        self._thread.start()

    def stop(self):
        with self._lock:
            if self.cap and self.cap.isOpened():
                self.cap.release()
            self.running = False

    def _persist_detection(self, detection):
        try:
            db = SessionLocal()
            record = AnalysisResult(video_id=0, result_data=detection)
            db.add(record)
            db.commit()
            db.close()
        except Exception:
            pass

    def run(self):
        if not self.cap or not self.cap.isOpened():
            if not self.start():
                return

        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                break

            detection = process(frame)
            update({
                'timestamp': time.time(),
                'frame_shape': frame.shape,
                'detections': detection,
            })

            self.frame_count += 1
            if self.frame_count % self.save_interval == 0 and detection:
                self._persist_detection(detection)

            time.sleep(1.0 / self.fps)
