# Deployment & Setup Guide

## System Requirements

### Minimum
- Python 3.8+
- 4GB RAM
- 2GB Disk Space
- CPU: i5 or equivalent

### Recommended
- Python 3.10+
- 16GB RAM
- 10GB Disk Space
- GPU: NVIDIA with CUDA support

## Installation Steps

### Step 1: Install Python Packages

```bash
cd ai-engine
pip install -r requirements.txt
```

**Expected output**:
```
Successfully installed opencv-python-4.8.1.78 ultralytics-8.0.207 ...
```

### Step 2: Verify Installation

```bash
# Test imports
python -c "from main import AIEngine; print('✓ AIEngine imported')"
python -c "from ultralytics import YOLO; print('✓ YOLOv8 imported')"
python -c "import cv2; print(f'✓ OpenCV {cv2.__version__}')"
```

### Step 3: Download YOLOv8 Model

```bash
# Download model weights (first run automatic)
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

**Note**: This will download ~25MB model file. Future runs will use cached version.

### Step 4: Run Tests

```bash
# Run example script
python examples.py
```

**Expected output**:
```
========================================
AI ENGINE - TERRAIN DETECTION & VEHICLE CONTROL DECISION SYSTEM
========================================

================================================================================
EXAMPLE 3: Engine Status
================================================================================

Engine Status:
{
  "status": "ready",
  "engine": "AIEngine",
  "version": "1.0.0",
  "detector_stats": {
    "model_name": "YOLOv8",
    "device": "cpu",
    "status": "ready"
  },
  "supported_terrains": [
    "Road",
    "Mud",
    "Stone",
    "Pothole",
    "Bush",
    "Water",
    "Slope",
    "Gravel"
  ]
}
```

## Configuration Setup

### Basic Configuration

Edit `config.py`:

```python
# Enable GPU if available
MODEL_CONFIG.DEVICE = 'cuda'  # or 'cpu'

# Adjust frame extraction rate
PROCESSING_CONFIG.FRAME_EXTRACTION_RATE = 10

# Adjust confidence thresholds
TERRAIN_CONFIG.CONFIDENCE_THRESHOLDS['Pothole'] = 0.65
```

### Advanced Configuration

See [CONFIGURATION.md](CONFIGURATION.md) for detailed options.

## API Server Setup

### Option 1: Flask Development Server

```bash
python integration_example.py
```

**Output**:
```
 * Running on http://0.0.0.0:5000
```

### Option 2: Production Server (Gunicorn)

```bash
# Install gunicorn
pip install gunicorn

# Run server
gunicorn -w 4 -b 0.0.0.0:5000 integration_example:app
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Engine status
curl http://localhost:5000/status

# Supported terrains
curl http://localhost:5000/terrains
```

## Video Analysis Setup

### Prepare Video File

1. Place video in accessible location
2. Supported formats: MP4, AVI, MOV, MKV
3. Recommended resolution: 1920×1080 or higher

### Run Analysis

```python
from main import AIEngine
import json

# Initialize engine
engine = AIEngine()

# Analyze video
result = engine.analyze_video(
    video_path='path/to/video.mp4',
    frame_step=10,
    max_frames=300,
    current_speed=60
)

# Save results
with open('output.json', 'w') as f:
    json.dump(result, f, indent=2)
```

## Database Integration

### Example: Save Results to Database

```python
import pymongo
from main import AIEngine

engine = AIEngine()
client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['tata4x4']

result = engine.analyze_video('video.mp4')

# Save to MongoDB
db.analyses.insert_one(result)
```

### Example: Save Results to PostgreSQL

```python
import psycopg2
import json
from main import AIEngine

engine = AIEngine()
conn = psycopg2.connect("dbname=tata4x4 user=postgres")
cur = conn.cursor()

result = engine.analyze_video('video.mp4')

# Save to PostgreSQL
cur.execute(
    "INSERT INTO analyses (data) VALUES (%s)",
    (json.dumps(result),)
)
conn.commit()
```

## Docker Deployment (Optional)

### Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY ai-engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY ai-engine .

# Expose API port
EXPOSE 5000

# Run application
CMD ["python", "integration_example.py"]
```

### Build and Run

```bash
# Build image
docker build -t ai-engine .

# Run container
docker run -p 5000:5000 ai-engine

# Run with GPU support
docker run --gpus all -p 5000:5000 ai-engine
```

## Performance Tuning

### For Maximum Speed

```python
from config import MODEL_CONFIG, PROCESSING_CONFIG

# Use smallest model
MODEL_CONFIG.MODEL_NAME = 'yolov8n.pt'

# Skip more frames
PROCESSING_CONFIG.FRAME_EXTRACTION_RATE = 20

# Enable GPU
MODEL_CONFIG.DEVICE = 'cuda'

# Reduce max frames
max_frames = 100
```

