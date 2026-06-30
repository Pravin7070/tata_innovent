import os
import json
from typing import Dict, Any

from analytics.processing.processor import TerrainAnalyticsProcessor
from analytics.reports.pdf_generator import TerrainPDFReportGenerator
from analytics.utilities.helpers import ensure_dir

class TerrainDataExporter:
    """
    Handles exporting processed terrain data and metrics to CSV, JSON, and PDF formats.
    """
    def __init__(self, processor: TerrainAnalyticsProcessor):
        self.processor = processor

    def export_to_csv(self, output_dir: str = "output/csv") -> Dict[str, str]:
        """
        Exports frames, detections, and vehicle commands DataFrames to CSV files.
        Returns a dictionary of the generated CSV file paths.
        """
        target_dir = ensure_dir(output_dir)
        paths = {}

        # 1. Frames CSV
        frames_path = os.path.join(target_dir, "frames_history.csv")
        self.processor.frames_df.to_csv(frames_path, index=False)
        paths["frames"] = frames_path

        # 2. Detections CSV
        detections_path = os.path.join(target_dir, "detections_history.csv")
        self.processor.detections_df.to_csv(detections_path, index=False)
        paths["detections"] = detections_path

        # 3. Commands CSV
        commands_path = os.path.join(target_dir, "vehicle_commands_history.csv")
        self.processor.commands_df.to_csv(commands_path, index=False)
        paths["commands"] = commands_path

        return paths

    def export_to_json(self, output_path: str = "output/metrics_summary.json") -> str:
        """
        Exports aggregated statistics, distributions, and summary cards to a JSON file.
        Returns the path of the generated JSON file.
        """
        # Ensure parent directory exists
        parent_dir = os.path.dirname(output_path)
        if parent_dir:
            ensure_dir(parent_dir)

        # Prepare summary payload
        payload = {
            "session_metadata": {
                "session_id": self.processor.session_id,
                "vehicle_id": self.processor.vehicle_id,
                "start_time": self.processor.start_time,
                "end_time": self.processor.end_time
            },
            "dashboard_summary": self.processor.summary_metrics,
            "terrain_distribution": self.processor.get_terrain_distribution().to_dict(orient="records"),
            "drive_mode_distribution": self.processor.get_drive_mode_distribution().to_dict(orient="records"),
            "ride_height_distribution": self.processor.get_ride_height_distribution().to_dict(orient="records"),
            "confidence_stats": self.processor.get_confidence_stats(),
            "severity_stats": self.processor.get_severity_stats(),
            "command_statistics": self.processor.get_command_statistics().to_dict(orient="records")
        }

        with open(output_path, "w") as f:
            json.dump(payload, f, indent=4)

        return os.path.abspath(output_path)

    def export_to_pdf(self, output_path: str, chart_paths: Dict[str, str]) -> str:
        """
        Generates and exports the professional PDF report.
        Returns the path of the generated PDF file.
        """
        # Ensure parent directory exists
        parent_dir = os.path.dirname(output_path)
        if parent_dir:
            ensure_dir(parent_dir)

        generator = TerrainPDFReportGenerator(self.processor, chart_paths)
        generator.generate(output_path)
        
        return os.path.abspath(output_path)
