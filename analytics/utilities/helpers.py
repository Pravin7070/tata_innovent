import os
import matplotlib.pyplot as plt
import seaborn as sns

# Color Palette Definitions for Rich Aesthetics
PALETTE = {
    # Brand / Primary
    "primary": "#1A365D",      # Deep Navy
    "secondary": "#0D9488",    # Teal
    "accent": "#F59E0B",       # Amber
    "neutral_dark": "#1F2937", # Charcoal
    "neutral_light": "#F3F4F6",# Off-white
    "background": "#FFFFFF",
    
    # Terrain Types
    "terrain": {
        "Asphalt": "#6B7280",   # Medium Grey
        "Gravel": "#9CA3AF",    # Light Grey
        "Sand": "#F59E0B",      # Amber/Yellow
        "Mud": "#78350F",       # Deep Brown
        "Rock": "#4B5563",      # Dark Slate Grey
        "Grass": "#10B981",     # Vibrant Green
        "Snow": "#38BDF8",      # Sky Blue
        "Unknown": "#EC4899"    # Pink
    },
    
    # Severity Levels
    "severity": {
        "Low": "#10B981",       # Green
        "Medium": "#F59E0B",    # Amber
        "High": "#EF4444",      # Red
        "Critical": "#8B5CF6"   # Purple
    },
    
    # Drive Modes
    "drive_mode": {
        "Eco": "#10B981",
        "Comfort": "#3B82F6",
        "Sport": "#EF4444",
        "Offroad": "#D97706",
        "Custom": "#8B5CF6"
    },
    
    # Ride Heights
    "ride_height": {
        "Low": "#64748B",
        "Normal": "#3B82F6",
        "High": "#F59E0B",
        "Extra High": "#EF4444"
    }
}

def setup_chart_style():
    """
    Configures Matplotlib and Seaborn to use a clean, modern aesthetic.
    """
    sns.set_theme(style="whitegrid")
    plt.rcParams.update({
        "font.family": "sans-serif",
        "font.sans-serif": ["Helvetica", "Arial", "DejaVu Sans"],
        "text.color": PALETTE["neutral_dark"],
        "axes.labelcolor": PALETTE["neutral_dark"],
        "axes.edgecolor": "#E5E7EB",
        "xtick.color": "#4B5563",
        "ytick.color": "#4B5563",
        "figure.facecolor": "#FFFFFF",
        "axes.facecolor": "#F9FAFB",
        "grid.color": "#F3F4F6",
        "grid.linestyle": "-",
        "figure.titlesize": 16,
        "axes.titlesize": 14,
        "axes.labelsize": 12,
        "xtick.labelsize": 10,
        "ytick.labelsize": 10,
    })

def ensure_dir(path: str) -> str:
    """
    Ensures that a directory exists, creating it if necessary.
    Returns the absolute path.
    """
    abs_path = os.path.abspath(path)
    os.makedirs(abs_path, exist_ok=True)
    return abs_path