### For Maximum Accuracy

```python
from config import MODEL_CONFIG, PROCESSING_CONFIG

# Use largest model
MODEL_CONFIG.MODEL_NAME = 'yolov8l.pt'

# Process all frames
PROCESSING_CONFIG.FRAME_EXTRACTION_RATE = 1

# Enable GPU
MODEL_CONFIG.DEVICE = 'cuda'

# Increase max frames
max_frames = 500
```

## Monitoring & Logging

### Check Logs

```python
from utilities.logger import setup_logger
import logging

# Enable debug logging
logger = setup_logger(__name__, level=logging.DEBUG)
```

### Log File Setup

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ai-engine.log'),
        logging.StreamHandler()
    ]
)
```

## Troubleshooting

### Issue: ModuleNotFoundError

```bash
# Solution: Install missing dependencies
pip install -r requirements.txt

# Or install specific package
pip install ultralytics
```

### Issue: CUDA Not Found

```python
# Solution: Use CPU instead
from config import MODEL_CONFIG
MODEL_CONFIG.DEVICE = 'cpu'
```

### Issue: Out of Memory

```python
# Solution 1: Reduce batch size
result = engine.analyze_video(max_frames=50)

# Solution 2: Skip more frames
result = engine.analyze_video(frame_step=30)

# Solution 3: Use smaller model
MODEL_CONFIG.MODEL_NAME = 'yolov8n.pt'
```

### Issue: Slow Performance

```python
# Solution 1: Enable GPU
MODEL_CONFIG.DEVICE = 'cuda'

# Solution 2: Use smaller model
MODEL_CONFIG.MODEL_NAME = 'yolov8n.pt'

# Solution 3: Skip frames
PROCESSING_CONFIG.FRAME_EXTRACTION_RATE = 20
```

## Verification Checklist

- [ ] Python installed (3.8+)
- [ ] Requirements installed: `pip install -r requirements.txt`
- [ ] YOLOv8 model downloaded
- [ ] Tests pass: `python examples.py`
- [ ] Engine initializes: `python -c "from main import AIEngine; AIEngine()"`
- [ ] Configuration reviewed: Check `config.py`
- [ ] API server runs: `python integration_example.py`
- [ ] Video file prepared: Place test video ready
- [ ] Database configured (optional): Connection tested
- [ ] Logging enabled: Verify logs appear

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Configuration optimized
- [ ] Error handling verified
- [ ] Logging enabled
- [ ] Database connections tested
- [ ] API endpoints tested
- [ ] Performance acceptable
- [ ] Documentation updated

### Deployment Steps

1. **Environment Setup**
   ```bash
   # Create virtual environment
   python -m venv ai-engine-env
   source ai-engine-env/bin/activate
   pip install -r requirements.txt
   ```

2. **Configuration**
   - Edit `config.py` for production settings
   - Set `DEVICE = 'cuda'` for GPU
   - Optimize thresholds based on testing

3. **Database**
   - Connect to production database
   - Create required tables/collections
   - Test connections

4. **API Server**
   - Use Gunicorn or similar for production
   - Configure port and workers
   - Set up reverse proxy (Nginx)

5. **Monitoring**
   - Set up logging to file/service
   - Configure alerts for errors
   - Monitor GPU/CPU usage

6. **Testing**
   - Run full test suite
   - Process sample videos
   - Verify JSON output
   - Test database integration

### Health Monitoring

```python
import time
from main import AIEngine

engine = AIEngine()

# Monitor performance
start = time.time()
result = engine.analyze_video('test_video.mp4')
elapsed = time.time() - start

print(f"Processing time: {elapsed:.2f}s")
print(f"Status: {result['status']}")
print(f"Detections: {result['video_analysis']['total_detections']}")
```

## Maintenance

### Regular Tasks

1. **Update Models**
   ```bash
   pip install --upgrade ultralytics
   ```

2. **Monitor Performance**
   - Track processing times
   - Monitor memory usage
   - Check error logs

3. **Backup Configuration**
   - Backup modified `config.py`
   - Document customizations
   - Version control changes

4. **Update Dependencies**
   ```bash
   pip install --upgrade -r requirements.txt
   ```

## Support & Debugging

### Enable Verbose Logging

```python
from utilities.logger import setup_logger
import logging

logger = setup_logger('AIEngine', level=logging.DEBUG)
```

### Test Individual Modules

```python
# Test preprocessing
from preprocessing.video_processor import VideoProcessor
vp = VideoProcessor('test.mp4')
print(vp.get_properties())

# Test detection
from detection.yolo_detector import YOLODetector
detector = YOLODetector()
print("Detector ready")

# Test decision engine
from decision.decision_engine import DecisionEngine
print("Decision engine ready")
```

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
