"""
Video processing module for reading and handling video files
"""
import cv2
import os
from typing import Optional, Tuple
from pathlib import Path
from utilities.logger import setup_logger

logger = setup_logger(__name__)


class VideoProcessor:
    """Handle video file reading and metadata extraction"""
    
    def __init__(self, video_path: str):
        """
        Initialize video processor
        
        Args:
            video_path: Path to video file
        """
        self.video_path = video_path
        self.cap = None
        self.properties = {}
        self._initialize()
    
    def _initialize(self) -> bool:
        """
        Initialize video capture and extract properties
        
        Returns:
            True if successful, False otherwise
        """
        if not os.path.exists(self.video_path):
            logger.error(f"Video file not found: {self.video_path}")
            return False
        
        try:
            self.cap = cv2.VideoCapture(self.video_path)
            
            if not self.cap.isOpened():
                logger.error(f"Failed to open video: {self.video_path}")
                return False
            
            # Extract video properties
            self.properties = {
                'total_frames': int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT)),
                'fps': self.cap.get(cv2.CAP_PROP_FPS),
                'width': int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
                'height': int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
                'codec': int(self.cap.get(cv2.CAP_PROP_FOURCC))
            }
            
            logger.info(f"Video loaded successfully: {self.video_path}")
            logger.info(f"Frames: {self.properties['total_frames']}, "
                       f"FPS: {self.properties['fps']}, "
                       f"Resolution: {self.properties['width']}x{self.properties['height']}")
            
            return True
        except Exception as e:
            logger.error(f"Error initializing video processor: {str(e)}")
            return False
    
    def get_properties(self) -> dict:
        """
        Get video properties
        
        Returns:
            Dictionary of video properties
        """
        return self.properties.copy()
    
    def get_frame_at_number(self, frame_number: int) -> Optional[Tuple[bool, any, float]]:
        """
        Get specific frame by frame number
        
        Args:
            frame_number: Frame number to retrieve
            
        Returns:
            Tuple of (success, frame, timestamp) or (False, None, 0)
        """
        if not self.cap:
            logger.error("Video capture not initialized")
            return False, None, 0.0
        
        try:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
            ret, frame = self.cap.read()
            
            if ret:
                timestamp = frame_number / self.properties['fps']
                return ret, frame, timestamp
            else:
                logger.warning(f"Failed to read frame {frame_number}")
                return False, None, 0.0
        except Exception as e:
            logger.error(f"Error reading frame {frame_number}: {str(e)}")
            return False, None, 0.0
    
    def get_next_frame(self) -> Optional[Tuple[bool, any, float, int]]:
        """
        Get next frame in sequence
        
        Returns:
            Tuple of (success, frame, timestamp, frame_number) or (False, None, 0, 0)
        """
        if not self.cap:
            return False, None, 0.0, 0
        
        try:
            frame_number = int(self.cap.get(cv2.CAP_PROP_POS_FRAMES))
            ret, frame = self.cap.read()
            
            if ret:
                timestamp = frame_number / self.properties['fps']
                return ret, frame, timestamp, frame_number
            else:
                return False, None, 0.0, frame_number
        except Exception as e:
            logger.error(f"Error reading next frame: {str(e)}")
            return False, None, 0.0, 0
    
    def reset(self) -> None:
        """Reset video to beginning"""
        if self.cap:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            logger.info("Video reset to beginning")
    
    def close(self) -> None:
        """Close video capture"""
        if self.cap:
            self.cap.release()
            logger.info("Video capture closed")
    
    def __del__(self):
        """Cleanup on deletion"""
        self.close()
