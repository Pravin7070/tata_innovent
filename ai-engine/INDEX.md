# AI Engine - Project Structure & Documentation Index

## Complete File Structure

```
ai-engine/
│
├── 📋 Documentation
│   ├── README.md                 # Main documentation & overview
│   ├── QUICKSTART.md            # 5-minute quick start guide
│   ├── TECHNICAL.md             # Technical architecture & details
│   ├── CONFIGURATION.md         # Configuration guide & examples
│   └── INDEX.md                 # This file
│
├── 🔧 Core Modules
│   ├── config.py                # All configuration & constants
│   ├── main.py                  # Main AIEngine class & entry point
│   ├── api.py                   # REST API interface
│   └── __init__.py              # Package initialization
│
├── 📹 preprocessing/            # Video & frame handling
│   ├── __init__.py
│   ├── video_processor.py       # Video file I/O
│   └── frame_extractor.py       # Frame extraction & preprocessing
│
├── 🎯 detection/                # Object detection
│   ├── __init__.py
│   └── yolo_detector.py         # YOLOv8 inference
│
├── ⚠️ severity/                 # Severity assessment
│   ├── __init__.py
│   └── severity_calculator.py   # Severity & risk calculation
│
├── 🚗 decision/                 # Decision engine
│   ├── __init__.py
│   ├── decision_engine.py       # Vehicle control decisions
│   └── command_generator.py     # Structured JSON output
│
├── 🔗 inference/                # Complete pipeline
│   ├── __init__.py
│   └── inference_pipeline.py    # Orchestrates all modules
│
├── 🛠️ utilities/                # Helper utilities
│   ├── __init__.py
│   ├── logger.py                # Logging setup
│   └── json_builder.py          # JSON output builder
│
├── 📚 Examples & Integration
│   ├── examples.py              # Usage examples
│   ├── integration_example.py   # Flask backend integration
│   └── requirements.txt         # Python dependencies
│
└── 📊 Statistics & Info
    ├── FILE_STRUCTURE.md        # This complete structure
    └── PROJECT_STATS.md         # Project statistics
```

## Quick Navigation

### For Getting Started
1. **New to the project?** → Start with [QUICKSTART.md](QUICKSTART.md)
2. **Want to use it?** → Read [README.md](README.md)
3. **Need details?** → Check [TECHNICAL.md](TECHNICAL.md)

### For Configuration
- **Customize settings?** → See [CONFIGURATION.md](CONFIGURATION.md)
- **Change terrain types?** → Edit `config.py`
- **Adjust speeds/modes?** → Modify `DecisionConfig` in `config.py`

### For Development
- **Understand architecture?** → [TECHNICAL.md](TECHNICAL.md) + Module docstrings
- **Add new terrain?** → Modify `config.py` + retrain model
- **Custom detection?** → Edit `detection/yolo_detector.py`
- **New decision logic?** → Modify `decision/decision_engine.py`

### For Integration
- **Connect to backend?** → See `integration_example.py`
- **Use REST API?** → Check `api.py`
- **Run Flask server?** → Execute `integration_example.py`

## Module Purpose Summary

| Module | Purpose | Key Class |
|--------|---------|-----------|
| `config.py` | Configuration & constants | `TerrainConfig`, `ModelConfig`, etc. |
| `main.py` | Main application entry | `AIEngine` |
| `api.py` | REST API interface | `AIEngineAPI` |
| `preprocessing/video_processor.py` | Video file handling | `VideoProcessor` |
| `preprocessing/frame_extractor.py` | Frame extraction & prep | `FrameExtractor` |
| `detection/yolo_detector.py` | Object detection | `YOLODetector` |
| `severity/severity_calculator.py` | Severity assessment | `SeverityCalculator` |
| `decision/decision_engine.py` | Control decisions | `DecisionEngine` |
| `decision/command_generator.py` | JSON output generation | `CommandGenerator` |
| `inference/inference_pipeline.py` | Pipeline orchestration | `InferencePipeline` |
| `utilities/logger.py` | Logging setup | `setup_logger()` |
| `utilities/json_builder.py` | JSON utilities | `JSONBuilder` |

## Supported Terrain Types

The system detects and classifies:

```
1. Road        → Low severity (0-20)
2. Mud         → High severity (40-80)
3. Stone       → Medium severity (30-70)
4. Pothole     → Critical severity (60-100)
5. Bush        → Medium severity (20-50)
6. Water       → Critical severity (70-100)
7. Slope       → High severity (35-90)
8. Gravel      → Medium severity (25-65)
```

## Output Formats

### Single Detection JSON
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

