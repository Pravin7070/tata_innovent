# AI Engine - Terrain Detection & Vehicle Control Decision System

Complete terrain detection and intelligent vehicle control decision system for the TATA 4X4 autonomous vehicle project.

## Overview

The AI Engine is responsible for:
- Reading and processing uploaded videos
- Extracting frames at configurable intervals
- Running YOLOv8 object detection for terrain classification
- Calculating terrain severity and risk levels
- Implementing the Decision Engine for intelligent vehicle commands
- Generating structured JSON output for backend integration

## Project Structure

```
ai-engine/
├── preprocessing/           # Video and frame preprocessing
│   ├── video_processor.py  # Video file handling and metadata
│   └── frame_extractor.py  # Frame extraction and preprocessing
├── detection/              # Object detection module
│   └── yolo_detector.py    # YOLOv8 terrain detection
├── severity/               # Terrain severity assessment
│   └── severity_calculator.py  # Severity and risk calculation
├── decision/               # Decision engine and commands
│   ├── decision_engine.py  # Vehicle control decisions
│   └── command_generator.py # Structured command output
├── inference/              # Complete inference pipeline
│   └── inference_pipeline.py  # Orchestrates all modules
├── utilities/              # Utility modules
│   ├── logger.py          # Logging configuration
│   └── json_builder.py    # JSON output builder
├── config.py              # Configuration and constants
├── main.py                # Main application entry point
├── api.py                 # REST API interface
├── integration_example.py # Backend integration example
├── examples.py            # Usage examples
└── requirements.txt       # Python dependencies
```

## Supported Terrain Types

The system detects and classifies the following terrain types:

1. **Road** - Paved or normal road surface (Low severity)
2. **Mud** - Muddy terrain (High severity)
3. **Stone** - Rocky terrain (Medium severity)
4. **Pothole** - Road defects/potholes (Critical severity)
5. **Bush** - Vegetation obstacles (Medium severity)
6. **Water** - Water bodies/crossings (Critical severity)
7. **Slope** - Inclined terrain (High severity)
8. **Gravel** - Gravel/loose terrain (Medium severity)

## Installation & Setup

### Prerequisites
- Python 3.8+
- pip or conda package manager
- CUDA compatible GPU (optional, but recommended)

### Installation Steps

1. **Install Dependencies**
```bash
pip install -r requirements.txt
```

2. **Verify Installation**
```bash
python -c "from ultralytics import YOLO; print('YOLOv8 installed successfully')"
```

## Usage

### Quick Start

```python
from main import AIEngine

# Initialize AI Engine
engine = AIEngine()

# Analyze a video
result = engine.analyze_video(
    video_path='path/to/video.mp4',
    frame_step=10,          # Process every 10th frame
    max_frames=300,         # Maximum 300 frames
    current_speed=60        # Current speed in km/h
)

# Print results
import json
print(json.dumps(result, indent=2))
```

### Analyze Single Frame

```python
import cv2
from main import AIEngine

# Initialize engine
engine = AIEngine()

# Read frame
cap = cv2.VideoCapture('video.mp4')
ret, frame = cap.read()
cap.release()

# Analyze frame
result = engine.analyze_frame(
    frame_array=frame,
    frame_number=0,
    timestamp='00:00:00.000',
    current_speed=60
)
```

### Using the API Interface

```python
from main import AIEngine
from api import AIEngineAPI

# Initialize engine and API
engine = AIEngine()
api = AIEngineAPI(engine)

# Video analysis via API
result = api.analyze_video_request(
    video_path='path/to/video.mp4',
    current_speed=60
)

# Get engine status
status = api.get_engine_status()
```

## Output Format

### Detection Result JSON

Each detection includes:

```json
{
  "Terrain": "Pothole",
  "Confidence": 0.8234,
  "BoundingBox": {
    "x": 100.5,
    "y": 200.3,
    "width": 150.2,
    "height": 120.1
  },
  "FrameNumber": 42,
  "Timestamp": "00:00:01.400",
  "Severity": 87.5,
  "RiskLevel": "Critical",
  "DriveMode": "Critical",
  "RideHeight": "Maximum",
  "RecommendedSpeed": 10,
  "SteeringRecommendation": "Maintain Course",
  "ProcessedAt": "2024-01-15T10:30:45.123456"
}
```

### Complete Video Analysis Result

```json
{
  "status": "success",
  "video_analysis": {
    "video_path": "path/to/video.mp4",
    "total_frames": 1500,
    "processed_frames": 150,
    "fps": 30.0,
    "resolution": "1920x1080",
    "total_detections": 1250,
    "detections": [...],
    "mission_summary": {
      "TerrainDetectionCounts": {...},
      "AverageConfidenceByTerrain": {...},
      "MaxSeverityByTerrain": {...},
      "RiskDistribution": {...},
      "OverallAverageSeverity": 45.3
    }
  }
}
```

## Configuration

Edit `config.py` to customize:

- **Terrain Types**: Add or modify terrain classifications
- **Confidence Thresholds**: Adjust detection confidence levels
- **Severity Levels**: Define severity ranges for each terrain
- **Model Settings**: Change YOLO model variant and parameters
- **Processing Settings**: Adjust frame extraction rate and batch size
- **Decision Parameters**: Customize drive modes and speed recommendations

