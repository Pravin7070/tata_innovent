# AI Engine - Technical Documentation

## Architecture Overview

The AI Engine is built on a modular, pipeline-based architecture:

```
Video Input
    ↓
[VideoProcessor] - Read and parse video
    ↓
[FrameExtractor] - Extract frames at intervals
    ↓
[YOLODetector] - Run object detection
    ↓
[SeverityCalculator] - Calculate severity scores
    ↓
[DecisionEngine] - Make control decisions
    ↓
[CommandGenerator] - Create JSON output
    ↓
Structured JSON Output to Backend
```

## Module Details

### VideoProcessor

**Purpose**: Handle video file I/O and metadata extraction

**Key Methods**:
- `__init__(video_path)` - Initialize video capture
- `get_properties()` - Get video metadata
- `get_frame_at_number(frame_number)` - Retrieve specific frame
- `get_next_frame()` - Sequential frame reading
- `reset()` - Rewind to start
- `close()` - Release resources

**Supported Formats**: MP4, AVI, MOV, MKV

**Output**: Frame array (numpy), timestamp, frame number

### FrameExtractor

**Purpose**: Extract and preprocess frames

**Key Methods**:
- `extract_frame_batch()` - Extract multiple frames
- `preprocess_frame()` - Resize and normalize
- `enhance_contrast()` - Improve detection quality
- `convert_color_space()` - RGB/BGR/HSV conversion
- `apply_blur()` - Gaussian blur
- `get_frame_timestamp()` - Calculate time code

**Preprocessing Pipeline**:
1. Frame extraction at specified interval
2. Optional color space conversion
3. Optional contrast enhancement
4. Resizing to model input size
5. Normalization

### YOLODetector

**Purpose**: Run object detection for terrain classification

**Key Methods**:
- `detect(frame)` - Single frame inference
- `detect_batch(frames)` - Multiple frames
- `filter_detections()` - Filter by confidence/area
- `get_detection_statistics()` - Statistical analysis

**Model Details**:
- Base Model: YOLOv8 Nano (20MB, fastest)
- Can use: Small, Medium, Large, XLarge variants
- Input Size: 640×640 (configurable)
- Output: Bounding boxes + class + confidence

**Detection Output Format**:
```python
{
    'terrain': str,              # Terrain type
    'confidence': float,         # 0-1
    'bbox': {
        'x': float, 'y': float,  # Top-left corner
        'x2': float, 'y2': float, # Bottom-right corner
        'w': float, 'h': float   # Width, height
    },
    'area': float               # Pixel area
}
```

### SeverityCalculator

**Purpose**: Assess terrain severity and risk

**Severity Calculation**:
```
Severity = BaseSeverity × ConfidenceFactor × AreaFactor × CenterFactor

Where:
- BaseSeverity = terrain-specific max severity (0-100)
- ConfidenceFactor = detection confidence (0-1)
- AreaFactor = normalized bbox area (0-1)
- CenterFactor = proximity to frame center (0.7-1.0)
```

**Key Methods**:
- `calculate_severity()` - Compute severity score
- `calculate_risk_level()` - Classify risk level
- `assess_terrain_severity()` - Process all detections
- `get_frame_danger_level()` - Overall frame risk
- `identify_critical_detections()` - Find critical threats

**Risk Level Mapping**:
- Low: 0-25
- Medium: 25-50
- High: 50-75
- Critical: 75-100

### DecisionEngine

**Purpose**: Make intelligent vehicle control decisions

**Decision Algorithm**:

```
1. Identify primary threat (highest severity)
2. Determine drive mode based on threat level and terrain
3. Set ride height appropriate for terrain
4. Calculate safe recommended speed
5. Generate steering recommendation
```

**Drive Mode Selection Logic**:
```
Critical threat → Critical mode (0-15 km/h, max height)
High severity + (Water/Mud/Slope) → Offroad mode (10-40 km/h, high)
Medium severity + rough terrain → Offroad mode
Otherwise → Cautious or Safe mode
```

**Steering Logic**:
```
- Detections center-left of frame → Steer Right
- Detections center-right of frame → Steer Left
- Otherwise → Maintain Course
```

**Key Methods**:
- `determine_drive_mode()` - Select drive mode
- `determine_ride_height()` - Set ride height
- `calculate_recommended_speed()` - Compute safe speed
- `generate_steering_recommendation()` - Steering guidance
- `make_decision()` - Complete decision package

### CommandGenerator

**Purpose**: Create structured JSON output

**Output Structures**:

**1. Detection Result** (per detection):
```json
{
  "Terrain": string,
  "Confidence": number,
  "BoundingBox": {x, y, width, height},
  "FrameNumber": number,
  "Timestamp": string (HH:MM:SS.mmm),
  "Severity": number (0-100),
  "RiskLevel": string,
  "DriveMode": string,
  "RideHeight": string,
  "RecommendedSpeed": number,
  "SteeringRecommendation": string,
  "ProcessedAt": ISO timestamp
}
```