### Frame Command JSON
```json
{
  "FrameCommand": {
    "FrameNumber": 42,
    "DetectionCount": 3,
    "DriveMode": "Cautious",
    "RecommendedSpeed": 35,
    "Detections": [...]
  }
}
```

### Mission Summary JSON
```json
{
  "MissionSummary": {
    "VideoPath": "video.mp4",
    "TotalFrames": 1500,
    "ProcessedFrames": 150,
    "Statistics": {...},
    "CriticalFrames": 12
  }
}
```

## Key Features

✅ **Video Processing**
- Read multiple video formats (MP4, AVI, MOV, MKV)
- Extract frames at configurable intervals
- Automatic frame preprocessing

✅ **Object Detection**
- YOLOv8-based terrain detection
- 8 terrain types supported
- Configurable confidence thresholds

✅ **Severity Assessment**
- Intelligent severity scoring
- Risk level classification
- Critical threat identification

✅ **Decision Engine**
- Intelligent drive mode selection
- Safe speed recommendations
- Steering guidance
- Ride height optimization

✅ **Structured Output**
- Complete JSON formatting
- Per-detection metadata
- Frame-level commands
- Mission summaries

✅ **Easy Integration**
- REST API endpoints
- Flask integration example
- Backend-ready JSON output

## Performance Specs

| Metric | Value |
|--------|-------|
| Frame Processing | 15-30 FPS (CPU) |
| Frame Processing | 50-100 FPS (GPU) |
| Model Size | 20-200 MB |
| Memory Usage | 500MB - 2GB |
| Latency | 30-100ms/frame |

## Dependencies

Core requirements (see `requirements.txt`):
- `opencv-python` - Video/image processing
- `ultralytics` - YOLOv8 framework
- `torch` & `torchvision` - Deep learning
- `numpy` - Numerical computing
- `Pillow` - Image operations

Optional for Flask integration:
- `flask` - Web framework
- `flask-cors` - Cross-origin support

## Directory Operations

### Create a new terrain detector
1. Add terrain to `TERRAIN_CONFIG.TERRAIN_TYPES` in `config.py`
2. Add confidence threshold to `CONFIDENCE_THRESHOLDS`
3. Add severity levels to `SEVERITY_LEVELS`
4. Retrain or use existing YOLO model with new class

### Modify decision logic
1. Edit `decision/decision_engine.py`
2. Update `determine_drive_mode()` method
3. Adjust `calculate_recommended_speed()` logic
4. Test with example videos

### Add custom preprocessing
1. Add method to `FrameExtractor` class
2. Update preprocessing pipeline in `InferencePipeline`
3. Call new preprocessing in frame extraction

### Extend API
1. Add endpoint to `api.py` `AIEngineAPI` class
2. Update `integration_example.py` with new Flask route
3. Document new endpoint

## Common Tasks

### Analyze a video
```bash
python -c "from main import AIEngine; engine = AIEngine(); engine.analyze_video('video.mp4')"
```

### Run examples
```bash
python examples.py
```

### Start API server
```bash
python integration_example.py
```

### Check installation
```bash
python -c "from main import AIEngine; print('✓ Ready')"
```

### View configuration
```bash
python -c "from config import *; print(TERRAIN_CONFIG.TERRAIN_TYPES)"
```

## Project Statistics

- **Total Python Files**: 19
- **Total Lines of Code**: ~2,500
- **Documentation Files**: 5
- **Terrain Types**: 8
- **Supported Formats**: 4 (MP4, AVI, MOV, MKV)
- **Decision Modes**: 4 (Safe, Cautious, Offroad, Critical)
- **Severity Levels**: 4 (Low, Medium, High, Critical)

## Version Information

- **Current Version**: 1.0.0
- **Release Date**: 2024-01-15
- **Python Version**: 3.8+
- **YOLOv8 Version**: 8.0.207

## Support & Resources

### Documentation
- [README.md](README.md) - Complete guide
- [QUICKSTART.md](QUICKSTART.md) - Get started in 5 min
- [TECHNICAL.md](TECHNICAL.md) - Architecture details
- [CONFIGURATION.md](CONFIGURATION.md) - Customization guide

### Code Examples
- [examples.py](examples.py) - Usage examples
- [integration_example.py](integration_example.py) - Backend integration

### Configuration
- [config.py](config.py) - All settings

## Next Steps

1. **Install**: `pip install -r requirements.txt`
2. **Verify**: `python examples.py`
3. **Customize**: Edit `config.py` for your needs
4. **Integrate**: Use `integration_example.py` as template
5. **Deploy**: Connect to your backend system

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
**Status**: ✅ Complete & Ready for Production
