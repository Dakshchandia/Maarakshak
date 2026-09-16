import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def draw_rounded_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def get_font(size, bold=False):
    font_names = ["arialbd.ttf" if bold else "arial.ttf", "segoeuib.ttf" if bold else "segoeui.ttf", "calibrib.ttf" if bold else "calibri.ttf"]
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()

def draw_arrow(draw, start, end, color=(99, 102, 241), width=3, arrow_size=8):
    x1, y1 = start
    x2, y2 = end
    draw.line([x1, y1, x2, y2], fill=color, width=width)
    angle = math.atan2(y2 - y1, x2 - x1)
    p1 = (x2 - arrow_size * math.cos(angle - math.pi / 5), y2 - arrow_size * math.sin(angle - math.pi / 5))
    p2 = (x2 - arrow_size * math.cos(angle + math.pi / 5), y2 - arrow_size * math.sin(angle + math.pi / 5))
    draw.polygon([end, p1, p2], fill=color)

def generate_sih_diagram(output_path):
    # Dimensions for diagram canvas (2400 x 1400)
    width, height = 2400, 1400
    img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    font_hdr = get_font(26, bold=True)
    font_subhdr = get_font(18, bold=False)
    font_card_title = get_font(19, bold=True)
    font_bold = get_font(16, bold=True)
    font_body = get_font(14, bold=False)
    font_small = get_font(13, bold=False)

    # -------------------------------------------------------------
    # LEFT BOX: 1. Patient Journey (x: 10 to 1600, y: 10 to 1390)
    # -------------------------------------------------------------
    pj_box = (10, 10, 1620, 1390)
    draw_rounded_rect(draw, pj_box, radius=16, fill=(245, 243, 255, 255), outline=(196, 181, 253, 255), width=2)

    # Header Bar (Purple)
    draw_rounded_rect(draw, (pj_box[0] + 10, pj_box[1] + 10, pj_box[2] - 10, pj_box[1] + 75), radius=12, fill=(124, 58, 237, 255))
    draw.text((pj_box[0] + 30, pj_box[1] + 18), "1. Patient Journey", fill=(255, 255, 255), font=font_hdr)
    draw.text((pj_box[0] + 30, pj_box[1] + 48), "From login to guidance — and beyond", fill=(237, 233, 254, 255), font=font_subhdr)

    # 8 Steps Grid (2 rows x 4 columns)
    # Row 1: Steps 1, 2, 3, 4 (y: 100 to 690)
    # Row 2: Steps 5, 6, 7, 8 (y: 720 to 1370)

    step_w = 370
    step_h = 580

    steps_data = [
        # Row 1
        ("1", "Landing Page", "User opens Maaraksha\nand sees main interface", [
            "• Hero Section & Overview",
            "• Instant Get Started Tap",
            "• App Feature Highlights"
        ], (238, 242, 255), (99, 102, 241)),

        ("2", "Login & Authentication", "Login with Gmail / Clerk", [
            "• Gmail OAuth Login",
            "• Role Selection Menu:",
            "  - Patient  - ASHA Worker",
            "  - PHC      - District",
            "  - Family Member"
        ], (238, 242, 255), (99, 102, 241)),

        ("3", "Patient Profile Setup", "Enter basic details & upload", [
            "• Name, Age & Month", "• Pre-existing History", "• Upload Medical Reports", "• OCR Data Extraction"
        ], (236, 253, 245), (16, 185, 129)),

        ("4", "Patient Dashboard", "View profile & health status", [
            "• Pregnancy Trimester", "• Risk Level Indicator", "• Daily Check-in Calendar", "• Reminders & AI Chat"
        ], (250, 245, 255), (168, 85, 247)),

        # Row 2
        ("5", "Daily Check-in", "Share current health method", [
            "• Select (Predefined)", "• Voice (Native Speech)", "• Text Input", "• Instant Microphone Tap"
        ], (239, 246, 255), (37, 99, 235)),

        ("6", "AI Analysis", "AI extracts symptoms & risk", [
            "• Gemini 1.5 Flash AI", "• Symptom NLP Parser", "• Risk Score (0-100)", "• Clinical Guidance"
        ], (238, 242, 255), (79, 70, 229)),

        ("7", "Risk Assessment & Action", "System takes right action", [
            "🟢 Normal Risk:\n  Continue monitoring", "🟡 High Risk:\n  Prioritize in dashboards", "🔴 Critical Risk:\n  SOS alert & dispatch"
        ], (254, 243, 199), (217, 119, 6)),

        ("8", "Health Timeline & Reports", "Saved history & PDF reports", [
            "• Chronological Timeline", "• Weekly Risk Trends", "• PDF Doctor Report", "• High-Risk Center"
        ], (240, 253, 250), (13, 148, 136))
    ]

    for idx, (num, title, desc, bullets, bg_col, border_col) in enumerate(steps_data):
        row = idx // 4
        col = idx % 4
        
        sx = pj_box[0] + 25 + col * 390
        sy = 100 + row * 620
        
        sbox = (sx, sy, sx + step_w, sy + step_h)
        draw_rounded_rect(draw, sbox, radius=12, fill=bg_col, outline=border_col, width=2)

        # Number Badge Circle
        num_cx, num_cy = sx + 35, sy + 35
        draw.ellipse([num_cx - 20, num_cy - 20, num_cx + 20, num_cy + 20], fill=border_col)
        draw.text((num_cx - 7, num_cy - 12), num, fill=(255, 255, 255), font=get_font(18, bold=True))

        # Title & Subtitle
        draw.text((sx + 65, sy + 15), title, fill=(15, 23, 42), font=font_card_title)
        draw.text((sx + 65, sy + 43), desc, fill=(100, 116, 139), font=font_small)

        # Divider line
        draw.line([sx + 15, sy + 75, sx + step_w - 15, sy + 75], fill=(203, 213, 225), width=1)

        # Bullets
        for b_i, b_txt in enumerate(bullets):
            lines = b_txt.split("\n")
            for l_i, line_str in enumerate(lines):
                draw.text((sx + 20, sy + 90 + b_i * 95 + l_i * 30), line_str, fill=(30, 41, 59), font=font_body)

        # Connecting Arrow between steps horizontally
        if col < 3:
            draw_arrow(draw, (sx + step_w + 3, sy + step_h // 2), (sx + step_w + 17, sy + step_h // 2), color=border_col, width=3, arrow_size=8)

    # -------------------------------------------------------------
    # RIGHT BOX: 2. Other Users & Dashboards (x: 1650 to 2390)
    # -------------------------------------------------------------
    ud_box = (1650, 10, 2390, 1390)
    draw_rounded_rect(draw, ud_box, radius=16, fill=(240, 249, 255, 255), outline=(186, 230, 253, 255), width=2)

    # Header Bar (Teal)
    draw_rounded_rect(draw, (ud_box[0] + 10, ud_box[1] + 10, ud_box[2] - 10, ud_box[1] + 75), radius=12, fill=(2, 132, 199, 255))
    draw.text((ud_box[0] + 25, ud_box[1] + 18), "2. Other Users & Dashboards", fill=(255, 255, 255), font=font_hdr)
    draw.text((ud_box[0] + 25, ud_box[1] + 48), "A connected system for everyone", fill=(224, 242, 254, 255), font=font_subhdr)

    # 4 Roles Stacked Vertically
    roles = [
        ("ASHA Worker", (239, 246, 255), (37, 99, 235), [
            "• View assigned patients in district",
            "• Risk-based priority list (RED → GREEN)",
            "• Patient field visit tracking",
            "• Update visit status & observations"
        ]),
        ("Family Member", (250, 245, 255), (147, 51, 234), [
            "• View linked patient health status",
            "• Medicines & dosage reminders",
            "• Upcoming ANC doctor appointments",
            "• Receive instant emergency SOS alerts"
        ]),
        ("PHC (Primary Health Center)", (238, 242, 255), (79, 70, 229), [
            "• Access full patient health history",
            "• Detailed AI risk analysis information",
            "• Auto-generated medical reports",
            "• Better care coordination with ASHA"
        ]),
        ("District Officer", (254, 252, 232), (202, 138, 4), [
            "• Monitor ASHA worker activities",
            "• Track patient village assignments",
            "• Check visit & task completion status",
            "• Handle complaints & escalations"
        ])
    ]

    for r_i, (r_name, r_bg, r_border, r_bullets) in enumerate(roles):
        ry = 100 + r_i * 320
        rbox = (ud_box[0] + 20, ry, ud_box[2] - 20, ry + 300)
        draw_rounded_rect(draw, rbox, radius=12, fill=r_bg, outline=r_border, width=2)

        # Title bar
        draw_rounded_rect(draw, (rbox[0] + 10, rbox[1] + 10, rbox[2] - 10, rbox[1] + 55), radius=8, fill=r_border)
        draw.text((rbox[0] + 20, rbox[1] + 18), r_name, fill=(255, 255, 255), font=font_card_title)

        # Bullets
        for b_i, b_txt in enumerate(r_bullets):
            draw.text((rbox[0] + 20, rbox[1] + 75 + b_i * 50), b_txt, fill=(30, 41, 59), font=font_body)

    # Save output diagram image
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, quality=98)
    print(f"Generated SIH 2026 flow diagram at: {output_path}")

if __name__ == "__main__":
    out_img = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "maaraksha_sih_flow_diagram.png"))
    generate_sih_diagram(out_img)