**2. Frame Command** (per frame):
```json
{
  "FrameCommand": {
    "FrameNumber": number,
    "Timestamp": string,
    "DetectionCount": number,
    "DriveMode": string,
    "RideHeight": string,
    "RecommendedSpeed": number,
    "SteeringRecommendation": string,
    "PrimaryThreat": string,
    "ThreatSeverity": number,
    "ThreatLevel": string,
    "Detections": array,
    "CommandGeneratedAt": ISO timestamp
  }
}
```

**3. Mission Summary** (per video):
```json
{
  "MissionSummary": {
    "VideoPath": string,
    "TotalFrames": number,
    "ProcessedFrames": number,
    "ProcessingRate": string,
    "Statistics": {
      "TerrainDetectionCounts": object,
      "AverageConfidenceByTerrain": object,
      "MaxSeverityByTerrain": object,
      "RiskDistribution": object,
      "TotalDetections": number,
      "OverallAverageSeverity": number
    },
    "DriveModeDistribution": object,
    "CriticalFrames": number,
    "CriticalFramesList": array,
    "CompletedAt": ISO timestamp
  }
}
```

### InferencePipeline

**Purpose**: Orchestrate all modules

**Workflow**:
1. Load video via VideoProcessor
2. Extract frames using FrameExtractor
3. Run detection with YOLODetector
4. Assess severity with SeverityCalculator
5. Make decisions with DecisionEngine
6. Generate commands with CommandGenerator
7. Compile results and return JSON

**Key Methods**:
- `process_video()` - Complete video analysis
- `process_frame()` - Single frame analysis
- `get_detector_stats()` - Model information

## Severity Calculation Details

### Terrain-Specific Severity Ranges

| Terrain | Min | Max | Level |
|---------|-----|-----|-------|
| Road | 0 | 20 | Low |
| Mud | 40 | 80 | High |
| Stone | 30 | 70 | Medium |
| Pothole | 60 | 100 | Critical |
| Bush | 20 | 50 | Medium |
| Water | 70 | 100 | Critical |
| Slope | 35 | 90 | High |
| Gravel | 25 | 65 | Medium |

### Confidence Thresholds

| Terrain | Threshold |
|---------|-----------|
| Road | 0.50 |
| Mud | 0.55 |
| Stone | 0.60 |
| Pothole | 0.65 |
| Bush | 0.58 |
| Water | 0.70 |
| Slope | 0.60 |
| Gravel | 0.55 |

## Performance Characteristics

### Computational Complexity

- **Per Frame**:
  - Detection: O(HW) where H×W = image size
  - Severity: O(n) where n = number of detections
  - Decision: O(n log n) (sorting by severity)
  - Total: ~30-100ms per frame (CPU)

### Memory Usage

| Component | Memory |
|-----------|--------|
| Model (nano) | 20 MB |
| Model (small) | 50 MB |
| Frame buffer | 3 MB (640×480×3 bytes) |
| Batch buffer | 90 MB (300 frames) |
| System overhead | 100-200 MB |

### Throughput

- **CPU (i7)**: 15-30 FPS
- **GPU (RTX 3060)**: 50-100 FPS
- **Processing**: Can be real-time for video playback speeds

## Error Handling

### Graceful Degradation

```
If detection fails:
  → Return empty detection list
  → Set safe default decision
  → Continue processing

If frame extraction fails:
  → Skip to next frame
  → Log warning
  → Continue batch

If severity calculation fails:
  → Use base terrain severity
  → Continue processing
```

### Exception Handling

- File not found → Return error with message
- Invalid frame → Skip frame, continue batch
- Model loading failure → Raise exception, prevent startup
- Out of memory → Reduce batch size, retry

## Configuration Hierarchy

1. **Hard-coded defaults** in `config.py`
2. **Runtime parameters** in method calls
3. **Environment variables** (optional)

Example override:
```python
engine.analyze_video(
    video_path='video.mp4',
    frame_step=5,              # Override default
    current_speed=80           # Override default
)
```

## Data Flow Example

### Single Frame Analysis

```
Input: Frame (1920×1080), Frame#42, Timestamp 00:00:01.400

1. Preprocessing:
   - Resize to 640×640
   - Convert BGR to RGB
   - Normalize

2. Detection:
   - Run YOLOv8
   - Get: [Pothole(0.85), Mud(0.72)]

3. Severity:
   - Pothole: severity=87.5, risk=Critical
   - Mud: severity=45.2, risk=Medium

4. Decision:
   - Primary threat: Pothole
   - Drive mode: Critical
   - Speed: 10 km/h
   - Height: Maximum
   - Steering: Maintain Course

5. Command:
   - Create JSON with all fields
   - Add timestamps, metadata

Output: Structured JSON command
```

## Integration Points

### Input
- Video files (MP4, AVI, MOV, MKV)
- Raw frame arrays (numpy)
- Frame data (base64 encoded)

### Output
- JSON (all results)
- Statistics (via JSONBuilder)
- Raw detections (via detector)

### Backend Communication
- REST API (Flask example provided)
- JSON serialization
- Error handling and status codes

---

**Last Updated**: 2024-01-15
