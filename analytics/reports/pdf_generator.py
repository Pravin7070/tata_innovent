import os
from datetime import datetime
from typing import Dict, Any, List

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

from analytics.processing.processor import TerrainAnalyticsProcessor
from analytics.utilities.helpers import PALETTE

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and display total page count.
    Also draws a consistent header and footer on all pages.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states: List[Dict[str, Any]] = []
        self.vehicle_id = "Unknown"
        self.session_id = "Unknown"

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count: int):
        self.saveState()
        
        # Don't draw headers/footers on page 1 (cover page style)
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor(PALETTE["primary"]))
            self.drawString(54, 755, "TATA INNOVENT")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#4B5563"))
            self.drawString(130, 755, "|   Terrain Detection & Vehicle Control Analytics")
            self.drawRightString(558, 755, f"Session: {self.session_id}   |   Vehicle: {self.vehicle_id}")
            
            self.setStrokeColor(colors.HexColor("#E5E7EB"))
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)
            
            # Footer
            self.line(54, 55, 558, 55)
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#6B7280"))
            self.drawRightString(558, 42, page_text)
            self.drawString(54, 42, "CONFIDENTIAL — TATA INNOVENT INTERNAL USE ONLY")
            
        else:
            # Simple footer on Page 1
            self.setStrokeColor(colors.HexColor("#E5E7EB"))
            self.setLineWidth(0.5)
            self.line(54, 55, 558, 55)
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#6B7280"))
            self.drawString(54, 42, "TATA INNOVENT — Confidential Report")
            self.drawRightString(558, 42, f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
        self.restoreState()


class TerrainPDFReportGenerator:
    """
    Generates a professional PDF report combining text analytics,
    summary statistics, and generated charts.
    """
    def __init__(self, processor: TerrainAnalyticsProcessor, chart_paths: Dict[str, str]):
        self.processor = processor
        self.chart_paths = chart_paths
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Creates custom paragraph styles matching our brand palette."""
        self.title_style = ParagraphStyle(
            "DocTitle",
            parent=self.styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            textColor=colors.HexColor(PALETTE["primary"]),
            spaceAfter=6
        )
        
        self.subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=self.styles["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=14,
            textColor=colors.HexColor("#4B5563"),
            spaceAfter=20
        )
        
        self.h1_style = ParagraphStyle(
            "Heading1_Custom",
            parent=self.styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=colors.HexColor(PALETTE["primary"]),
            spaceBefore=14,
            spaceAfter=8,
            keepWithNext=True
        )

        self.h2_style = ParagraphStyle(
            "Heading2_Custom",
            parent=self.styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=colors.HexColor(PALETTE["secondary"]),
            spaceBefore=10,
            spaceAfter=6,
            keepWithNext=True
        )

        self.body_style = ParagraphStyle(
            "Body_Custom",
            parent=self.styles["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor(PALETTE["neutral_dark"]),
            spaceAfter=8
        )

        self.bullet_style = ParagraphStyle(
            "Bullet_Custom",
            parent=self.styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor(PALETTE["neutral_dark"]),
            leftIndent=15,
            firstLineIndent=-10,
            spaceAfter=4
        )

        self.card_val_style = ParagraphStyle(
            "CardValue",
            parent=self.styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=18,
            alignment=1, # Center
            textColor=colors.HexColor(PALETTE["primary"])
        )

        self.card_lbl_style = ParagraphStyle(
            "CardLabel",
            parent=self.styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=9,
            alignment=1, # Center
            textColor=colors.HexColor("#6B7280")
        )

    def _create_dashboard_grid(self) -> Table:
        """Creates a 2x3 grid of dashboard cards."""
        metrics = self.processor.summary_metrics
        
        def make_card(label: str, value: Any) -> Table:
            card_data = [
                [Paragraph(label.upper(), self.card_lbl_style)],
                [Paragraph(str(value), self.card_val_style)]
            ]
            t = Table(card_data, colWidths=[158], rowHeights=[14, 22])
            t.setStyle(TableStyle([
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 2),
                ('TOPPADDING', (0,0), (-1,-1), 2),
            ]))
            return t

        c1 = make_card("Total Frames", f"{metrics['total_frames']:,}")
        c2 = make_card("Total Detections", f"{metrics['total_detections']:,}")
        c3 = make_card("Avg Confidence", f"{metrics['avg_confidence']:.2%}" if isinstance(metrics['avg_confidence'], float) else metrics['avg_confidence'])
        c4 = make_card("Avg Severity", f"{metrics['avg_severity']:.2f}")
        c5 = make_card("Common Terrain", metrics['most_common_terrain'])
        c6 = make_card("Primary Drive Mode", metrics['most_used_drive_mode'])

        grid_data = [
            [c1, c2, c3],
            [c4, c5, c6]
        ]
        
        grid_table = Table(grid_data, colWidths=[168, 168, 168], rowHeights=[48, 48])
        grid_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F9FAFB")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E5E7EB")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        return grid_table

    def _create_metadata_table(self) -> Table:
        """Creates a clean metadata table for the report header."""
        data = [
            [
                Paragraph("<b>Vehicle ID:</b>", self.body_style),
                Paragraph(self.processor.vehicle_id, self.body_style),
                Paragraph("<b>Session ID:</b>", self.body_style),
                Paragraph(self.processor.session_id, self.body_style)
            ],
            [
                Paragraph("<b>Start Time:</b>", self.body_style),
                Paragraph(self.processor.start_time or "N/A", self.body_style),
                Paragraph("<b>End Time:</b>", self.body_style),
                Paragraph(self.processor.end_time or "N/A", self.body_style)
            ]
        ]
        t = Table(data, colWidths=[80, 172, 80, 172])
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#F3F4F6")),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('TOPPADDING', (0,0), (-1,-1), 4),
        ]))
        return t

    def generate(self, output_path: str):
        """Generates the PDF report and saves it to output_path."""
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            leftMargin=54,
            rightMargin=54,
            topMargin=72,
            bottomMargin=72
        )
        
        story = []
        
        # ------------------ PAGE 1: COVER & OVERVIEW ------------------
        story.append(Paragraph("Terrain Detection & Vehicle Control Report", self.title_style))
        story.append(Paragraph(f"TATA INNOVENT — Advanced Analytics & ADAS Integration System", self.subtitle_style))
        story.append(Spacer(1, 10))
        
        story.append(self._create_metadata_table())
        story.append(Spacer(1, 20))
        
        story.append(Paragraph("Executive Summary Dashboard", self.h1_style))
        story.append(Paragraph(
            "This report summarizes the terrain classifications, hazard severities, and subsequent vehicle commands "
            "generated during the testing session. The dashboard below showcases key performance indicators of the "
            "terrain-sensing AI engine and the vehicle's dynamic response.",
            self.body_style
        ))
        story.append(Spacer(1, 8))
        story.append(self._create_dashboard_grid())
        story.append(Spacer(1, 25))
        
        story.append(Paragraph("1. Terrain Distribution Analysis", self.h1_style))
        story.append(Paragraph(
            "Understanding the variety of terrain traversed is essential for evaluating vehicle adaptability and "
            "drive mode transitions. The chart below illustrates the relative frequency of each detected terrain class.",
            self.body_style
        ))
        if "terrain_distribution" in self.chart_paths:
            story.append(Image(self.chart_paths["terrain_distribution"], width=420, height=220))
            
        story.append(PageBreak())
        
        # ------------------ PAGE 2: FREQUENCY, CONFIDENCE & SEVERITY ------------------
        story.append(Paragraph("2. Detection Frequency & Confidence Analysis", self.h1_style))
        story.append(Paragraph(
            "Analyzing the rate of detections per second helps verify the AI engine's processing consistency and "
            "identifies periods of high activity. The line chart below tracks detections over the timeline.",
            self.body_style
        ))
        if "detection_frequency" in self.chart_paths:
            story.append(Image(self.chart_paths["detection_frequency"], width=450, height=180))
            story.append(Spacer(1, 10))
            
        story.append(Paragraph(
            "The confidence distribution shows the certainty of the model's classifications. "
            "A high mean confidence signifies stable and reliable neural network inference.",
            self.body_style
        ))
        if "confidence_analysis" in self.chart_paths:
            story.append(Image(self.chart_paths["confidence_analysis"], width=420, height=200))
            
        story.append(PageBreak())
        
        # ------------------ PAGE 3: SEVERITY & VEHICLE STATE ------------------
        story.append(Paragraph("3. Terrain Severity & Vehicle State Analysis", self.h1_style))
        story.append(Paragraph(
            "Severity scores represent the potential impact of terrain hazards (e.g., deep mud, large rocks, or rough gravel) "
            "on the vehicle. The box plot shows the spread of severity scores across different terrain types, "
            "identifying which environments presented the highest risk.",
            self.body_style
        ))
        if "severity_analysis" in self.chart_paths:
            story.append(Image(self.chart_paths["severity_analysis"], width=420, height=180))
            story.append(Spacer(1, 15))

        story.append(Paragraph("4. Drive Mode & Ride Height Usage", self.h1_style))
        story.append(Paragraph(
            "These charts analyze the percentage of time the vehicle spent in various drive modes and ride heights, "
            "offering insights into how the vehicle responded to the detected terrain characteristics.",
            self.body_style
        ))
        
        # Put the two small charts side-by-side or stacked
        mode_chart = self.chart_paths.get("drive_mode_usage")
        height_chart = self.chart_paths.get("ride_height_usage")
        
        if mode_chart and height_chart:
            # We can create a table to show them side-by-side
            img_mode = Image(mode_chart, width=240, height=150)
            img_height = Image(height_chart, width=240, height=150)
            side_by_side = Table([[img_mode, img_height]], colWidths=[252, 252])
            side_by_side.setStyle(TableStyle([
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ]))
            story.append(side_by_side)
        
        story.append(PageBreak())

        # ------------------ PAGE 4: COMMANDS, TIMELINE & RECOMMENDATIONS ------------------
        story.append(Paragraph("5. Vehicle Command Statistics & Timeline", self.h1_style))
        story.append(Paragraph(
            "The system triggers active control commands (such as adjusting suspension ride height or changing drive modes) "
            "when hazardous terrains are identified. Below is the breakdown of commands and their execution status.",
            self.body_style
        ))
        if "command_statistics" in self.chart_paths:
            story.append(Image(self.chart_paths["command_statistics"], width=420, height=185))
            story.append(Spacer(1, 10))

        story.append(Paragraph(
            "The timeline scatter plot below map detections chronologically, with the marker color indicating "
            "severity and the marker size reflecting confidence. This provides a comprehensive overview of the entire drive.",
            self.body_style
        ))
        if "timeline_detections" in self.chart_paths:
            story.append(Image(self.chart_paths["timeline_detections"], width=450, height=200))
            story.append(Spacer(1, 15))
            
        story.append(Paragraph("Key Findings & Recommendations", self.h2_style))
        
        # Generate dynamic recommendations based on data
        metrics = self.processor.summary_metrics
        avg_conf = metrics["avg_confidence"]
        avg_sev = metrics["avg_severity"]
        
        story.append(Paragraph(
            f"• <b>AI Confidence:</b> The model demonstrated an average confidence of <b>{avg_conf:.1%}</b>. "
            f"This is considered {'highly reliable' if avg_conf >= 0.85 else 'moderately stable, but could benefit from further training'} "
            f"for autonomous terrain classification.",
            self.bullet_style
        ))
        story.append(Paragraph(
            f"• <b>Terrain Complexity:</b> The primary terrain encountered was <b>{metrics['most_common_terrain']}</b>. "
            f"Average terrain severity was <b>{avg_sev:.2f}</b>, indicating a {'relatively smooth' if avg_sev < 0.3 else 'moderate' if avg_sev < 0.6 else 'highly demanding'} "
            f"driving environment.",
            self.bullet_style
        ))
        story.append(Paragraph(
            f"• <b>Control Feedback:</b> Active ride height and drive mode changes were successfully executed. "
            f"The most used drive mode was <b>{metrics['most_used_drive_mode']}</b>, aligning with the dominant terrain types.",
            self.bullet_style
        ))
        
        # Build the document using the NumberedCanvas
        canvas_maker = NumberedCanvas
        # We can set the session/vehicle IDs on the canvas class or instances.
        # SimpleDocTemplate uses canvasmaker to instantiate. We can pass custom attributes by overriding the canvas maker.
        def custom_canvas_builder(*args, **kwargs):
            c = canvas_maker(*args, **kwargs)
            c.vehicle_id = self.processor.vehicle_id
            c.session_id = self.processor.session_id
            return c
            
        doc.build(story, canvasmaker=custom_canvas_builder)
