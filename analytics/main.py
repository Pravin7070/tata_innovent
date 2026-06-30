import os
import json
import random
from datetime import datetime, timedelta
from typing import Dict, Any

# Adjust path to allow running directly
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from analytics.processing.processor import TerrainAnalyticsProcessor
from analytics.charts.generator import TerrainChartsGenerator
from analytics.exports.exporter import TerrainDataExporter
from analytics.utilities.helpers import ensure_dir

def generate_mock_data(output_path: str) -> None:
    """Generates a realistic 500-frame terrain detection session JSON."""
    print(f"Generating mock detection data at {output_path}...")
    
    start_time = datetime.now() - timedelta(minutes=5)
    
    session = {
        "session_id": "session_tata_safari_20260630_001",
        "vehicle_id": "TATA_SAFARI_4XX_092",
        "start_time": start_time.isoformat() + "Z",
        "end_time": datetime.now().isoformat() + "Z",
        "frames": []
    }
    
    # 500 frames, 0.1s interval (50 seconds total)
    num_frames = 500
    
    # State tracking
    current_drive_mode = "Comfort"
    current_ride_height = "Normal"
    
    for frame_idx in range(num_frames):
        timestamp = round(frame_idx * 0.1, 1)
        frame_time = start_time + timedelta(seconds=timestamp)
        
        # Determine terrain phase
        if frame_idx < 120:
            terrain_type = "Asphalt"
            target_drive_mode = "Comfort"
            target_ride_height = "Normal"
            base_confidence = 0.96
            base_severity = 0.05
        elif frame_idx < 220:
            terrain_type = "Gravel"
            target_drive_mode = "Comfort"
            target_ride_height = "Normal"
            base_confidence = 0.88
            base_severity = 0.25
        elif frame_idx < 320:
            terrain_type = "Mud"
            target_drive_mode = "Offroad"
            target_ride_height = "High"
            base_confidence = 0.82
            base_severity = 0.65
        elif frame_idx < 400:
            terrain_type = "Sand"
            target_drive_mode = "Offroad"
            target_ride_height = "High"
            base_confidence = 0.84
            base_severity = 0.50
        elif frame_idx < 460:
            terrain_type = "Rock"
            target_drive_mode = "Offroad"
            target_ride_height = "Extra High"
            base_confidence = 0.78
            base_severity = 0.82
        else:
            terrain_type = "Asphalt"
            target_drive_mode = "Comfort"
            target_ride_height = "Normal"
            base_confidence = 0.95
            base_severity = 0.08
            
        # Detect state changes to issue commands
        commands = []
        if target_drive_mode != current_drive_mode:
            commands.append({
                "command": f"Change Drive Mode to {target_drive_mode}",
                "status": "Executed"
            })
            current_drive_mode = target_drive_mode
            
        if target_ride_height != current_ride_height:
            # Simulate a temporary failure on rock entrance
            if terrain_type == "Rock" and random.random() < 0.3:
                commands.append({
                    "command": f"Raise Ride Height to {target_ride_height}",
                    "status": "Failed"
                })
                # It will succeed in the next frame
            else:
                commands.append({
                    "command": f"Raise Ride Height to {target_ride_height}" if "High" in target_ride_height else f"Lower Ride Height to {target_ride_height}",
                    "status": "Executed"
                })
                current_ride_height = target_ride_height
                
        # Occasional active suspension adjustment in rough terrain
        if terrain_type in ["Mud", "Rock"] and frame_idx % 40 == 0:
            commands.append({
                "command": "Apply Active Suspension Damping",
                "status": "Executed"
            })
            
        # Detections (90% detection rate on Asphalt, 95% on rough terrains)
        detections = []
        detection_chance = 0.95 if terrain_type != "Asphalt" else 0.90
        
        if random.random() < detection_chance:
            # Generate confidence and severity with some noise
            confidence = round(max(0.5, min(1.0, base_confidence + random.normalvariate(0, 0.05))), 2)
            severity = round(max(0.0, min(1.0, base_severity + random.normalvariate(0, 0.1))), 2)
            
            # Simulated bounding box [ymin, xmin, ymax, xmax] in normalized coordinates
            bbox = [
                round(0.4 + random.uniform(-0.1, 0.1), 2),
                round(0.2 + random.uniform(-0.1, 0.1), 2),
                round(0.8 + random.uniform(-0.1, 0.1), 2),
                round(0.8 + random.uniform(-0.1, 0.1), 2)
            ]
            
            detections.append({
                "terrain_type": terrain_type,
                "confidence": confidence,
                "severity": severity,
                "bbox": bbox
            })
            
            # Occasional secondary detection (e.g. detecting gravel on the side of asphalt)
            if terrain_type == "Asphalt" and random.random() < 0.15:
                detections.append({
                    "terrain_type": "Gravel",
                    "confidence": round(random.uniform(0.5, 0.7), 2),
                    "severity": 0.2,
                    "bbox": [0.5, 0.0, 0.9, 0.3]
                })
                
        if not commands:
            commands.append({"command": "None", "status": "Executed"})
            
        session["frames"].append({
            "frame_id": frame_idx + 1,
            "timestamp": timestamp,
            "drive_mode": current_drive_mode,
            "ride_height": current_ride_height,
            "detections": detections,
            "vehicle_commands": commands
        })
        
    with open(output_path, "w") as f:
        json.dump(session, f, indent=4)
        
    print(f"Successfully generated {num_frames} frames of mock data.")


