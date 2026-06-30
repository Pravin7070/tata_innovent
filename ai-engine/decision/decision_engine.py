"""
Decision engine for intelligent vehicle control decisions
"""
from typing import Dict, List, Tuple
import numpy as np
from config import DECISION_CONFIG, TERRAIN_CONFIG
from utilities.logger import setup_logger

logger = setup_logger(__name__)


class DecisionEngine:
    """Make intelligent vehicle control decisions based on terrain assessment"""
    
    @staticmethod
    def determine_drive_mode(
        risk_level: str,
        terrain_type: str,
        severity: float
    ) -> str:
        """
        Determine optimal drive mode
        
        Args:
            risk_level: Risk level classification
            terrain_type: Type of terrain detected
            severity: Severity score (0-100)
            
        Returns:
            Drive mode string
        """
        # Decision logic based on risk level
        if risk_level == 'Critical':
            return 'Critical'
        elif risk_level == 'High':
            if terrain_type in ['Water', 'Mud', 'Slope']:
                return 'Offroad'
            else:
                return 'Cautious'
        elif risk_level == 'Medium':
            if terrain_type in ['Mud', 'Gravel', 'Stone', 'Slope']:
                return 'Offroad'
            else:
                return 'Cautious'
        else:
            return 'Safe'
    
    @staticmethod
    def determine_ride_height(
        drive_mode: str,
        terrain_type: str
    ) -> str:
        """
        Determine ride height setting
        
        Args:
            drive_mode: Current drive mode
            terrain_type: Type of terrain
            
        Returns:
            Ride height setting
        """
        if drive_mode == 'Critical':
            return 'Maximum'
        elif drive_mode == 'Offroad':
            if terrain_type in ['Water', 'Slope']:
                return 'Maximum'
            else:
                return 'High'
        elif drive_mode == 'Cautious':
            return 'Normal'
        else:
            return 'Normal'
    
    @staticmethod
    def calculate_recommended_speed(
        drive_mode: str,
        risk_level: str,
        severity: float,
        current_speed: int = 60
    ) -> int:
        """
        Calculate recommended speed
        
        Args:
            drive_mode: Current drive mode
            risk_level: Risk level
            severity: Severity score
            current_speed: Current vehicle speed (default 60 km/h)
            
        Returns:
            Recommended speed in km/h
        """
        if drive_mode == 'Critical':
            return 10
        elif drive_mode == 'Offroad':
            if severity > 80:
                return 15
            elif severity > 60:
                return 25
            else:
                return 35
        elif drive_mode == 'Cautious':
            if severity > 60:
                return 35
            else:
                return 50
        else:
            return min(current_speed, 100)
    
    @staticmethod
    def generate_steering_recommendation(
        detections: List[Dict],
        frame_width: int
    ) -> str:
        """
        Generate steering recommendation based on detection positions
        
        Args:
            detections: List of severity assessments
            frame_width: Frame width
            
        Returns:
            Steering recommendation string
        """
        if not detections:
            return 'Maintain Course'
        
        # Calculate center of mass of all detections
        center_x_sum = 0
        total_area = 0
        
        for detection in detections:
            bbox = detection['bbox']
            center_x = (bbox['x'] + bbox['x2']) / 2
            area = detection.get('area', 1)
            
            center_x_sum += center_x * area
            total_area += area
        
        if total_area == 0:
            return 'Maintain Course'
        
        # Weighted center of detections
        detection_center = center_x_sum / total_area
        frame_center = frame_width / 2
        
        # Decision threshold (in pixels)
        threshold = frame_width * 0.15  # 15% of frame
        
        if detection_center < frame_center - threshold:
            return 'Steer Right'
        elif detection_center > frame_center + threshold:
            return 'Steer Left'
        else:
            return 'Maintain Course'
    
    @staticmethod
    def make_decision(
        assessments: List[Dict],
        frame_width: int,
        frame_height: int,
        current_speed: int = 60
    ) -> Dict:
        """
        Make comprehensive vehicle control decision
        
        Args:
            assessments: List of severity assessments
            frame_width: Frame width
            frame_height: Frame height
            current_speed: Current vehicle speed
            
        Returns:
            Decision dictionary with all control parameters
        """
        # Get overall frame danger level
        if not assessments:
            return {
                'drive_mode': 'Safe',
                'ride_height': 'Normal',
                'recommended_speed': min(current_speed, 100),
                'steering_recommendation': 'Maintain Course',
                'primary_threat': None,
                'threat_level': 'Safe'
            }
        
        # Sort by severity to find primary threat
        sorted_assessments = sorted(assessments, key=lambda x: x['severity'], reverse=True)
        primary_threat = sorted_assessments[0]
        
        # Determine decisions
        drive_mode = DecisionEngine.determine_drive_mode(
            primary_threat['risk_level'],
            primary_threat['terrain'],
            primary_threat['severity']
        )
        
        ride_height = DecisionEngine.determine_ride_height(
            drive_mode,
            primary_threat['terrain']
        )
        
        recommended_speed = DecisionEngine.calculate_recommended_speed(
            drive_mode,
            primary_threat['risk_level'],
            primary_threat['severity'],
            current_speed
        )
        
        steering_recommendation = DecisionEngine.generate_steering_recommendation(
            sorted_assessments[:5],  # Top 5 threats
            frame_width
        )
        
        return {
            'drive_mode': drive_mode,
            'ride_height': ride_height,
            'recommended_speed': recommended_speed,
            'steering_recommendation': steering_recommendation,
            'primary_threat': primary_threat['terrain'],
            'threat_severity': primary_threat['severity'],
            'threat_level': primary_threat['risk_level'],
            'total_detections': len(assessments)
        }
