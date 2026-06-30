"""
Terrain severity assessment module
"""
from typing import Dict, Tuple
import numpy as np
from config import TERRAIN_CONFIG, DECISION_CONFIG
from utilities.logger import setup_logger

logger = setup_logger(__name__)


class SeverityCalculator:
    """Calculate terrain severity and risk levels"""
    
    @staticmethod
    def calculate_severity(
        terrain: str,
        confidence: float,
        bbox_area: float,
        frame_center_distance: float = 0.5
    ) -> float:
        """
        Calculate terrain severity score (0-100)
        
        Args:
            terrain: Terrain type
            confidence: Detection confidence (0-1)
            bbox_area: Bounding box area
            frame_center_distance: Distance from frame center (0-1)
            
        Returns:
            Severity score (0-100)
        """
        base_severity = TERRAIN_CONFIG.SEVERITY_LEVELS.get(terrain, {}).get('max', 50)
        
        # Adjust based on confidence
        confidence_factor = confidence  # Higher confidence = higher severity
        
        # Adjust based on area (larger obstacles = higher severity)
        area_factor = min(1.0, bbox_area / 100000)  # Normalize by typical area
        
        # Adjust based on proximity to center (center = more severe)
        center_factor = 1.0 - (frame_center_distance * 0.3)  # Max 30% reduction for edge detections
        
        severity = base_severity * confidence_factor * (0.6 + 0.4 * area_factor) * center_factor
        severity = min(100, max(0, severity))
        
        return severity
    
    @staticmethod
    def calculate_risk_level(severity: float) -> str:
        """
        Determine risk level from severity score
        
        Args:
            severity: Severity score (0-100)
            
        Returns:
            Risk level string
        """
        risk_levels = DECISION_CONFIG.RISK_LEVELS
        
        if severity >= risk_levels['Critical'][0]:
            return 'Critical'
        elif severity >= risk_levels['High'][0]:
            return 'High'
        elif severity >= risk_levels['Medium'][0]:
            return 'Medium'
        else:
            return 'Low'
    
    @staticmethod
    def calculate_bbox_distance_from_center(
        bbox: Dict[str, float],
        frame_width: int,
        frame_height: int
    ) -> float:
        """
        Calculate distance of bbox from frame center (0-1)
        
        Args:
            bbox: Bounding box {'x': x, 'y': y, 'x2': x2, 'y2': y2}
            frame_width: Frame width
            frame_height: Frame height
            
        Returns:
            Normalized distance (0 = center, 1 = far edge)
        """
        center_x = frame_width / 2
        center_y = frame_height / 2
        
        bbox_center_x = (bbox['x'] + bbox['x2']) / 2
        bbox_center_y = (bbox['y'] + bbox['y2']) / 2
        
        distance = np.sqrt(
            ((bbox_center_x - center_x) / center_x) ** 2 +
            ((bbox_center_y - center_y) / center_y) ** 2
        )
        
        # Normalize to 0-1
        distance = min(1.0, distance / np.sqrt(2))
        
        return distance
    
    @staticmethod
    def assess_terrain_severity(
        detections: list,
        frame_width: int,
        frame_height: int
    ) -> list:
        """
        Assess severity for all detections in frame
        
        Args:
            detections: List of detection dictionaries
            frame_width: Frame width
            frame_height: Frame height
            
        Returns:
            List of detections with severity scores
        """
        assessed_detections = []
        
        for detection in detections:
            bbox = detection['bbox']
            terrain = detection['terrain']
            confidence = detection['confidence']
            
            # Calculate distance from center
            distance = SeverityCalculator.calculate_bbox_distance_from_center(
                bbox, frame_width, frame_height
            )
            
            # Calculate severity
            severity = SeverityCalculator.calculate_severity(
                terrain,
                confidence,
                detection['area'],
                distance
            )
            
            # Determine risk level
            risk_level = SeverityCalculator.calculate_risk_level(severity)
            
            assessment = {
                **detection,
                'severity': severity,
                'risk_level': risk_level,
                'distance_from_center': distance
            }
            
            assessed_detections.append(assessment)
        
        return assessed_detections
    
    @staticmethod
    def get_frame_danger_level(assessments: list) -> Tuple[str, float]:
        """
        Determine overall danger level for a frame
        
        Args:
            assessments: List of severity assessments
            
        Returns:
            Tuple of (danger_level_string, max_severity_score)
        """
        if not assessments:
            return 'Safe', 0
        
        max_severity = max(a['severity'] for a in assessments)
        danger_level = SeverityCalculator.calculate_risk_level(max_severity)
        
        return danger_level, max_severity
    
    @staticmethod
    def identify_critical_detections(assessments: list, threshold: str = 'High') -> list:
        """
        Identify critical detections above threshold
        
        Args:
            assessments: List of severity assessments
            threshold: Risk level threshold ('Low', 'Medium', 'High', 'Critical')
            
        Returns:
            List of critical detections
        """
        risk_order = {'Low': 0, 'Medium': 1, 'High': 2, 'Critical': 3}
        threshold_value = risk_order.get(threshold, 1)
        
        critical = []
        for assessment in assessments:
            if risk_order.get(assessment['risk_level'], 0) >= threshold_value:
                critical.append(assessment)
        
        return sorted(critical, key=lambda x: x['severity'], reverse=True)
