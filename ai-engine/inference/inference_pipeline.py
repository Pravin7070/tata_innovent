"""
Complete inference pipeline orchestrating all modules
"""
from typing import Dict, List, Any, Optional
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from preprocessing.video_processor import VideoProcessor
from preprocessing.frame_extractor import FrameExtractor
from detection.yolo_detector import YOLODetector
from severity.severity_calculator import SeverityCalculator
from decision.decision_engine import DecisionEngine
from decision.command_generator import CommandGenerator
from utilities.json_builder import JSONBuilder
from utilities.logger import setup_logger
from config import PROCESSING_CONFIG

logger = setup_logger(__name__)


class InferencePipeline:
    """Complete inference pipeline for video analysis"""
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize inference pipeline
        
        Args:
            model_path: Path to custom YOLO model or None for default
        """
        self.detector = YOLODetector(model_path)
        logger.info("Inference pipeline initialized")
    
    def process_video(
        self,
        video_path: str,
        frame_step: int = PROCESSING_CONFIG.FRAME_EXTRACTION_RATE,
        max_frames: Optional[int] = None,
        current_speed: int = 60
    ) -> Dict[str, Any]:
        """
        Process complete video file
        
        Args:
            video_path: Path to video file
            frame_step: Extract every Nth frame
            max_frames: Maximum frames to process
            current_speed: Current vehicle speed in km/h
            
        Returns:
            Complete analysis result JSON
        """
        logger.info(f"Starting video processing: {video_path}")
        
        # Initialize video processor
        video_processor = VideoProcessor(video_path)
        if not video_processor.cap:
            logger.error("Failed to initialize video processor")
            return {'error': 'Failed to open video file'}
        
        video_props = video_processor.get_properties()
        logger.info(f"Video properties: {video_props}")
        
        # Extract frames
        logger.info("Extracting frames...")
        frames = FrameExtractor.extract_frame_batch(
            video_processor,
            frame_step=frame_step,
            max_frames=max_frames or PROCESSING_CONFIG.MAX_FRAMES_PER_VIDEO
        )
        
        # Run detection on all frames
        logger.info("Running detection on all frames...")
        batch_results = self.detector.detect_batch(frames)
        
        # Process each frame result
        logger.info("Processing detection results...")
        all_detections = []
        all_decisions = []
        all_detection_commands = []
        
        for frame_idx, detection_result in enumerate(batch_results):
            frame_number = detection_result['frame_number']
            timestamp = detection_result['timestamp']
            detections = detection_result['detections']
            frame_shape = detection_result['frame_shape']
            
            # Assess severity for detections
            if detections:
                severity_assessments = SeverityCalculator.assess_terrain_severity(
                    detections,
                    frame_shape[1],  # width
                    frame_shape[0]   # height
                )
                
                # Make vehicle control decision
                decision = DecisionEngine.make_decision(
                    severity_assessments,
                    frame_shape[1],
                    frame_shape[0],
                    current_speed
                )
                
                # Generate detection commands
                detection_commands = []
                for assessment in severity_assessments:
                    cmd = CommandGenerator.generate_detection_command(
                        terrain=assessment['terrain'],
                        confidence=assessment['confidence'],
                        bbox=assessment['bbox'],
                        frame_number=frame_number,
                        timestamp=FrameExtractor.get_frame_timestamp(
                            frame_number, video_props['fps']
                        ),
                        severity=assessment['severity'],
                        risk_level=assessment['risk_level'],
                        drive_mode=decision['drive_mode'],
                        ride_height=decision['ride_height'],
                        recommended_speed=decision['recommended_speed'],
                        steering_recommendation=decision['steering_recommendation']
                    )
                    detection_commands.append(cmd)
                
                all_detections.append(detection_commands)
                all_decisions.append(decision)
                all_detection_commands.extend(detection_commands)
            else:
                # No detections - default safe decision
                default_decision = {
                    'drive_mode': 'Safe',
                    'ride_height': 'Normal',
                    'recommended_speed': min(current_speed, 100),
                    'steering_recommendation': 'Maintain Course',
                    'primary_threat': None,
                    'threat_severity': 0,
                    'threat_level': 'Low',
                    'total_detections': 0
                }
                all_decisions.append(default_decision)
                all_detections.append([])
            
            if (frame_idx + 1) % 10 == 0:
                logger.info(f"Processed {frame_idx + 1}/{len(batch_results)} frames")
        
        # Generate mission summary
        logger.info("Generating mission summary...")
        mission_summary = CommandGenerator.generate_mission_summary(
            video_path=video_path,
            total_frames=video_props['total_frames'],
            processed_frames=len(batch_results),
            all_detections=all_detections,
            all_decisions=all_decisions
        )
        
        # Close video processor
        video_processor.close()
        
        # Compile final result
        result = {
            'status': 'success',
            'video_analysis': {
                'video_path': video_path,
                'total_frames': video_props['total_frames'],
                'processed_frames': len(batch_results),
                'fps': video_props['fps'],
                'resolution': f"{video_props['width']}x{video_props['height']}",
                'total_detections': len(all_detection_commands),
                'detections': all_detection_commands,
                'mission_summary': mission_summary['MissionSummary']
            }
        }
        
        logger.info("Video processing complete")
        return result
    
    def process_frame(
        self,
        frame_array,
        frame_number: int = 0,
        timestamp: str = '00:00:00.000',
        current_speed: int = 60
    ) -> Dict[str, Any]:
        """
        Process single frame
        
        Args:
            frame_array: Single frame array (BGR format)
            frame_number: Frame number
            timestamp: Frame timestamp
            current_speed: Current vehicle speed
            
        Returns:
            Frame analysis result JSON
        """
        logger.info(f"Processing frame {frame_number}")
        
        # Run detection
        detections = self.detector.detect(frame_array)
        
        frame_height, frame_width = frame_array.shape[:2]
        
        # Process detections
        result_commands = []
        
        if detections:
            # Assess severity
            severity_assessments = SeverityCalculator.assess_terrain_severity(
                detections,
                frame_width,
                frame_height
            )
            
            # Make decision
            decision = DecisionEngine.make_decision(
                severity_assessments,
                frame_width,
                frame_height,
                current_speed
            )
            
            # Generate commands
            for assessment in severity_assessments:
                cmd = CommandGenerator.generate_detection_command(
                    terrain=assessment['terrain'],
                    confidence=assessment['confidence'],
                    bbox=assessment['bbox'],
                    frame_number=frame_number,
                    timestamp=timestamp,
                    severity=assessment['severity'],
                    risk_level=assessment['risk_level'],
                    drive_mode=decision['drive_mode'],
                    ride_height=decision['ride_height'],
                    recommended_speed=decision['recommended_speed'],
                    steering_recommendation=decision['steering_recommendation']
                )
                result_commands.append(cmd)
        else:
            decision = {
                'drive_mode': 'Safe',
                'ride_height': 'Normal',
                'recommended_speed': min(current_speed, 100),
                'steering_recommendation': 'Maintain Course',
                'primary_threat': None,
                'threat_severity': 0,
                'threat_level': 'Low'
            }
        
        frame_command = CommandGenerator.generate_frame_command(
            frame_number=frame_number,
            timestamp=timestamp,
            detections=result_commands,
            decision=decision
        )
        
        return frame_command
    
    def get_detector_stats(self) -> Dict[str, Any]:
        """
        Get detector statistics
        
        Returns:
            Detector statistics
        """
        return {
            'model_name': 'YOLOv8',
            'device': 'cpu',  # Update based on actual device
            'status': 'ready'
        }
