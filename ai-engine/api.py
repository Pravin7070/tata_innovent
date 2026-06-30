"""
REST API module for AI Engine (for integration with backend)
"""
from typing import Dict, Any, Optional
import json
from datetime import datetime
from utilities.logger import setup_logger

logger = setup_logger('AIEngineAPI')


class AIEngineAPI:
    """REST API interface for AI Engine"""
    
    def __init__(self, ai_engine):
        """
        Initialize API
        
        Args:
            ai_engine: AIEngine instance
        """
        self.engine = ai_engine
        logger.info("AI Engine API initialized")
    
    def health_check(self) -> Dict[str, Any]:
        """
        Health check endpoint
        
        Returns:
            Health status JSON
        """
        return {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'service': 'ai-engine'
        }
    
    def analyze_video_request(
        self,
        video_path: str,
        frame_step: int = 10,
        max_frames: Optional[int] = None,
        current_speed: int = 60
    ) -> Dict[str, Any]:
        """
        API endpoint for video analysis
        
        Args:
            video_path: Path to video file
            frame_step: Frame extraction step
            max_frames: Maximum frames to process
            current_speed: Current vehicle speed
            
        Returns:
            API response JSON
        """
        logger.info(f"API request: analyze_video - {video_path}")
        
        try:
            result = self.engine.analyze_video(
                video_path=video_path,
                frame_step=frame_step,
                max_frames=max_frames,
                current_speed=current_speed
            )
            
            return {
                'success': True,
                'data': result,
                'timestamp': datetime.now().isoformat()
            }
        
        except Exception as e:
            logger.error(f"API error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def analyze_frame_request(
        self,
        frame_data: bytes,
        frame_number: int = 0,
        timestamp: str = '00:00:00.000',
        current_speed: int = 60
    ) -> Dict[str, Any]:
        """
        API endpoint for frame analysis
        
        Args:
            frame_data: Frame data (bytes)
            frame_number: Frame number
            timestamp: Frame timestamp
            current_speed: Current vehicle speed
            
        Returns:
            API response JSON
        """
        logger.info(f"API request: analyze_frame - {frame_number}")
        
        try:
            # Convert bytes to frame array (implementation depends on encoding)
            # This is a placeholder
            import numpy as np
            frame_array = np.frombuffer(frame_data, dtype=np.uint8)
            
            result = self.engine.analyze_frame(
                frame_array=frame_array,
                frame_number=frame_number,
                timestamp=timestamp,
                current_speed=current_speed
            )
            
            return {
                'success': True,
                'data': result,
                'timestamp': datetime.now().isoformat()
            }
        
        except Exception as e:
            logger.error(f"API error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_engine_status(self) -> Dict[str, Any]:
        """
        Get engine status endpoint
        
        Returns:
            Engine status JSON
        """
        status = self.engine.get_status()
        return {
            'success': True,
            'data': status,
            'timestamp': datetime.now().isoformat()
        }


def create_api_response(
    success: bool,
    data: Any = None,
    error: str = None
) -> Dict[str, Any]:
    """
    Create standardized API response
    
    Args:
        success: Request success status
        data: Response data
        error: Error message if failed
        
    Returns:
        Standardized response JSON
    """
    response = {
        'success': success,
        'timestamp': datetime.now().isoformat()
    }
    
    if success and data is not None:
        response['data'] = data
    elif not success and error:
        response['error'] = error
    
    return response
