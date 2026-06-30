# Quick Start Guide

## Installation (5 minutes)

### 1. Install Dependencies
```bash
cd ai-engine
pip install -r requirements.txt
```

### 2. Verify Installation
```bash
python -c "from main import AIEngine; print('✓ AI Engine ready')"
```

## Basic Usage (2 minutes)

### Analyze a Video
```python
from main import AIEngine
import json

# Initialize
engine = AIEngine()

# Analyze video
result = engine.analyze_video(
    video_path='path/to/your/video.mp4',
    frame_step=10,      # Process every 10th frame
    max_frames=300,     # Max 300 frames
    current_speed=60    # Current speed km/h
)

# View results
print(json.dumps(result, indent=2))
```

### Analyze a Frame
```python
import cv2
from main import AIEngine

engine = AIEngine()

# Load frame
cap = cv2.VideoCapture('video.mp4')
ret, frame = cap.read()

# Analyze
result = engine.analyze_frame(frame, current_speed=60)
print(result)
```

## Output Example

```json
{
  "Terrain": "Pothole",
  "Confidence": 0.85,
  "Severity": 87.5,
  "RiskLevel": "Critical",
  "DriveMode": "Critical",
  "RideHeight": "Maximum",
  "RecommendedSpeed": 10,
  "SteeringRecommendation": "Maintain Course"
}
```

## Common Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| frame_step | 10 | 1-100 | Extract every Nth frame |
| max_frames | 300 | 1-1000 | Maximum frames to process |
| current_speed | 60 | 0-200 | Vehicle speed (km/h) |

## Optimization Tips

### For Speed
```python
result = engine.analyze_video(
    video_path='video.mp4',
    frame_step=20,      # Skip more frames
    max_frames=100      # Process fewer frames
)
```

### For Accuracy
```python
result = engine.analyze_video(
    video_path='video.mp4',
    frame_step=5,       # Process more frames
    max_frames=500      # More frames to analyze
)
```

## Troubleshooting

### Import Error
```bash
# Make sure you're in ai-engine directory
cd ai-engine
python examples.py
```

### Memory Error
```python
# Reduce batch size
result = engine.analyze_video(
    video_path='video.mp4',
    max_frames=100  # Reduce frames
)
```

### Slow Performance
- Use GPU: Install CUDA
- Use smaller frame_step
- Use smaller video resolution

## API Usage

```python
from main import AIEngine
from api import AIEngineAPI

engine = AIEngine()
api = AIEngineAPI(engine)

# Health check
print(api.health_check())

# Video analysis
result = api.analyze_video_request('video.mp4')

# Engine status
print(api.get_engine_status())
```

## Backend Integration

See `integration_example.py` for Flask integration example.

Start the Flask server:
```bash
python integration_example.py
```

Then access endpoints:
- `GET /health` - Health check
- `GET /status` - Engine status
- `POST /analyze/video` - Upload and analyze video
- `POST /analyze/frame` - Analyze frame data

## Run Examples

```bash
python examples.py
```

This demonstrates:
- Engine initialization
- Status checking
- Frame analysis
- API usage

## Next Steps

1. Review `README.md` for complete documentation
2. Check `TECHNICAL.md` for architecture details
3. Explore modules in `preprocessing/`, `detection/`, `decision/`
4. Customize `config.py` for your needs

---

**Ready to go!** 🚀
