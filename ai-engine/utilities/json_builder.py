"""
JSON output builder for structured results
"""
import json
from typing import List, Dict, Any
from datetime import datetime


class JSONBuilder:
    """Build structured JSON output for vehicle commands"""
    
    @staticmethod
    def create_detection_result(
        terrain: str,
        confidence: float,
        bbox: Dict[str, float],
        frame_number: int,
        timestamp: str,
        severity: float,
        risk_level: str,
        drive_mode: str,
        ride_height: str,
        recommended_speed: int,
        steering_recommendation: str
    ) -> Dict[str, Any]:
        """
        Create a structured detection result JSON
        
        Args:
            terrain: Detected terrain type
            confidence: Detection confidence score
            bbox: Bounding box coordinates {'x': x, 'y': y, 'w': width, 'h': height}
            frame_number: Frame number in video
            timestamp: Frame timestamp
            severity: Terrain severity score (0-100)
            risk_level: Risk level classification
            drive_mode: Recommended drive mode
            ride_height: Ride height setting
            recommended_speed: Recommended speed in km/h
            steering_recommendation: Steering guidance
            
        Returns:
            Structured JSON dictionary
        """
        return {
            'Terrain': terrain,
            'Confidence': round(confidence, 4),
            'BoundingBox': {
                'x': round(bbox.get('x', 0), 2),
                'y': round(bbox.get('y', 0), 2),
                'width': round(bbox.get('w', 0), 2),
                'height': round(bbox.get('h', 0), 2)
            },
            'FrameNumber': frame_number,
            'Timestamp': timestamp,
            'Severity': round(severity, 2),
            'RiskLevel': risk_level,
            'DriveMode': drive_mode,
            'RideHeight': ride_height,
            'RecommendedSpeed': recommended_speed,
            'SteeringRecommendation': steering_recommendation,
            'ProcessedAt': datetime.now().isoformat()
        }
    
    @staticmethod
    def create_video_analysis_result(
        video_path: str,
        total_frames: int,
        processed_frames: int,
        detections: List[Dict[str, Any]],
        summary: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create comprehensive video analysis result JSON
        
        Args:
            video_path: Path to analyzed video
            total_frames: Total frames in video
            processed_frames: Frames successfully processed
            detections: List of detection results
            summary: Summary statistics
            
        Returns:
            Comprehensive analysis JSON
        """
        return {
            'VideoAnalysis': {
                'VideoPath': video_path,
                'TotalFrames': total_frames,
                'ProcessedFrames': processed_frames,
                'ProcessingRate': f"{(processed_frames/total_frames*100):.2f}%",
                'Detections': detections,
                'Summary': summary,
                'CompletedAt': datetime.now().isoformat()
            }
        }
    
    @staticmethod
    def create_summary_statistics(
        detections: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Create summary statistics from detections
        
        Args:
            detections: List of detection results
            
        Returns:
            Summary statistics dictionary
        """
        terrain_counts = {}
        avg_confidence = {}
        max_severity = {}
        risk_distribution = {'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0}
        
        for detection in detections:
            terrain = detection['Terrain']
            confidence = detection['Confidence']
            severity = detection['Severity']
            risk_level = detection['RiskLevel']
            
            # Count terrains
            terrain_counts[terrain] = terrain_counts.get(terrain, 0) + 1
            
            # Average confidence
            if terrain not in avg_confidence:
                avg_confidence[terrain] = []
            avg_confidence[terrain].append(confidence)
            
            # Max severity
            if terrain not in max_severity:
                max_severity[terrain] = 0
            max_severity[terrain] = max(max_severity[terrain], severity)
            
            # Risk distribution
            risk_distribution[risk_level] += 1
        
        return {
            'TerrainDetectionCounts': terrain_counts,
            'AverageConfidenceByTerrain': {
                k: round(sum(v)/len(v), 4) for k, v in avg_confidence.items()
            },
            'MaxSeverityByTerrain': {
                k: round(v, 2) for k, v in max_severity.items()
            },
            'RiskDistribution': risk_distribution,
            'TotalDetections': len(detections),
            'OverallAverageSeverity': round(
                sum(d['Severity'] for d in detections) / len(detections), 2
            ) if detections else 0
        }
    
    @staticmethod
    def to_json_string(data: Dict[str, Any], pretty: bool = True) -> str:
        """
        Convert data to JSON string
        
        Args:
            data: Data to convert
            pretty: Whether to pretty print
            
        Returns:
            JSON string
        """
        if pretty:
            return json.dumps(data, indent=2)
        return json.dumps(data)
