"""
Integration guide for connecting AI Engine with backend services
"""

# Example: How to integrate with Flask backend

from flask import Flask, request, jsonify
from main import AIEngine
from api import AIEngineAPI
import cv2
import numpy as np
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Initialize AI Engine
ai_engine = AIEngine()
api = AIEngineAPI(ai_engine)

# Configuration
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify(api.health_check())


@app.route('/status', methods=['GET'])
def get_status():
    """Get AI Engine status"""
    return jsonify(api.get_engine_status())


@app.route('/analyze/video', methods=['POST'])
def analyze_video():
    """Analyze video file"""
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'File type not allowed'
            }), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Get parameters
        frame_step = int(request.form.get('frame_step', 10))
        max_frames = int(request.form.get('max_frames', 300))
        current_speed = int(request.form.get('current_speed', 60))
        
        # Process video
        result = api.analyze_video_request(
            video_path=filepath,
            frame_step=frame_step,
            max_frames=max_frames,
            current_speed=current_speed
        )
        
        # Cleanup
        os.remove(filepath)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/analyze/frame', methods=['POST'])
def analyze_frame():
    """Analyze single frame"""
    try:
        # Get frame data
        data = request.get_json()
        
        if 'frame_data' not in data:
            return jsonify({
                'success': False,
                'error': 'No frame data provided'
            }), 400
        
        frame_data = data['frame_data']
        frame_number = data.get('frame_number', 0)
        timestamp = data.get('timestamp', '00:00:00.000')
        current_speed = data.get('current_speed', 60)
        
        # Process frame
        result = api.analyze_frame_request(
            frame_data=frame_data,
            frame_number=frame_number,
            timestamp=timestamp,
            current_speed=current_speed
        )
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/terrains', methods=['GET'])
def get_supported_terrains():
    """Get list of supported terrain types"""
    return jsonify({
        'success': True,
        'data': {
            'supported_terrains': [
                'Road', 'Mud', 'Stone', 'Pothole', 'Bush', 'Water', 'Slope', 'Gravel'
            ]
        }
    })


if __name__ == '__main__':
    # Run Flask app
    app.run(host='0.0.0.0', port=5000, debug=False)
