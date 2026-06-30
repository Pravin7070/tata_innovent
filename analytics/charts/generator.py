import os  # Visualizations generator
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from typing import Dict, Any, Optional

from analytics.utilities.helpers import PALETTE, setup_chart_style, ensure_dir
from analytics.processing.processor import TerrainAnalyticsProcessor

class TerrainChartsGenerator:
    """
    Generates professional static (Matplotlib/Seaborn) and interactive (Plotly)
    charts from processed terrain analytics data.
    """
    
    def __init__(self, processor: TerrainAnalyticsProcessor, output_dir: str = "output"):
        self.processor = processor
        self.output_dir = ensure_dir(output_dir)
        setup_chart_style()
        
    def generate_all_static_charts(self) -> Dict[str, str]:
        """
        Generates all static charts as PNGs and returns a dictionary of their file paths.
        """
        paths = {}
        
        paths["terrain_distribution"] = self.plot_static_terrain_distribution()
        paths["detection_frequency"] = self.plot_static_detection_frequency()
        paths["confidence_analysis"] = self.plot_static_confidence_analysis()
        paths["severity_analysis"] = self.plot_static_severity_analysis()
        paths["drive_mode_usage"] = self.plot_static_drive_mode_usage()
        paths["ride_height_usage"] = self.plot_static_ride_height_usage()
        paths["command_statistics"] = self.plot_static_command_statistics()
        paths["timeline_detections"] = self.plot_static_timeline_detections()
        
        return paths

    def generate_all_interactive_charts(self) -> Dict[str, str]:
        """
        Generates all interactive charts as HTML files and returns a dictionary of their file paths.
        """
        paths = {}
        
        paths["terrain_distribution"] = self.plot_interactive_terrain_distribution()
        paths["detection_frequency"] = self.plot_interactive_detection_frequency()
        paths["confidence_analysis"] = self.plot_interactive_confidence_analysis()
        paths["severity_analysis"] = self.plot_interactive_severity_analysis()
        paths["drive_mode_usage"] = self.plot_interactive_drive_mode_usage()
        paths["ride_height_usage"] = self.plot_interactive_ride_height_usage()
        paths["command_statistics"] = self.plot_interactive_command_statistics()
        paths["timeline_detections"] = self.plot_interactive_timeline_detections()
        
        return paths

    # ==========================================
    # STATIC CHARTS (Matplotlib / Seaborn)
    # ==========================================

    def plot_static_terrain_distribution(self) -> str:
        df = self.processor.get_terrain_distribution()
        plt.figure(figsize=(8, 5))
        
        if df.empty:
            plt.text(0.5, 0.5, "No Data Available", ha='center', va='center')
        else:
            # Map colors
            colors = [PALETTE["terrain"].get(t, PALETTE["primary"]) for t in df["terrain_type"]]
            sns.barplot(
                x="count", y="terrain_type", data=df, 
                palette=colors, hue="terrain_type", legend=False
            )
            plt.title("Terrain Type Distribution (Total Detections)")
            plt.xlabel("Detection Count")
            plt.ylabel("Terrain Type")
            
        plt.tight_layout()
        path = os.path.join(self.output_dir, "static_terrain_distribution.png")
        plt.savefig(path, dpi=300)
        plt.close()
        return path

    def plot_static_detection_frequency(self) -> str:
        df = self.processor.get_detection_frequency(bin_size_seconds=1.0)
        plt.figure(figsize=(10, 4))
        
        if df.empty:
            plt.text(0.5, 0.5, "No Data Available", ha='center', va='center')
        else:
            plt.plot(df["time_bin"], df["detection_count"], color=PALETTE["secondary"], linewidth=2)
            plt.fill_between(df["time_bin"], df["detection_count"], color=PALETTE["secondary"], alpha=0.15)
            plt.title("Detection Frequency Over Time")
            plt.xlabel("Time (seconds)")
            plt.ylabel("Detections / Second")
            plt.xlim(left=0)
            plt.ylim(bottom=0)
            
        plt.tight_layout()
        path = os.path.join(self.output_dir, "static_detection_frequency.png")
        plt.savefig(path, dpi=300)
        plt.close()
        return path

    def plot_static_confidence_analysis(self) -> str:
        df = self.processor.detections_df
        plt.figure(figsize=(8, 5))
        
        if df.empty:
            plt.text(0.5, 0.5, "No Data Available", ha='center', va='center')
        else:
            sns.histplot(
                df["confidence"], kde=True, color=PALETTE["secondary"], 
                bins=15, edgecolor="#FFFFFF", alpha=0.7
            )
            stats = self.processor.get_confidence_stats()
            # Add mean line
            plt.axvline(stats["mean"], color=PALETTE["accent"], linestyle="--", linewidth=1.5, 
                        label=f"Mean: {stats['mean']:.2f}")
            plt.axvline(stats["median"], color=PALETTE["primary"], linestyle="-.", linewidth=1.5, 
                        label=f"Median: {stats['median']:.2f}")
            plt.title("Confidence Level Distribution")
            plt.xlabel("Confidence Score")
            plt.ylabel("Frequency")
            plt.legend()
            
        plt.tight_layout()
        path = os.path.join(self.output_dir, "static_confidence_analysis.png")
        plt.savefig(path, dpi=300)
        plt.close()
        return path

    def plot_static_severity_analysis(self) -> str:
        df = self.processor.detections_df
        plt.figure(figsize=(8, 5))
        
        if df.empty or "severity" not in df.columns or df["severity"].sum() == 0:
            plt.text(0.5, 0.5, "No Data / No Severity Detected", ha='center', va='center')
        else:
            # Boxplot of severity by terrain type
            order = df.groupby("terrain_type")["severity"].median().sort_values(ascending=False).index
            colors = [PALETTE["terrain"].get(t, PALETTE["primary"]) for t in order]
            sns.boxplot(
                x="severity", y="terrain_type", data=df, 
                order=order, palette=colors, hue="terrain_type", legend=False
            )
            plt.title("Terrain Severity Level by Type")
            plt.xlabel("Severity Score (0.0 = Low, 1.0 = Critical)")
            plt.ylabel("Terrain Type")
            
        plt.tight_layout()
        path = os.path.join(self.output_dir, "static_severity_analysis.png")
        plt.savefig(path, dpi=300)
        plt.close()
        return path

    def plot_static_drive_mode_usage(self) -> str:
        df = self.processor.get_drive_mode_distribution()
        plt.figure(figsize=(8, 5))
        
        if df.empty:
            plt.text(0.5, 0.5, "No Data Available", ha='center', va='center')
        else:
            colors = [PALETTE["drive_mode"].get(dm, PALETTE["primary"]) for dm in df["drive_mode"]]
            sns.barplot(
                x="percentage", y="drive_mode", data=df, 
                palette=colors, hue="drive_mode", legend=False
            )
            plt.title("Drive Mode Usage (% of total frames)")
            plt.xlabel("Percentage of Time (%)")
            plt.ylabel("Drive Mode")
            plt.xlim(0, 100)
            
        plt.tight_layout()
        path = os.path.join(self.output_dir, "static_drive_mode_usage.png")
        plt.savefig(path, dpi=300)
        plt.close()
        return path

    def plot_static_ride_height_usage(self) -> str:
        df = self.processor.get_ride_height_distribution()
        plt.figure(figsize=(8, 5))
        
        if df.empty:
            plt.text(0.5, 0.5, "No Data Available", ha='center', va='center')
        else:
            colors = [PALETTE["ride_height"].get(rh, PALETTE["primary"]) for rh in df["ride_height"]]
            sns.barplot(
                x="percentage", y="ride_height", data=df, 
                palette=colors, hue="ride_height", legend=False
            )
            plt.title("Ride Height Usage (% of total frames)")
            plt.xlabel("Percentage of Time (%)")
            plt.ylabel("Ride Height")
            plt.xlim(0, 100)
            
        plt.tight_layout()
        path = os.path.join(self.output_dir, "static_ride_height_usage.png")
        plt.savefig(path, dpi=300)
        plt.close()
        return path

    def plot_static_command_statistics(self) -> str:
        df = self.processor.get_command_statistics()
        plt.figure(figsize=(8, 5))
        
        if df.empty:
            plt.text(0.5, 0.5, "No Active Commands Issued", ha='center', va='center')
        else:
            sns.barplot(
                x="count", y="command", hue="status", data=df,
                palette={"Executed": PALETTE["secondary"], "Pending": PALETTE["accent"], "Failed": "#EF4444"}
            )
            plt.title("Vehicle Commands & Execution Status")
            plt.xlabel("Command Count")
            plt.ylabel("Command")
            plt.legend(title="Status")
            
        plt.tight_layout()
        path = os.path.join(self.output_dir, "static_command_statistics.png")
        plt.savefig(path, dpi=300)
        plt.close()
        return path

    def plot_static_timeline_detections(self) -> str:
        df = self.processor.get_timeline_data()
        plt.figure(figsize=(12, 6))
        
        if df.empty:
            plt.text(0.5, 0.5, "No Timeline Data Available", ha='center', va='center')
        else:
            # Map severity to color intensity (scatter color) and confidence to size
            scatter = plt.scatter(
                df["timestamp"], df["terrain_type"],
                c=df["severity"], cmap="YlOrRd",
                s=df["confidence"] * 150, alpha=0.8,
                edgecolors="#4B5563", linewidths=0.5
            )
            cbar = plt.colorbar(scatter)
            cbar.set_label("Terrain Severity (0 = Low, 1 = High)")
            plt.title("Timeline of Detections (Size indicates Confidence)")
            plt.xlabel("Time (seconds)")
            plt.ylabel("Detected Terrain Type")
            plt.grid(True, linestyle="--", alpha=0.5)
            
        plt.tight_layout()
        path = os.path.join(self.output_dir, "static_timeline_detections.png")
        plt.savefig(path, dpi=300)
        plt.close()
        return path


    # ==========================================
    # INTERACTIVE CHARTS (Plotly)
    # ==========================================

    def plot_interactive_terrain_distribution(self) -> str:
        df = self.processor.get_terrain_distribution()
        if df.empty:
            fig = go.Figure().add_annotation(text="No Data Available", showarrow=False)
        else:
            colors = [PALETTE["terrain"].get(t, PALETTE["primary"]) for t in df["terrain_type"]]
            fig = px.pie(
                df, values="count", names="terrain_type", 
                title="Terrain Type Distribution",
                color="terrain_type",
                color_discrete_map=PALETTE["terrain"]
            )
            fig.update_traces(textposition='inside', textinfo='percent+label', hole=0.4)
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color=PALETTE["neutral_dark"])
            )
            
        path = os.path.join(self.output_dir, "interactive_terrain_distribution.html")
        fig.write_html(path)
        return path

    def plot_interactive_detection_frequency(self) -> str:
        df = self.processor.get_detection_frequency(bin_size_seconds=1.0)
        if df.empty:
            fig = go.Figure().add_annotation(text="No Data Available", showarrow=False)
        else:
            fig = px.line(
                df, x="time_bin", y="detection_count",
                title="Detection Frequency Over Time",
                labels={"time_bin": "Time (seconds)", "detection_count": "Detections / Sec"}
            )
            fig.update_traces(line_color=PALETTE["secondary"], fill='tozeroy', fillcolor='rgba(13, 148, 136, 0.15)')
            fig.update_layout(
                xaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                yaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )
            
        path = os.path.join(self.output_dir, "interactive_detection_frequency.html")
        fig.write_html(path)
        return path

    def plot_interactive_confidence_analysis(self) -> str:
        df = self.processor.detections_df
        if df.empty:
            fig = go.Figure().add_annotation(text="No Data Available", showarrow=False)
        else:
            fig = px.histogram(
                df, x="confidence", nbins=15, 
                title="Confidence Level Distribution",
                marginal="box",
                labels={"confidence": "Confidence Score"}
            )
            fig.update_traces(marker_color=PALETTE["secondary"], marker_line_color="#FFFFFF", marker_line_width=1)
            fig.update_layout(
                xaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                yaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )
            
        path = os.path.join(self.output_dir, "interactive_confidence_analysis.html")
        fig.write_html(path)
        return path

    def plot_interactive_severity_analysis(self) -> str:
        df = self.processor.detections_df
        if df.empty:
            fig = go.Figure().add_annotation(text="No Data Available", showarrow=False)
        else:
            fig = px.box(
                df, x="severity", y="terrain_type", 
                title="Terrain Severity Level by Type",
                color="terrain_type",
                color_discrete_map=PALETTE["terrain"],
                labels={"severity": "Severity Score", "terrain_type": "Terrain Type"}
            )
            fig.update_layout(
                xaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                yaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                showlegend=False
            )
            
        path = os.path.join(self.output_dir, "interactive_severity_analysis.html")
        fig.write_html(path)
        return path

    def plot_interactive_drive_mode_usage(self) -> str:
        df = self.processor.get_drive_mode_distribution()
        if df.empty:
            fig = go.Figure().add_annotation(text="No Data Available", showarrow=False)
        else:
            fig = px.pie(
                df, values="percentage", names="drive_mode", 
                title="Drive Mode Usage Percentage",
                color="drive_mode",
                color_discrete_map=PALETTE["drive_mode"],
                hole=0.4
            )
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )
            
        path = os.path.join(self.output_dir, "interactive_drive_mode_usage.html")
        fig.write_html(path)
        return path

    def plot_interactive_ride_height_usage(self) -> str:
        df = self.processor.get_ride_height_distribution()
        if df.empty:
            fig = go.Figure().add_annotation(text="No Data Available", showarrow=False)
        else:
            fig = px.pie(
                df, values="percentage", names="ride_height", 
                title="Ride Height Usage Percentage",
                color="ride_height",
                color_discrete_map=PALETTE["ride_height"],
                hole=0.4
            )
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )
            
        path = os.path.join(self.output_dir, "interactive_ride_height_usage.html")
        fig.write_html(path)
        return path

    def plot_interactive_command_statistics(self) -> str:
        df = self.processor.get_command_statistics()
        if df.empty:
            fig = go.Figure().add_annotation(text="No Data Available", showarrow=False)
        else:
            fig = px.bar(
                df, x="command", y="count", color="status",
                title="Vehicle Commands & Execution Status",
                color_discrete_map={"Executed": PALETTE["secondary"], "Pending": PALETTE["accent"], "Failed": "#EF4444"},
                barmode="group"
            )
            fig.update_layout(
                xaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                yaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )
            
        path = os.path.join(self.output_dir, "interactive_command_statistics.html")
        fig.write_html(path)
        return path

    def plot_interactive_timeline_detections(self) -> str:
        df = self.processor.get_timeline_data()
        if df.empty:
            fig = go.Figure().add_annotation(text="No Data Available", showarrow=False)
        else:
            fig = px.scatter(
                df, x="timestamp", y="terrain_type",
                color="severity", size="confidence",
                hover_data=["frame_id", "confidence", "severity", "drive_mode", "ride_height"],
                title="Timeline of Detections",
                color_continuous_scale="YlOrRd",
                labels={"timestamp": "Time (seconds)", "terrain_type": "Terrain", "severity": "Severity", "confidence": "Confidence"}
            )
            fig.update_layout(
                xaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                yaxis=dict(showgrid=True, gridcolor='#E5E7EB'),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )
            
        path = os.path.join(self.output_dir, "interactive_timeline_detections.html")
        fig.write_html(path)
        return path
