"""
YOLOv8 object detection module for terrain classification
"""
import cv2
import numpy as np
from typing import List, Tuple, Dict, Optional
from ultralytics import YOLO
from config import MODEL_CONFIG, TERRAIN_CONFIG
from utilities.logger import setup_logger

logger = setup_logger(__name__)


class YOLODetector:
    """YOLOv8 object detector for terrain classification"""
    
    def __init__(self, model_path: str = None):
        """
        Initialize YOLOv8 detector
        
        Args:
            model_path: Path to custom model or None for default
        """
        try:
            if model_path:
                self.model = YOLO(model_path)
                logger.info(f"Custom model loaded: {model_path}")
            else:
                self.model = YOLO(MODEL_CONFIG.MODEL_NAME)
                logger.info(f"Default model loaded: {MODEL_CONFIG.MODEL_NAME}")
            
            self.model.to(MODEL_CONFIG.DEVICE)
            logger.info(f"Model device: {MODEL_CONFIG.DEVICE}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise
    
    def detect(
        self,
        frame: np.ndarray,
        confidence_threshold: Optional[float] = None
    ) -> List[Dict]:
        """
        Run inference on frame
        
        Args:
            frame: Input frame (BGR format)
            confidence_threshold: Confidence threshold for detections
            
        Returns:
            List of detections with terrain information
        """
        if confidence_threshold is None:
            confidence_threshold = MODEL_CONFIG.CONFIDENCE_THRESHOLD
        
        try:
            # Run inference
            results = self.model(
                frame,
                conf=confidence_threshold,
                iou=MODEL_CONFIG.IOU_THRESHOLD,
                imgsz=MODEL_CONFIG.IMAGE_SIZE,
                verbose=False
            )
            
            detections = []
            
            if len(results) > 0:
                result = results[0]
                
                if result.boxes is not None:
                    boxes = result.boxes
                    
                    for i in range(len(boxes)):
                        # Extract box coordinates
                        box = boxes.xyxy[i].cpu().numpy()
                        x1, y1, x2, y2 = box
                        
                        # Extract confidence
                        confidence = float(boxes.conf[i].cpu().numpy())
                        
                        # Extract class
                        cls = int(boxes.cls[i].cpu().numpy())
                        
                        # Get class name (terrain type)
                        class_name = result.names.get(cls, f"Unknown_{cls}")
                        
                        # Ensure class name is in terrain types
                        if class_name not in TERRAIN_CONFIG.TERRAIN_TYPES:
                            class_name = TERRAIN_CONFIG.TERRAIN_TYPES[
                                min(cls, len(TERRAIN_CONFIG.TERRAIN_TYPES) - 1)
                            ]
                        
                        detection = {
                            'terrain': class_name,
                            'confidence': confidence,
                            'bbox': {
                                'x': float(x1),
                                'y': float(y1),
                                'x2': float(x2),
                                'y2': float(y2),
                                'w': float(x2 - x1),
                                'h': float(y2 - y1)
                            },
                            'area': float((x2 - x1) * (y2 - y1))
                        }
                        detections.append(detection)
            
            return detections
        
        except Exception as e:
            logger.error(f"Error during detection: {str(e)}")
            return []
    
    def detect_batch(
        self,
        frames: List[Tuple[np.ndarray, int, float]],
        confidence_threshold: Optional[float] = None
    ) -> List[Dict]:
        """
        Run inference on multiple frames
        
        Args:
            frames: List of (frame, frame_number, timestamp) tuples
            confidence_threshold: Confidence threshold
            
        Returns:
            List of detection results with frame metadata
        """
        batch_results = []
        
        for i, (frame, frame_number, timestamp) in enumerate(frames):
            detections = self.detect(frame, confidence_threshold)
            
            batch_results.append({
                'frame_number': frame_number,
                'timestamp': timestamp,
                'detections': detections,
                'frame_shape': frame.shape
            })
            
            if (i + 1) % 10 == 0:
                logger.info(f"Processed {i + 1}/{len(frames)} frames")
        
        logger.info(f"Batch processing complete: {len(batch_results)} frames")
        return batch_results
    
    def filter_detections(
        self,
        detections: List[Dict],
        min_confidence: float = 0.5,
        min_area: float = 0
    ) -> List[Dict]:
        """
        Filter detections based on criteria
        
        Args:
            detections: List of detections
            min_confidence: Minimum confidence threshold
            min_area: Minimum bounding box area
            
        Returns:
            Filtered detections
        """
        filtered = []
        
        for detection in detections:
            if detection['confidence'] >= min_confidence and \
               detection['area'] >= min_area:
                filtered.append(detection)
        
        return filtered
    
    def get_detection_statistics(self, detections: List[Dict]) -> Dict:
        """
        Get statistics from detections
        
        Args:
            detections: List of detections
            
        Returns:
            Statistics dictionary
        """
        if not detections:
            return {
                'total_detections': 0,
                'unique_terrains': 0,
                'avg_confidence': 0,
                'terrain_breakdown': {}
            }
        
        terrains = {}
        confidences = []
        
        for detection in detections:
            terrain = detection['terrain']
            confidence = detection['confidence']
            
            if terrain not in terrains:
                terrains[terrain] = []
            
            terrains[terrain].append(confidence)
            confidences.append(confidence)
        
        return {
            'total_detections': len(detections),
            'unique_terrains': len(terrains),
            'avg_confidence': np.mean(confidences) if confidences else 0,
            'terrain_breakdown': {
                terrain: {
                    'count': len(confs),
                    'avg_confidence': np.mean(confs),
                    'max_confidence': np.max(confs),
                    'min_confidence': np.min(confs)
                }
                for terrain, confs in terrains.items()
            }
        }
