import json
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

class TerrainAnalyticsProcessor:
    """
    Processes terrain detection history and vehicle state data from JSON.
    Generates statistics, summary metrics, and DataFrames for visualization.
    """
    
    def __init__(self, data: Optional[Dict[str, Any]] = None):
        self.session_id: str = ""
        self.vehicle_id: str = ""
        self.start_time: Optional[str] = None
        self.end_time: Optional[str] = None
        
        # Raw DataFrames
        self.frames_df = pd.DataFrame()
        self.detections_df = pd.DataFrame()
        self.commands_df = pd.DataFrame()
        
        # Summary statistics
        self.summary_metrics: Dict[str, Any] = {}
        
        if data is not None:
            self.load_data(data)

    def load_from_file(self, filepath: str) -> None:
        """Loads and processes detection data from a JSON file."""
        with open(filepath, 'r') as f:
            data = json.load(f)
        self.load_data(data)

    def load_data(self, data: Dict[str, Any]) -> None:
        """Parses the raw JSON data and constructs DataFrames."""
        self.session_id = data.get("session_id", "unknown_session")
        self.vehicle_id = data.get("vehicle_id", "unknown_vehicle")
        self.start_time = data.get("start_time")
        self.end_time = data.get("end_time")
        
        frames = data.get("frames", [])
        
        frames_list = []
        detections_list = []
        commands_list = []
        
        for frame in frames:
            frame_id = frame.get("frame_id")
            timestamp = frame.get("timestamp", 0.0)
            drive_mode = frame.get("drive_mode", "Comfort")
            ride_height = frame.get("ride_height", "Normal")
            
            # 1. Frames Data
            frames_list.append({
                "frame_id": frame_id,
                "timestamp": timestamp,
                "drive_mode": drive_mode,
                "ride_height": ride_height
            })
            
            # 2. Detections Data
            detections = frame.get("detections", [])
            for det in detections:
                detections_list.append({
                    "frame_id": frame_id,
                    "timestamp": timestamp,
                    "terrain_type": det.get("terrain_type", "Unknown"),
                    "confidence": det.get("confidence", 0.0),
                    "severity": det.get("severity", 0.0),
                    "bbox": det.get("bbox", [])
                })
                
            # 3. Commands Data
            commands = frame.get("vehicle_commands", [])
            for cmd in commands:
                cmd_text = cmd.get("command", "None")
                if cmd_text != "None":
                    commands_list.append({
                        "frame_id": frame_id,
                        "timestamp": timestamp,
                        "command": cmd_text,
                        "status": cmd.get("status", "Executed")
                    })
        
        # Build DataFrames
        self.frames_df = pd.DataFrame(frames_list)
        self.detections_df = pd.DataFrame(detections_list) if detections_list else pd.DataFrame(
            columns=["frame_id", "timestamp", "terrain_type", "confidence", "severity", "bbox"]
        )
        self.commands_df = pd.DataFrame(commands_list) if commands_list else pd.DataFrame(
            columns=["frame_id", "timestamp", "command", "status"]
        )
        
        # Compute all stats
        self._compute_summary_metrics()

    def _compute_summary_metrics(self) -> None:
        """Computes summary metrics for the dashboard cards."""
        if self.frames_df.empty:
            self.summary_metrics = {
                "total_frames": 0,
                "total_detections": 0,
                "avg_confidence": 0.0,
                "avg_severity": 0.0,
                "most_common_terrain": "N/A",
                "most_used_drive_mode": "N/A"
            }
            return
            
        total_frames = len(self.frames_df)
        total_detections = len(self.detections_df)
        
        avg_confidence = float(self.detections_df["confidence"].mean()) if not self.detections_df.empty else 0.0
        avg_severity = float(self.detections_df["severity"].mean()) if not self.detections_df.empty else 0.0
        
        if not self.detections_df.empty:
            most_common_terrain = str(self.detections_df["terrain_type"].mode()[0])
        else:
            most_common_terrain = "None"
            
        most_used_drive_mode = str(self.frames_df["drive_mode"].mode()[0]) if "drive_mode" in self.frames_df.columns else "N/A"
        
        self.summary_metrics = {
            "total_frames": total_frames,
            "total_detections": total_detections,
            "avg_confidence": round(avg_confidence, 3),
            "avg_severity": round(avg_severity, 3),
            "most_common_terrain": most_common_terrain,
            "most_used_drive_mode": most_used_drive_mode
        }

    def get_terrain_distribution(self) -> pd.DataFrame:
        """Returns the distribution of detected terrains (count and percentage)."""
        if self.detections_df.empty:
            return pd.DataFrame(columns=["count", "percentage"])
        counts = self.detections_df["terrain_type"].value_counts()
        percentages = self.detections_df["terrain_type"].value_counts(normalize=True) * 100
        dist_df = pd.DataFrame({"count": counts, "percentage": percentages.round(2)})
        dist_df.index.name = "terrain_type"
        return dist_df.reset_index()

    def get_detection_frequency(self, bin_size_seconds: float = 1.0) -> pd.DataFrame:
        """Returns detection frequency aggregated by time intervals."""
        if self.detections_df.empty:
            return pd.DataFrame(columns=["time_bin", "detection_count"])
            
        # Create bins based on timestamp
        max_time = self.detections_df["timestamp"].max()
        bins = np.arange(0, max_time + bin_size_seconds, bin_size_seconds)
        if len(bins) < 2:
            bins = np.array([0.0, bin_size_seconds])
            
        self.detections_df["time_bin"] = pd.cut(self.detections_df["timestamp"], bins=bins, labels=bins[:-1])
        freq = self.detections_df.groupby("time_bin", observed=False).size().reset_index(name="detection_count")
        freq["time_bin"] = freq["time_bin"].astype(float)
        return freq

    def get_confidence_stats(self) -> Dict[str, float]:
        """Returns statistical metrics for detection confidence."""
        if self.detections_df.empty:
            return {"mean": 0.0, "std": 0.0, "min": 0.0, "max": 0.0, "median": 0.0}
        desc = self.detections_df["confidence"].describe()
        return {
            "mean": round(float(desc["mean"]), 3),
            "std": round(float(desc["std"]), 3) if not pd.isna(desc["std"]) else 0.0,
            "min": round(float(desc["min"]), 3),
            "max": round(float(desc["max"]), 3),
            "median": round(float(self.detections_df["confidence"].median()), 3)
        }

    def get_severity_stats(self) -> Dict[str, float]:
        """Returns statistical metrics for terrain severity."""
        if self.detections_df.empty:
            return {"mean": 0.0, "std": 0.0, "min": 0.0, "max": 0.0, "median": 0.0}
        desc = self.detections_df["severity"].describe()
        return {
            "mean": round(float(desc["mean"]), 3),
            "std": round(float(desc["std"]), 3) if not pd.isna(desc["std"]) else 0.0,
            "min": round(float(desc["min"]), 3),
            "max": round(float(desc["max"]), 3),
            "median": round(float(self.detections_df["severity"].median()), 3)
        }

    def get_drive_mode_distribution(self) -> pd.DataFrame:
        """Returns the distribution of drive modes (count and percentage)."""
        if self.frames_df.empty:
            return pd.DataFrame(columns=["count", "percentage"])
        counts = self.frames_df["drive_mode"].value_counts()
        percentages = self.frames_df["drive_mode"].value_counts(normalize=True) * 100
        dist_df = pd.DataFrame({"count": counts, "percentage": percentages.round(2)})
        dist_df.index.name = "drive_mode"
        return dist_df.reset_index()

    def get_ride_height_distribution(self) -> pd.DataFrame:
        """Returns the distribution of ride heights (count and percentage)."""
        if self.frames_df.empty:
            return pd.DataFrame(columns=["count", "percentage"])
        counts = self.frames_df["ride_height"].value_counts()
        percentages = self.frames_df["ride_height"].value_counts(normalize=True) * 100
        dist_df = pd.DataFrame({"count": counts, "percentage": percentages.round(2)})
        dist_df.index.name = "ride_height"
        return dist_df.reset_index()

    def get_command_statistics(self) -> pd.DataFrame:
        """Returns statistics on vehicle commands issued."""
        if self.commands_df.empty:
            return pd.DataFrame(columns=["command", "status", "count"])
        stats = self.commands_df.groupby(["command", "status"]).size().reset_index(name="count")
        return stats

    def get_timeline_data(self) -> pd.DataFrame:
        """Returns chronological data of detections and vehicle state changes."""
        if self.detections_df.empty:
            return pd.DataFrame()
            
        # Merge detections with frame state (drive_mode, ride_height)
        merged = pd.merge(
            self.detections_df, 
            self.frames_df[["frame_id", "drive_mode", "ride_height"]], 
            on="frame_id", 
            how="left"
        )
        return merged.sort_values(by="timestamp")
