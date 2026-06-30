"""
Command generator for structured vehicle control output
"""
from typing import Dict, List, Any
from datetime import datetime
from utilities.json_builder import JSONBuilder
from utilities.logger import setup_logger

logger = setup_logger(__name__)


class CommandGenerator:
    """Generate structured vehicle commands from decisions"""
    
    @staticmethod
    def generate_detection_command(
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
        Generate a single detection command
        
        Args:
            All detection parameters
            
        Returns:
            Structured detection command JSON
        """
        return JSONBuilder.create_detection_result(
            terrain=terrain,
            confidence=confidence,
            bbox=bbox,
            frame_number=frame_number,
            timestamp=timestamp,
            severity=severity,
            risk_level=risk_level,
            drive_mode=drive_mode,
            ride_height=ride_height,
            recommended_speed=recommended_speed,
            steering_recommendation=steering_recommendation
        )
    
    @staticmethod
    def generate_frame_command(
        frame_number: int,
        timestamp: str,
        detections: List[Dict[str, Any]],
        decision: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate frame-level vehicle command
        
        Args:
            frame_number: Current frame number
            timestamp: Frame timestamp
            detections: List of detection results
            decision: Vehicle control decision
            
        Returns:
            Frame-level command JSON
        """
        return {
            'FrameCommand': {
                'FrameNumber': frame_number,
                'Timestamp': timestamp,
                'DetectionCount': len(detections),
                'DriveMode': decision['drive_mode'],
                'RideHeight': decision['ride_height'],
                'RecommendedSpeed': decision['recommended_speed'],
                'SteeringRecommendation': decision['steering_recommendation'],
                'PrimaryThreat': decision['primary_threat'],
                'ThreatSeverity': decision['threat_severity'],
                'ThreatLevel': decision['threat_level'],
                'Detections': detections,
                'CommandGeneratedAt': datetime.now().isoformat()
            }
        }
    
    @staticmethod
    def generate_batch_commands(
        batch_results: List[Dict[str, Any]],
        decisions: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Generate batch of vehicle commands
        
        Args:
            batch_results: List of frame detection results
            decisions: List of frame-level decisions
            
        Returns:
            List of frame commands
        """
        commands = []
        
        for i, (batch_result, decision) in enumerate(zip(batch_results, decisions)):
            command = CommandGenerator.generate_frame_command(
                frame_number=batch_result['frame_number'],
                timestamp=CommandGenerator._format_timestamp(batch_result['timestamp']),
                detections=batch_result['detection_commands'],
                decision=decision
            )
            commands.append(command)
        
        return commands
    
    @staticmethod
    def generate_mission_summary(
        video_path: str,
        total_frames: int,
        processed_frames: int,
        all_detections: List[Dict[str, Any]],
        all_decisions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate mission summary report
        
        Args:
            video_path: Source video path
            total_frames: Total frames in video
            processed_frames: Frames processed
            all_detections: All detections across frames
            all_decisions: All decisions across frames
            
        Returns:
            Mission summary JSON
        """
        # Calculate statistics
        summary_stats = JSONBuilder.create_summary_statistics(
            [d for batch_dets in all_detections for d in batch_dets]
        )
        
        # Analyze drive modes
        drive_mode_counts = {}
        for decision in all_decisions:
            mode = decision.get('drive_mode', 'Unknown')
            drive_mode_counts[mode] = drive_mode_counts.get(mode, 0) + 1
        
        # Find critical frames
        critical_frames = [
            {'frame_number': i, 'decision': d}
            for i, d in enumerate(all_decisions)
            if d.get('threat_level') == 'Critical'
        ]
        
        return {
            'MissionSummary': {
                'VideoPath': video_path,
                'TotalFrames': total_frames,
                'ProcessedFrames': processed_frames,
                'ProcessingRate': f"{(processed_frames/total_frames*100):.2f}%",
                'Statistics': summary_stats,
                'DriveModeDistribution': drive_mode_counts,
                'CriticalFrames': len(critical_frames),
                'CriticalFramesList': critical_frames[:20],  # Top 20 critical frames
                'CompletedAt': datetime.now().isoformat()
            }
        }
    
    @staticmethod
    def _format_timestamp(timestamp: float) -> str:
        """
        Format timestamp
        
        Args:
            timestamp: Timestamp in seconds
            
        Returns:
            Formatted timestamp string
        """
        hours = int(timestamp // 3600)
        minutes = int((timestamp % 3600) // 60)
        seconds = int(timestamp % 60)
        milliseconds = int((timestamp % 1) * 1000)
        
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}.{milliseconds:03d}"