### Key Configuration Parameters

```python
# Frame extraction rate (extract every Nth frame)
FRAME_EXTRACTION_RATE = 10

# Maximum frames per video
MAX_FRAMES_PER_VIDEO = 300

# Model settings
MODEL_NAME = 'yolov8n.pt'  # nano, small, medium, large, xlarge
CONFIDENCE_THRESHOLD = 0.45
DEVICE = 'cpu'  # or 'cuda' for GPU
```

## Drive Modes

The system recommends one of four drive modes based on terrain severity:

| Drive Mode | Speed Range | Ride Height | Conditions |
|-----------|------------|------------|-----------|
| Safe | 40-100 km/h | Normal | Normal road conditions |
| Cautious | 20-50 km/h | Normal | Moderate terrain challenges |
| Offroad | 10-40 km/h | High | Rough terrain, mud, gravel |
| Critical | 0-15 km/h | Maximum | Severe obstacles, extreme conditions |

## Risk Levels

- **Low** (0-25): Safe conditions
- **Medium** (25-50): Some caution needed
- **High** (50-75): Significant hazards
- **Critical** (75-100): Severe hazards

## API Endpoints

When using the Flask integration (`integration_example.py`):

### Health Check
```
GET /health
```

### Engine Status
```
GET /status
```

### Analyze Video
```
POST /analyze/video
- Parameters: file (video), frame_step, max_frames, current_speed
```

### Analyze Frame
```
POST /analyze/frame
- Parameters: frame_data (base64), frame_number, timestamp, current_speed
```

### Supported Terrains
```
GET /terrains
```

## Module Descriptions

### preprocessing/
- **VideoProcessor**: Handles video file reading, frame navigation, property extraction
- **FrameExtractor**: Extracts frames, applies preprocessing, handles color spaces

### detection/
- **YOLODetector**: Runs YOLOv8 inference, filters detections, provides statistics

### severity/
- **SeverityCalculator**: Calculates severity scores, risk levels, identifies critical threats

### decision/
- **DecisionEngine**: Makes intelligent vehicle control decisions based on terrain analysis
- **CommandGenerator**: Creates structured JSON commands for vehicle systems

### inference/
- **InferencePipeline**: Orchestrates all modules for complete video/frame analysis

## Advanced Usage

### Custom Model

```python
from main import AIEngine

# Use custom trained model
engine = AIEngine(model_path='path/to/custom_model.pt')
```

### Batch Processing

```python
from inference.inference_pipeline import InferencePipeline

pipeline = InferencePipeline()
batch_results = pipeline.detector.detect_batch(frames)
```

### Accessing Raw Detections

```python
from preprocessing.video_processor import VideoProcessor
from preprocessing.frame_extractor import FrameExtractor
from detection.yolo_detector import YOLODetector

video_proc = VideoProcessor('video.mp4')
frames = FrameExtractor.extract_frame_batch(video_proc, frame_step=10)
detector = YOLODetector()

for frame, frame_num, timestamp in frames:
    detections = detector.detect(frame)
    print(f"Frame {frame_num}: {len(detections)} detections")
```

## Performance Optimization

### For Faster Processing
- Use smaller YOLO model: `yolov8n.pt` (nano)
- Increase frame step: `frame_step=20` (skip more frames)
- Limit max frames: `max_frames=100`
- Use GPU: Set `DEVICE = 'cuda'` in config

### For Better Accuracy
- Use larger YOLO model: `yolov8l.pt` (large)
- Decrease frame step: `frame_step=5`
- Train custom model on specific terrain data

## Troubleshooting

### CUDA Not Found
```bash
# Use CPU instead
# In config.py, set DEVICE = 'cpu'
```

### Out of Memory
- Reduce batch size
- Use smaller model variant
- Increase frame step

### Model Download Issues
```bash
# Pre-download model
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

## Backend Integration

See `integration_example.py` for complete Flask integration example.

The AI Engine returns all results in structured JSON format ready for:
- Database storage
- Real-time vehicle control
- Analytics and reporting
- UI visualization

## Performance Metrics

Typical performance on standard hardware:

| Metric | Value |
|--------|-------|
| Frame Processing Rate | 15-30 FPS (CPU) |
| Frame Processing Rate | 50-100 FPS (GPU) |
| Memory Usage | 500MB - 2GB |
| Model Size | 20MB - 200MB |
| Detection Latency | 30-100ms per frame |

## Logging

The system provides detailed logging. Adjust log level in `utilities/logger.py`:

```python
logger = setup_logger(__name__, level=logging.DEBUG)  # More verbose
logger = setup_logger(__name__, level=logging.WARNING)  # Less verbose
```

## Version History

- **v1.0.0** (2024-01-15)
  - Initial release
  - 8 terrain types supported
  - Complete decision engine
  - JSON API ready

## License

Proprietary - TATA 4X4 Autonomous Vehicle Project

## Support

For issues, questions, or contributions, contact the AI Engineering Team.

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
