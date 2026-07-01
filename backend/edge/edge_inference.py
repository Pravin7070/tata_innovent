import os
import sys
import importlib.util
from ultralytics import YOLO

class EdgeInference:
    def __init__(self):
        model_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "ai-engine",
            "yolov8n.pt"
        ))

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")

        self.model = YOLO(model_path)
        self.running = False
        self.engine = self._load_ai_engine()

    def _load_ai_engine(self):
        ai_engine_root = os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "ai-engine"
        ))
        main_py_path = os.path.join(ai_engine_root, "main.py")

        if not os.path.exists(main_py_path):
            return None

        try:
            if ai_engine_root not in sys.path:
                sys.path.append(ai_engine_root)

            spec = importlib.util.spec_from_file_location("edge_ai_engine", main_py_path)
            ai_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(ai_module)
            AIEngine = ai_module.AIEngine
            return AIEngine()
        except Exception:
            return None

    def start(self):
        self.running = True

    def stop(self):
        self.running = False

    def infer(self, frame):
        if not self.running:
            return None

        if self.engine:
            try:
                return self.engine.analyze_frame(frame)
            except Exception:
                pass

        result = self.model(frame)
        # Convert YOLO result to JSON-serializable structure
        if hasattr(result, 'to_dict'):
            return result.to_dict()

        return {
            'raw': str(result)
        }
