from .edge_inference import EdgeInference

engine = EdgeInference()

def process(frame):
    detection = engine.infer(frame)
    return detection
