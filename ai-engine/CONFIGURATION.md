# Configuration Guide

## Overview

The AI Engine is highly configurable. All settings are centralized in `config.py`.

## Terrain Configuration

### Supported Terrain Types

Modify `TERRAIN_CONFIG.TERRAIN_TYPES`:

```python
TERRAIN_TYPES = [
    'Road',      # Normal paved road
    'Mud',       # Muddy terrain
    'Stone',     # Rocky terrain
    'Pothole',   # Road defects
    'Bush',      # Vegetation
    'Water',     # Water bodies
    'Slope',     # Inclined terrain
    'Gravel'     # Gravel surface
]
```

### Confidence Thresholds

Set minimum confidence for each terrain:

```python
CONFIDENCE_THRESHOLDS = {
    'Road': 0.50,      # 50% confidence minimum
    'Mud': 0.55,
    'Stone': 0.60,
    'Pothole': 0.65,   # Stricter for safety
    'Bush': 0.58,
    'Water': 0.70,     # Strictest
    'Slope': 0.60,
    'Gravel': 0.55
}
```

**Recommendation**: Higher thresholds = fewer false positives but might miss some detections

### Severity Levels

Configure severity ranges for each terrain:

```python
SEVERITY_LEVELS = {
    'Road': {'min': 0.0, 'max': 20.0, 'level': 'Low'},
    'Mud': {'min': 40.0, 'max': 80.0, 'level': 'High'},
    # ...
}
```

**min**: Minimum severity score
**max**: Maximum severity score
**level**: Risk level classification

## Model Configuration

### YOLO Model Selection

In `MODEL_CONFIG`:

```python
MODEL_NAME = 'yolov8n.pt'  # Options:
# 'yolov8n.pt'  - Nano (fastest, lowest accuracy)
# 'yolov8s.pt'  - Small
# 'yolov8m.pt'  - Medium
# 'yolov8l.pt'  - Large
# 'yolov8x.pt'  - XLarge (slowest, best accuracy)
```

### Model Parameters

```python
CONFIDENCE_THRESHOLD = 0.45      # Min confidence for all detections
IOU_THRESHOLD = 0.45             # Non-max suppression threshold
IMAGE_SIZE = 640                 # Input image size (640 recommended)
DEVICE = 'cpu'                   # 'cpu' or 'cuda'
```

**Performance Trade-offs**:
- Larger models = better accuracy, slower
- Higher confidence threshold = fewer detections, fewer false positives

## Processing Configuration

### Frame Extraction

```python
FRAME_EXTRACTION_RATE = 10       # Extract every 10th frame
MAX_FRAMES_PER_VIDEO = 300       # Max 300 frames per video
OUTPUT_IMAGE_SIZE = (640, 480)   # Output resolution
VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mov', '.mkv']
```

**Examples**:
- `FRAME_EXTRACTION_RATE = 1`: Process every frame (slow but accurate)
- `FRAME_EXTRACTION_RATE = 30`: Skip frames (fast but less data)

## Decision Configuration

### Drive Modes

```python
DRIVE_MODES = {
    'Safe': {
        'min_speed': 40,
        'max_speed': 100,
        'ride_height': 'Normal'
    },
    'Cautious': {
        'min_speed': 20,
        'max_speed': 50,
        'ride_height': 'Normal'
    },
    'Offroad': {
        'min_speed': 10,
        'max_speed': 40,
        'ride_height': 'High'
    },
    'Critical': {
        'min_speed': 0,
        'max_speed': 15,
        'ride_height': 'Maximum'
    }
}
```

### Risk Level Thresholds

```python
RISK_LEVELS = {
    'Low': (0, 25),
    'Medium': (25, 50),
    'High': (50, 75),
    'Critical': (75, 100)
}
```

## Custom Configuration Examples

### Conservative Configuration (Safety-First)

