"""
Frame extraction and preprocessing module
"""
import cv2
import numpy as np
from typing import List, Tuple, Optional
from config import PROCESSING_CONFIG
from utilities.logger import setup_logger

logger = setup_logger(__name__)


class FrameExtractor:
    """Extract and preprocess frames from video"""
    
    @staticmethod
    def extract_frame_batch(
        video_processor,
        frame_step: int = 1,
        max_frames: Optional[int] = None
    ) -> List[Tuple[np.ndarray, int, float]]:
        """
        Extract frames from video at specified intervals
        
        Args:
            video_processor: VideoProcessor instance
            frame_step: Extract every Nth frame (default: 1 = all frames)
            max_frames: Maximum number of frames to extract
            
        Returns:
            List of tuples (frame, frame_number, timestamp)
        """
        frames = []
        frame_count = 0
        video_processor.reset()
        
        while True:
            if max_frames and frame_count >= max_frames:
                break
            
            ret, frame, timestamp, frame_number = video_processor.get_next_frame()
            
            if not ret:
                break
            
            if frame_number % frame_step == 0:
                frames.append((frame, frame_number, timestamp))
                frame_count += 1
        
        logger.info(f"Extracted {len(frames)} frames")
        return frames
    
    @staticmethod
    def preprocess_frame(
        frame: np.ndarray,
        target_size: Optional[Tuple[int, int]] = None,
        normalize: bool = False
    ) -> np.ndarray:
        """
        Preprocess frame for model inference
        
        Args:
            frame: Input frame
            target_size: Target size (width, height)
            normalize: Whether to normalize pixel values
            
        Returns:
            Preprocessed frame
        """
        if target_size:
            frame = cv2.resize(frame, target_size)
        
        if normalize:
            frame = frame.astype(np.float32) / 255.0
        
        return frame
    
    @staticmethod
    def enhance_contrast(frame: np.ndarray, alpha: float = 1.5, beta: float = 0) -> np.ndarray:
        """
        Enhance frame contrast for better detection
        
        Args:
            frame: Input frame
            alpha: Contrast control
            beta: Brightness control
            
        Returns:
            Enhanced frame
        """
        return cv2.convertScaleAbs(frame, alpha=alpha, beta=beta)
    
    @staticmethod
    def convert_color_space(
        frame: np.ndarray,
        from_space: str = 'BGR',
        to_space: str = 'RGB'
    ) -> np.ndarray:
        """
        Convert frame color space
        
        Args:
            frame: Input frame
            from_space: Source color space
            to_space: Target color space
            
        Returns:
            Frame in target color space
        """
        if from_space == 'BGR' and to_space == 'RGB':
            return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        elif from_space == 'BGR' and to_space == 'HSV':
            return cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        elif from_space == 'BGR' and to_space == 'GRAY':
            return cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        return frame
    
    @staticmethod
    def apply_blur(frame: np.ndarray, kernel_size: int = 5) -> np.ndarray:
        """
        Apply Gaussian blur to frame
        
        Args:
            frame: Input frame
            kernel_size: Kernel size for blur
            
        Returns:
            Blurred frame
        """
        return cv2.GaussianBlur(frame, (kernel_size, kernel_size), 0)
    
    @staticmethod
    def get_frame_timestamp(frame_number: int, fps: float) -> str:
        """
        Calculate timestamp from frame number and FPS
        
        Args:
            frame_number: Frame number
            fps: Frames per second
            
        Returns:
            Formatted timestamp string (HH:MM:SS.mmm)
        """
        total_seconds = frame_number / fps
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        seconds = int(total_seconds % 60)
        milliseconds = int((total_seconds % 1) * 1000)
        
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}.{milliseconds:03d}"
