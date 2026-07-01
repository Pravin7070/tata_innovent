"""
Main application entry point for AI Engine
"""
import sys
import os
import json
from typing import Dict, Any, Optional

if __name__ == '__main__':
    # Only modify sys.path when running ai-engine directly as a script.
    module_dir = os.path.dirname(os.path.abspath(__file__))
    if module_dir not in sys.path:
        sys.path.insert(0, module_dir)

from inference.inference_pipeline import InferencePipeline
from utilities.json_builder import JSONBuilder
from utilities.logger import setup_logger
from config import PROCESSING_CONFIG

logger = setup_logger('AIEngine')


class AIEngine:
    """Main AI Engine class for terrain detection and vehicle control"""
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize AI Engine
        
        Args:
            model_path: Path to custom YOLO model
        """
        self.pipeline = InferencePipeline(model_path)
        logger.info("AI Engine initialized successfully")
    
    def analyze_video(
        self,
        video_path: str,
        frame_step: int = PROCESSING_CONFIG.FRAME_EXTRACTION_RATE,
        max_frames: Optional[int] = None,
        current_speed: int = 60
    ) -> Dict[str, Any]:
        """
        Analyze video file and generate vehicle commands
        
        Args:
            video_path: Path to video file
            frame_step: Extract every Nth frame
            max_frames: Maximum frames to process
            current_speed: Current vehicle speed in km/h
            
        Returns:
            Complete analysis with vehicle commands in JSON format
        """
        logger.info(f"Starting video analysis: {video_path}")
        
        try:
            result = self.pipeline.process_video(
                video_path=video_path,
                frame_step=frame_step,
                max_frames=max_frames,
                current_speed=current_speed
            )
            
            logger.info("Video analysis completed successfully")
            return result
        
        except Exception as e:
            logger.error(f"Error during video analysis: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def analyze_frame(
        self,
        frame_array,
        frame_number: int = 0,
        timestamp: str = '00:00:00.000',
        current_speed: int = 60
    ) -> Dict[str, Any]:
        """
        Analyze single frame
        
        Args:
            frame_array: Frame array (BGR format)
            frame_number: Frame number
            timestamp: Frame timestamp
            current_speed: Current vehicle speed in km/h
            
        Returns:
            Frame analysis with vehicle commands in JSON format
        """
        logger.info(f"Analyzing frame {frame_number}")
        
        try:
            result = self.pipeline.process_frame(
                frame_array=frame_array,
                frame_number=frame_number,
                timestamp=timestamp,
                current_speed=current_speed
            )
            
            return result
        
        except Exception as e:
            logger.error(f"Error during frame analysis: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get AI Engine status
        
        Returns:
            Status information
        """
        return {
            'status': 'ready',
            'engine': 'AIEngine',
            'version': '1.0.0',
            'detector_stats': self.pipeline.get_detector_stats(),
            'supported_terrains': [
                'Road', 'Mud', 'Stone', 'Pothole', 'Bush', 'Water', 'Slope', 'Gravel'
            ]
        }


def main():
    """Main entry point"""
    logger.info("Starting AI Engine")
    
    # Initialize AI Engine
    engine = AIEngine()
    
    # Example usage
    logger.info("AI Engine ready for analysis")
    logger.info(f"Status: {json.dumps(engine.get_status(), indent=2)}")
    
    return engine


if __name__ == '__main__':
    engine = main()