```python
# Use highest confidence thresholds
CONFIDENCE_THRESHOLDS = {
    'Road': 0.65,
    'Mud': 0.75,
    'Stone': 0.70,
    'Pothole': 0.80,
    'Bush': 0.75,
    'Water': 0.85,
    'Slope': 0.75,
    'Gravel': 0.70
}

# Lower speed recommendations
DRIVE_MODES = {
    'Safe': {'max_speed': 80, ...},
    'Cautious': {'max_speed': 40, ...},
    'Offroad': {'max_speed': 25, ...},
    'Critical': {'max_speed': 10, ...}
}
```

### Aggressive Configuration (Speed-Oriented)

```python
# Lower confidence thresholds
CONFIDENCE_THRESHOLDS = {
    'Road': 0.35,
    'Mud': 0.40,
    'Stone': 0.45,
    'Pothole': 0.50,
    'Bush': 0.40,
    'Water': 0.55,
    'Slope': 0.45,
    'Gravel': 0.40
}

# Higher speed recommendations
DRIVE_MODES = {
    'Safe': {'max_speed': 120, ...},
    'Cautious': {'max_speed': 60, ...},
    'Offroad': {'max_speed': 50, ...},
    'Critical': {'max_speed': 20, ...}
}
```

### Performance Configuration (Fast Processing)

```python
# Fast model
MODEL_NAME = 'yolov8n.pt'
DEVICE = 'cuda'

# Skip frames
FRAME_EXTRACTION_RATE = 20
MAX_FRAMES_PER_VIDEO = 150

# Larger images (default)
IMAGE_SIZE = 640
```

### Accuracy Configuration (Best Detection)

```python
# Large, accurate model
MODEL_NAME = 'yolov8l.pt'
DEVICE = 'cuda'

# Process all frames
FRAME_EXTRACTION_RATE = 1
MAX_FRAMES_PER_VIDEO = 1000

# Higher confidence thresholds
CONFIDENCE_THRESHOLD = 0.60
```

## Environment Variables (Optional)

Create `.env` file:

```
YOLO_DEVICE=cuda
MODEL_PATH=/path/to/custom/model.pt
LOG_LEVEL=INFO
CONFIDENCE_THRESHOLD=0.50
```

Then in your code:

```python
import os
from dotenv import load_dotenv

load_dotenv()
device = os.getenv('YOLO_DEVICE', 'cpu')
```

## Configuration Best Practices

1. **Start with defaults**: Use out-of-the-box configuration first
2. **Adjust incrementally**: Change one parameter at a time
3. **Test thoroughly**: Validate with real video data
4. **Monitor performance**: Track FPS and memory usage
5. **Document changes**: Comment why you modified a setting

## Testing Configuration Changes

```python
from config import TERRAIN_CONFIG, MODEL_CONFIG, DECISION_CONFIG
import json

print("Terrain Config:")
print(json.dumps(TERRAIN_CONFIG.__dict__, indent=2))

print("\nModel Config:")
print(json.dumps(MODEL_CONFIG.__dict__, indent=2))

print("\nDecision Config:")
print(json.dumps(DECISION_CONFIG.__dict__, indent=2))
```

## Runtime Configuration Override

Override settings at runtime:

```python
from main import AIEngine
from config import MODEL_CONFIG, PROCESSING_CONFIG

# Modify before creating engine
MODEL_CONFIG.DEVICE = 'cuda'
PROCESSING_CONFIG.FRAME_EXTRACTION_RATE = 5

engine = AIEngine()
result = engine.analyze_video('video.mp4')
```

## Advanced: Custom Severity Calculation

Modify `SeverityCalculator.calculate_severity()` for custom logic:

```python
def calculate_severity(terrain, confidence, bbox_area, frame_center_distance):
    # Example: Different formula for water
    if terrain == 'Water':
        base_severity = 95  # Always high
        return min(100, confidence * base_severity)
    
    # Default calculation for others
    return default_severity_calculation(...)
```

---

**Last Updated**: 2024-01-15
