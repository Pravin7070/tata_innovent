"""
Example usage of AI Engine for video analysis
"""
import sys
import os
import json
from main import AIEngine

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def example_video_analysis():
    """
    Example 1: Analyze a video file
    """
    print("=" * 80)
    print("EXAMPLE 1: Video Analysis")
    print("=" * 80)
    
    # Initialize AI Engine
    engine = AIEngine()
    
    # Video file path
    video_path = "sample_video.mp4"
    
    # Check if video exists
    if not os.path.exists(video_path):
        print(f"Video file not found: {video_path}")
        print("Please provide a valid video file path")
        return
    
    # Analyze video
    result = engine.analyze_video(
        video_path=video_path,
        frame_step=10,  # Process every 10th frame
        max_frames=300,  # Process max 300 frames
        current_speed=60  # Current speed in km/h
    )
    
    # Print results
    print("\nAnalysis Complete!")
    print(json.dumps(result, indent=2))


def example_frame_analysis():
    """
    Example 2: Analyze individual frames
    """
    print("\n" + "=" * 80)
    print("EXAMPLE 2: Frame Analysis")
    print("=" * 80)
    
    import cv2
    import numpy as np
    
    # Initialize AI Engine
    engine = AIEngine()
    
    # Read frame from video or create dummy frame
    video_path = "sample_video.mp4"
    
    if os.path.exists(video_path):
        cap = cv2.VideoCapture(video_path)
        ret, frame = cap.read()
        cap.release()
        
        if ret:
            # Analyze frame
            result = engine.analyze_frame(
                frame_array=frame,
                frame_number=0,
                timestamp='00:00:00.000',
                current_speed=60
            )
            
            print("\nFrame Analysis Complete!")
            print(json.dumps(result, indent=2))
        else:
            print("Failed to read frame from video")
    else:
        # Create dummy frame for demonstration
        dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)
        
        result = engine.analyze_frame(
            frame_array=dummy_frame,
            frame_number=0,
            timestamp='00:00:00.000',
            current_speed=60
        )
        
        print("\nFrame Analysis Complete (dummy frame)!")
        print(json.dumps(result, indent=2))


def example_engine_status():
    """
    Example 3: Check engine status
    """
    print("\n" + "=" * 80)
    print("EXAMPLE 3: Engine Status")
    print("=" * 80)
    
    engine = AIEngine()
    status = engine.get_status()
    
    print("\nEngine Status:")
    print(json.dumps(status, indent=2))


def example_api_usage():
    """
    Example 4: Using the API interface
    """
    print("\n" + "=" * 80)
    print("EXAMPLE 4: API Usage")
    print("=" * 80)
    
    from api import AIEngineAPI
    
    # Initialize engine and API
    engine = AIEngine()
    api = AIEngineAPI(engine)
    
    # Health check
    health = api.health_check()
    print("\nHealth Check:")
    print(json.dumps(health, indent=2))
    
    # Engine status
    status = api.get_engine_status()
    print("\nEngine Status (via API):")
    print(json.dumps(status, indent=2))


if __name__ == '__main__':
    print("\n" + "=" * 80)
    print("AI ENGINE - TERRAIN DETECTION & VEHICLE CONTROL DECISION SYSTEM")
    print("=" * 80)
    
    # Run examples
    try:
        example_engine_status()
        example_api_usage()
        # example_frame_analysis()  # Requires video or creates dummy
        # example_video_analysis()  # Requires video file
    except Exception as e:
        print(f"\nError: {str(e)}")
        import traceback
        traceback.print_exc()
