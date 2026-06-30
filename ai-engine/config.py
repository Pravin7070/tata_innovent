"""
Configuration module for AI Engine
"""
import os
from dataclasses import dataclass
from typing import List, Dict


@dataclass
class TerrainConfig:
    """Configuration for terrain types and their detection parameters"""
    TERRAIN_TYPES = [
        'Road',
        'Mud',
        'Stone',
        'Pothole',
        'Bush',
        'Water',
        'Slope',
        'Gravel'
    ]
    
    # Confidence thresholds for each terrain type
    CONFIDENCE_THRESHOLDS = {
        'Road': 0.50,
        'Mud': 0.55,
        'Stone': 0.60,
        'Pothole': 0.65,
        'Bush': 0.58,
        'Water': 0.70,
        'Slope': 0.60,
        'Gravel': 0.55
    }
    
    # Severity levels for each terrain
    SEVERITY_LEVELS = {
        'Road': {'min': 0.0, 'max': 20.0, 'level': 'Low'},
        'Mud': {'min': 40.0, 'max': 80.0, 'level': 'High'},
        'Stone': {'min': 30.0, 'max': 70.0, 'level': 'Medium'},
        'Pothole': {'min': 60.0, 'max': 100.0, 'level': 'Critical'},
        'Bush': {'min': 20.0, 'max': 50.0, 'level': 'Medium'},
        'Water': {'min': 70.0, 'max': 100.0, 'level': 'Critical'},
        'Slope': {'min': 35.0, 'max': 90.0, 'level': 'High'},
        'Gravel': {'min': 25.0, 'max': 65.0, 'level': 'Medium'}
    }


@dataclass
class ModelConfig:
    """Configuration for YOLOv8 model"""
    MODEL_NAME = 'yolov8n.pt'  # nano model for faster inference
    CONFIDENCE_THRESHOLD = 0.45
    IOU_THRESHOLD = 0.45
    IMAGE_SIZE = 640
    DEVICE = 'cpu'  # Can be 'cuda' for GPU


@dataclass
class ProcessingConfig:
    """Configuration for video/frame processing"""
    FRAME_EXTRACTION_RATE = 10  # Extract every Nth frame
    MAX_FRAMES_PER_VIDEO = 300
    OUTPUT_IMAGE_SIZE = (640, 480)
    VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mov', '.mkv']


@dataclass
class DecisionConfig:
    """Configuration for decision engine"""
    # Drive modes based on severity
    DRIVE_MODES = {
        'Safe': {'min_speed': 40, 'max_speed': 100, 'ride_height': 'Normal'},
        'Cautious': {'min_speed': 20, 'max_speed': 50, 'ride_height': 'Normal'},
        'Offroad': {'min_speed': 10, 'max_speed': 40, 'ride_height': 'High'},
        'Critical': {'min_speed': 0, 'max_speed': 15, 'ride_height': 'Maximum'}
    }
    
    # Risk level thresholds
    RISK_LEVELS = {
        'Low': (0, 25),
        'Medium': (25, 50),
        'High': (50, 75),
        'Critical': (75, 100)
    }


# Global configuration
TERRAIN_CONFIG = TerrainConfig()
MODEL_CONFIG = ModelConfig()
PROCESSING_CONFIG = ProcessingConfig()
DECISION_CONFIG = DecisionConfig()