def main():
    print("="*60)
    print("TATA INNOVENT - Terrain Detection Analytics Module Runner")
    print("="*60)
    
    # 1. Setup paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sample_data_path = os.path.join(base_dir, "sample_data.json")
    
    output_dir = os.path.join(base_dir, "output")
    ensure_dir(output_dir)
    
    # 2. Generate sample data if not exists
    if not os.path.exists(sample_data_path):
        generate_mock_data(sample_data_path)
        
    # 3. Initialize Processor
    processor = TerrainAnalyticsProcessor()
    processor.load_from_file(sample_data_path)
    
    print("\n[1/4] Processing Terrain Data...")
    metrics = processor.summary_metrics
    print(f"  - Total Frames: {metrics['total_frames']}")
    print(f"  - Total Detections: {metrics['total_detections']}")
    print(f"  - Avg Confidence: {metrics['avg_confidence']:.2%}")
    print(f"  - Avg Severity: {metrics['avg_severity']:.2f}")
    print(f"  - Most Common Terrain: {metrics['most_common_terrain']}")
    print(f"  - Most Used Drive Mode: {metrics['most_used_drive_mode']}")
    
    # 4. Generate Charts
    print("\n[2/4] Generating Visualizations...")
    charts_dir = os.path.join(output_dir, "charts")
    generator = TerrainChartsGenerator(processor, output_dir=charts_dir)
    
    print("  - Generating static PNG charts...")
    static_paths = generator.generate_all_static_charts()
    
    print("  - Generating interactive HTML charts...")
    interactive_paths = generator.generate_all_interactive_charts()
    
    # 5. Export Data
    print("\n[3/4] Exporting Data and Reports...")
    exporter = TerrainDataExporter(processor)
    
    csv_dir = os.path.join(output_dir, "csv")
    csv_paths = exporter.export_to_csv(output_dir=csv_dir)
    print(f"  - CSVs exported to: {os.path.abspath(csv_dir)}")
    
    json_path = os.path.join(output_dir, "metrics_summary.json")
    exporter.export_to_json(output_path=json_path)
    print(f"  - Summary JSON exported to: {os.path.abspath(json_path)}")
    
    pdf_path = os.path.join(output_dir, "terrain_analytics_report.pdf")
    exporter.export_to_pdf(output_path=pdf_path, chart_paths=static_paths)
    print(f"  - PDF Report generated at: {os.path.abspath(pdf_path)}")
    
    print("\n[4/4] Verification Complete!")
    print("="*60)
    print("All analytics assets generated successfully!")
    print(f"Check the output folder: {os.path.abspath(output_dir)}")
    print("="*60)

if __name__ == "__main__":
    main()
