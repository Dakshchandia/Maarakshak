import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_canvas(width, height, bg_color=(241, 245, 249, 255)):
    img = Image.new("RGBA", (width, height), bg_color)
    return img

def draw_shadow_box(img, box, radius=10, shadow_offset=(0, 3), shadow_blur=6, shadow_color=(0, 0, 0, 20)):
    shadow_img = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_img)
    sb = [box[0] + shadow_offset[0], box[1] + shadow_offset[1], box[2] + shadow_offset[0], box[3] + shadow_offset[1]]
    sdraw.rounded_rectangle(sb, radius=radius, fill=shadow_color)
    shadow_blur_img = shadow_img.filter(ImageFilter.GaussianBlur(shadow_blur))
    img.alpha_composite(shadow_blur_img)

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

def draw_arrow(draw, start, end, color=(100, 116, 139), width=3, arrow_size=9):
    x1, y1 = start
    x2, y2 = end
    draw.line([x1, y1, x2, y2], fill=color, width=width)
    angle = math.atan2(y2 - y1, x2 - x1)
    p1 = (x2 - arrow_size * math.cos(angle - math.pi / 5), y2 - arrow_size * math.sin(angle - math.pi / 5))
    p2 = (x2 - arrow_size * math.cos(angle + math.pi / 5), y2 - arrow_size * math.sin(angle + math.pi / 5))
    draw.polygon([end, p1, p2], fill=color)

# -------------------------------------------------------------
# ICON DRAWING HELPERS
# -------------------------------------------------------------
def draw_icon_user(draw, cx, cy, size=14, color=(30, 58, 138)):
    r = size // 2.5
    draw.ellipse([cx - r, cy - size//1.2, cx + r, cy - size//1.2 + 2*r], fill=color)
    draw.chord([cx - size, cy - size//4, cx + size, cy + size], start=180, end=360, fill=color)

def draw_icon_heart(draw, cx, cy, size=14, color=(225, 29, 72)):
    r = size // 2
    draw.ellipse([cx - r, cy - r, cx, cy], fill=color)
    draw.ellipse([cx, cy - r, cx + r, cy], fill=color)
    draw.polygon([(cx - r, cy - r//3), (cx + r, cy - r//3), (cx, cy + r)], fill=color)

def draw_icon_brain(draw, cx, cy, size=14, color=(147, 51, 234)):
    draw.ellipse([cx - size, cy - size//1.2, cx + size, cy + size//1.2], outline=color, width=2)
    draw.line([cx, cy - size//1.2, cx, cy + size//1.2], fill=color, width=2)
    draw.line([cx - size//1.5, cy, cx + size//1.5, cy], fill=color, width=2)

def draw_icon_shield(draw, cx, cy, size=14, color=(234, 88, 12)):
    pts = [(cx - size, cy - size), (cx + size, cy - size), (cx + size, cy), (cx, cy + size), (cx - size, cy)]
    draw.polygon(pts, fill=color)

def draw_icon_bell(draw, cx, cy, size=14, color=(225, 29, 72)):
    draw.chord([cx - size//1.2, cy - size, cx + size//1.2, cy + size//2], start=180, end=360, fill=color)
    draw.rectangle([cx - size, cy, cx + size, cy + size//3], fill=color)

def draw_icon_database(draw, cx, cy, size=14, color=(2, 132, 199)):
    for dy in [-size//1.2, 0, size//1.2]:
        draw.ellipse([cx - size, cy + dy - size//3, cx + size, cy + dy + size//3], fill=color)

def draw_icon_document(draw, cx, cy, size=14, color=(13, 148, 136)):
    draw.rectangle([cx - size//1.2, cy - size, cx + size//1.2, cy + size], fill=color)
    draw.line([cx - size//2, cy - size//2, cx + size//2, cy - size//2], fill=(255, 255, 255), width=2)

def draw_icon_cloud(draw, cx, cy, size=14, color=(37, 99, 235)):
    draw.ellipse([cx - size, cy - size//2, cx, cy + size//2], fill=color)
    draw.ellipse([cx - size//2, cy - size, cx + size//2, cy + size//2], fill=color)
    draw.ellipse([cx, cy - size//2, cx + size, cy + size//2], fill=color)

def draw_icon_mic(draw, cx, cy, size=14, color=(13, 148, 136)):
    draw.rounded_rectangle([cx - size//2, cy - size, cx + size//2, cy + size//4], radius=size//4, fill=color)
    draw.arc([cx - size//1.2, cy - size//2, cx + size//1.2, cy + size//1.8], start=0, end=180, fill=color, width=2)

def draw_icon_pill(draw, cx, cy, size=14, color=(5, 150, 105)):
    draw.rounded_rectangle([cx - size, cy - size//2, cx + size, cy + size//2], radius=size//2, fill=color)

def draw_icon_calendar(draw, cx, cy, size=14, color=(79, 70, 229)):
    draw.rounded_rectangle([cx - size, cy - size, cx + size, cy + size], radius=3, fill=color)

def draw_icon_hospital(draw, cx, cy, size=14, color=(225, 29, 72)):
    draw.rectangle([cx - size, cy - size, cx + size, cy + size], fill=color)

def draw_icon_phone(draw, cx, cy, size=14, color=(225, 29, 72)):
    draw.rounded_rectangle([cx - size//2, cy - size, cx + size//2, cy + size], radius=3, fill=color)

def draw_icon_house(draw, cx, cy, size=14, color=(37, 99, 235)):
    draw.polygon([(cx - size, cy), (cx + size, cy), (cx, cy - size)], fill=color)
    draw.rectangle([cx - size//1.2, cy, cx + size//1.2, cy + size], fill=color)

def draw_icon_gavel(draw, cx, cy, size=14, color=(202, 138, 4)):
    draw.rectangle([cx - size, cy - size//3, cx + size, cy + size//3], fill=color)

def draw_icon_check(draw, cx, cy, size=14, color=(5, 150, 105)):
    draw.ellipse([cx - size, cy - size, cx + size, cy + size], fill=color)


def generate_tight_compact_diagram(output_path):
    width, height = 3840, 2160
    img = create_canvas(width, height, bg_color=(248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    # Crisp typography
    font_title = get_font(44, bold=True)
    font_subtitle = get_font(18, bold=True)
    font_header = get_font(18, bold=True)
    font_body_bold = get_font(16, bold=True)
    font_body = get_font(14, bold=False)

    pad = 12

    # -------------------------------------------------------------
    # 1. TOP HEADER BANNER (y: 12 to 140)
    # -------------------------------------------------------------
    h_box = (pad, pad, width - pad, 140)
    draw_shadow_box(img, h_box, radius=12, shadow_offset=(0, 3), shadow_blur=8, shadow_color=(15, 23, 42, 35))
    
    h_bg = Image.new("RGBA", (h_box[2] - h_box[0], h_box[3] - h_box[1]), (15, 23, 42, 255))
    img.paste(h_bg, (h_box[0], h_box[1]))
    draw = ImageDraw.Draw(img)

    # Logo
    draw_icon_heart(draw, pad + 35, pad + 35, size=20, color=(239, 68, 68))
    draw_icon_user(draw, pad + 35, pad + 45, size=14, color=(255, 255, 255))

    draw.text((pad + 75, pad + 15), "MAARAKSHAK", fill=(255, 255, 255), font=font_title)
    draw.text((pad + 75, pad + 70), "AI-POWERED MATERNAL HEALTH EARLY WARNING & CARE NETWORK", fill=(251, 146, 60), font=font_subtitle)

    # Center Badge
    draw_rounded_rect(draw, (1320, pad + 15, 2250, pad + 60), radius=10, fill=(30, 58, 138, 255), outline=(96, 165, 250, 255), width=2)
    draw.text((1360, pad + 24), "⚡ COMPLETE SYSTEM WORKFLOW", fill=(255, 255, 255), font=get_font(20, bold=True))

    # Top Center Login Flow
    flow_y = pad + 70
    steps = [
        ("1. USER", "Opens Maarakshak"),
        ("2. LOGIN", "Clerk / Gmail Auth"),
        ("3. ROLE SELECTION", "Woman|ASHA|PHC|Dist|Fam"),
        ("4. DASHBOARD", "Lands on Specific Dashboard")
    ]
    for i, (st1, st2) in enumerate(steps):
        sx = 1300 + i * 235
        draw_rounded_rect(draw, (sx, flow_y, sx + 215, flow_y + 52), radius=6, fill=(30, 41, 59, 255), outline=(71, 85, 105, 255), width=1)
        draw_icon_user(draw, sx + 15, flow_y + 26, size=8, color=(251, 146, 60))
        draw.text((sx + 30, flow_y + 8), st1, fill=(251, 146, 60), font=get_font(11, bold=True))
        draw.text((sx + 30, flow_y + 26), st2, fill=(226, 232, 240), font=get_font(11, bold=False))
        if i < len(steps) - 1:
            draw_arrow(draw, (sx + 217, flow_y + 26), (sx + 233, flow_y + 26), color=(96, 165, 250), width=2, arrow_size=7)

    # Top Right Box
    df_box = (2350, pad + 10, width - pad - 10, 130)
    draw_rounded_rect(draw, df_box, radius=10, fill=(30, 41, 59, 255), outline=(99, 102, 241, 255), width=2)
    draw.text((df_box[0] + 15, df_box[1] + 8), "DATA FLOW OVERVIEW (AT A GLANCE)", fill=(165, 180, 252), font=font_body_bold)
    
    df_items = [
        ("Patient Data", (59, 130, 246), draw_icon_user),
        ("AI Analysis", (168, 85, 247), draw_icon_brain),
        ("Risk Score", (249, 115, 22), draw_icon_shield),
        ("Alerts", (239, 68, 68), draw_icon_bell),
        ("Action", (34, 197, 94), draw_icon_check)
    ]
    for i, (dfi, dcol, icon_fn) in enumerate(df_items):
        ix = df_box[0] + 12 + i * 155
        iy = df_box[1] + 36
        draw_rounded_rect(draw, (ix, iy, ix + 138, iy + 48), radius=8, fill=(15, 23, 42, 255), outline=dcol, width=2)
        icon_fn(draw, ix + 18, iy + 24, size=10, color=dcol)
        draw.text((ix + 35, iy + 14), dfi, fill=(255, 255, 255), font=font_body_bold)
        if i < len(df_items) - 1:
            draw_arrow(draw, (ix + 140, iy + 24), (ix + 153, iy + 24), color=dcol, width=2, arrow_size=7)

    # -------------------------------------------------------------
    # MAIN GRID LAYOUT (y: 150 to 1660)
    # -------------------------------------------------------------

    # COL 1: PATIENT JOURNEY (x: 12 to 810, y: 150 to 1660)
    # Outer box: height 1510px
    pj_box = (12, 150, 810, 1660)
    draw_shadow_box(img, pj_box, radius=12, shadow_offset=(0, 3), shadow_blur=8, shadow_color=(13, 148, 136, 20))
    draw_rounded_rect(draw, pj_box, radius=12, fill=(240, 253, 250, 255), outline=(13, 148, 136, 255), width=2)
    
    # Header Pill
    draw_rounded_rect(draw, (pj_box[0] + 12, pj_box[1] + 10, pj_box[2] - 12, pj_box[1] + 46), radius=8, fill=(13, 148, 136, 255))
    draw_icon_user(draw, pj_box[0] + 30, pj_box[1] + 28, size=11, color=(255, 255, 255))
    draw.text((pj_box[0] + 50, pj_box[1] + 14), "1. PATIENT JOURNEY", fill=(255, 255, 255), font=font_header)

    pj_subsections = [
        ("Profile Setup", ["• Name, Age & Pregnancy Month", "• Pre-existing Health History", "• Role Authentication Setup"], draw_icon_user),
        ("Upload Previous Reports", ["• Medical Reports & Ultrasonography", "• Prescription Document Scan", "• OCR Data & Text Extraction"], draw_icon_cloud),
        ("Patient Dashboard", ["• Profile Summary & Trimester", "• Pregnancy Risk Overview Badge", "• Daily Check-in Calendar Timeline"], draw_icon_document),
        ("Daily Check-in (3 Ways)", ["• Voice Input (Hindi / Regional)", "• Text Symptom Description Entry", "• Interactive Symptom Selector Grid"], draw_icon_mic),
        ("AI Analysis Engine", ["• Symptom Extraction NLP Engine", "• Real-time Risk Score Calculation", "• Instant Personalized Care Tip"], draw_icon_brain),
        ("Health Feed / Timeline", ["• Chronological Symptom History", "• Weekly Risk Progression Tracking", "• Exportable PDF Medical Summary"], draw_icon_calendar)
    ]

    # COMPACT CARD HEIGHT: 210px each, Gap: 25px
    for i, (title, items, icon_fn) in enumerate(pj_subsections):
        sy = pj_box[1] + 56 + i * 235
        # Tight card height = 210px! Filled 100% with content!
        s_box = (pj_box[0] + 12, sy, pj_box[2] - 12, sy + 210)
        draw_rounded_rect(draw, s_box, radius=8, fill=(255, 255, 255, 255), outline=(153, 246, 228, 255), width=2)
        
        # Sub-header bar inside card
        draw_rounded_rect(draw, (s_box[0] + 6, s_box[1] + 6, s_box[2] - 6, s_box[1] + 42), radius=6, fill=(204, 251, 241, 255))
        icon_fn(draw, s_box[0] + 20, s_box[1] + 24, size=10, color=(15, 118, 110))
        draw.text((s_box[0] + 36, s_box[1] + 12), title, fill=(15, 118, 110), font=font_body_bold)
        
        # 3 bullet items taking up whole card body!
        for j, itm in enumerate(items):
            draw.text((s_box[0] + 15, s_box[1] + 54 + j * 46), itm, fill=(51, 65, 85), font=font_body)
        
        if i < len(pj_subsections) - 1:
            draw_arrow(draw, (s_box[0] + (s_box[2]-s_box[0])//2, s_box[3]), (s_box[0] + (s_box[2]-s_box[0])//2, sy + 235), color=(13, 148, 136), width=2)


    # COL 2: Middle Column (x: 825 to 2230, y: 150 to 1660)
    
    # Box 2: Health Modules (Patient) (y: 150 to 760) -> Height 610px
    hm_box = (825, 150, 2230, 760)
    draw_shadow_box(img, hm_box, radius=12, shadow_offset=(0, 3), shadow_blur=8, shadow_color=(5, 150, 105, 20))
    draw_rounded_rect(draw, hm_box, radius=12, fill=(240, 253, 244, 255), outline=(5, 150, 105, 255), width=2)
    
    draw_rounded_rect(draw, (hm_box[0] + 12, hm_box[1] + 10, hm_box[2] - 12, hm_box[1] + 46), radius=8, fill=(5, 150, 105, 255))
    draw_icon_heart(draw, hm_box[0] + 30, hm_box[1] + 28, size=11, color=(255, 255, 255))
    draw.text((hm_box[0] + 50, hm_box[1] + 14), "2. HEALTH MODULES (PATIENT)", fill=(255, 255, 255), font=font_header)

    hm_modules = [
        ("Reports & Analytics", ["• Auto-generated Doctor Summary", "• Symptom Progression Timeline", "• One-click PDF / Print Export"], draw_icon_document),
        ("AI Report Analyzer", ["• Lab & Ultrasound File Scanner", "• Plain Native Language AI Summary", "• Critical Value Highlight Alerts"], draw_icon_brain),
        ("Medicine & Reminders", ["• Prescription Medicine Scanner", "• Daily Dosage & Timing Schedule", "• Missed Dose Adherence Alert"], draw_icon_pill),
        ("Appointment Tracker", ["• ANC Visit Calendar Sync", "• Automated Doctor Reminders", "• Missed Appointment Tracking"], draw_icon_calendar),
        ("AI Health Assistant", ["• 24/7 Conversational AI Chatbot", "• Personalized Clinical Guidance", "• Immediate Emergency Escalation"], draw_icon_brain)
    ]

    for i, (mtitle, mitems, icon_fn) in enumerate(hm_modules):
        mx = hm_box[0] + 15 + (i % 3) * 455
        my = hm_box[1] + 56 + (i // 3) * 340
        if i == 3: mx = hm_box[0] + 242
        if i == 4: mx = hm_box[0] + 700
        
        mbox = (mx, my, mx + 438, my + 320)
        draw_rounded_rect(draw, mbox, radius=8, fill=(255, 255, 255, 255), outline=(167, 243, 208, 255), width=2)
        
        draw_rounded_rect(draw, (mbox[0] + 6, mbox[1] + 6, mbox[2] - 6, mbox[1] + 42), radius=6, fill=(209, 250, 229, 255))
        icon_fn(draw, mbox[0] + 20, mbox[1] + 24, size=10, color=(4, 120, 87))
        draw.text((mbox[0] + 36, mbox[1] + 12), mtitle, fill=(4, 120, 87), font=font_body_bold)
        
        for j, mitm in enumerate(mitems):
            draw.text((mbox[0] + 15, mbox[1] + 54 + j * 46), mitm, fill=(51, 65, 85), font=font_body)

    # Box 3: Risk Assessment Engine (y: 775 to 1210) -> Height 435px
    ra_box = (825, 775, 2230, 1210)
    draw_shadow_box(img, ra_box, radius=12, shadow_offset=(0, 3), shadow_blur=8, shadow_color=(234, 88, 12, 20))
    draw_rounded_rect(draw, ra_box, radius=12, fill=(255, 247, 237, 255), outline=(234, 88, 12, 255), width=2)
    
    draw_rounded_rect(draw, (ra_box[0] + 12, ra_box[1] + 10, ra_box[2] - 12, ra_box[1] + 46), radius=8, fill=(234, 88, 12, 255))
    draw_icon_shield(draw, ra_box[0] + 30, ra_box[1] + 28, size=11, color=(255, 255, 255))
    draw.text((ra_box[0] + 50, ra_box[1] + 14), "RISK ASSESSMENT ENGINE (AI ANALYZES ALL DATA)", fill=(255, 255, 255), font=font_header)

    risk_tiers = [
        ("🟢 LOW RISK (0-30)", ["• Routine Self-monitoring", "• Standard ANC Visit Schedule", "• Weekly Health & Nutrition Tips"], (220, 252, 231, 255), (22, 101, 52), (34, 197, 94, 255)),
        ("🟡 MEDIUM RISK (31-60)", ["• ASHA Field Visit Scheduled", "• Medical Advice Consultation", "• Increased Monitoring Frequency"], (254, 249, 195, 255), (133, 77, 14), (234, 179, 8, 255)),
        ("🔴 HIGH / CRITICAL RISK", ["• Immediate Emergency SOS Alert", "• Auto Escalate to PHC & Family", "• Ambulance & Hospital Dispatch"], (254, 226, 226, 255), (153, 27, 27), (239, 68, 68, 255))
    ]

    for i, (rtitle, ritems, rbg, rtxt, rborder) in enumerate(risk_tiers):
        rx = ra_box[0] + 15 + i * 455
        rbox = (rx, ra_box[1] + 56, rx + 440, ra_box[1] + 415)
        draw_rounded_rect(draw, rbox, radius=10, fill=rbg, outline=rborder, width=2)
        
        draw.text((rbox[0] + 15, rbox[1] + 18), rtitle, fill=rtxt, font=font_body_bold)
        for j, ritm in enumerate(ritems):
            draw.text((rbox[0] + 15, rbox[1] + 65 + j * 50), ritm, fill=(30, 41, 59), font=font_body)

    # Box 4: Emergency & Alert System (y: 1225 to 1660) -> Height 435px
    em_box = (825, 1225, 2230, 1660)
    draw_shadow_box(img, em_box, radius=12, shadow_offset=(0, 3), shadow_blur=8, shadow_color=(225, 29, 72, 20))
    draw_rounded_rect(draw, em_box, radius=12, fill=(255, 241, 242, 255), outline=(225, 29, 72, 255), width=2)
    
    draw_rounded_rect(draw, (em_box[0] + 12, em_box[1] + 10, em_box[2] - 12, em_box[1] + 46), radius=8, fill=(225, 29, 72, 255))
    draw_icon_bell(draw, em_box[0] + 30, em_box[1] + 28, size=11, color=(255, 255, 255))
    draw.text((em_box[0] + 50, em_box[1] + 14), "EMERGENCY & ALERT SYSTEM", fill=(255, 255, 255), font=font_header)

    em_steps = [
        ("🚨 SOS Triggered", "High Risk / 1-Tap Tap", draw_icon_bell),
        ("📱 Alert Contacts", "Instant SMS/Email/App", draw_icon_phone),
        ("🏥 Nearest Hospital", "Live GPS Hospital Map", draw_icon_hospital),
        ("🚑 Hospital Dispatch", "Contact & History Shared", draw_icon_hospital)
    ]
    for i, (etitle, edesc, icon_fn) in enumerate(em_steps):
        ex = em_box[0] + 15 + i * 342
        ebox = (ex, em_box[1] + 56, ex + 315, em_box[1] + 415)
        draw_rounded_rect(draw, ebox, radius=8, fill=(255, 255, 255, 255), outline=(253, 164, 175, 255), width=2)
        
        icon_fn(draw, ebox[0] + 22, ebox[1] + 28, size=11, color=(190, 18, 60))
        draw.text((ebox[0] + 40, ebox[1] + 18), etitle, fill=(190, 18, 60), font=font_body_bold)
        draw.text((ebox[0] + 15, ebox[1] + 75), edesc, fill=(71, 85, 105), font=font_body)
        if i < len(em_steps) - 1:
            draw_arrow(draw, (ebox[2], ebox[1] + 100), (ex + 342, ebox[1] + 100), color=(225, 29, 72), width=3, arrow_size=8)

    # COL 3: Right Dashboards Column (x: 2245 to 3828, y: 150 to 1660)
    dashboards = [
        ("3. ASHA WORKER DASHBOARD", (239, 246, 255, 255), (37, 99, 235, 255), (29, 78, 216), draw_icon_house, [
            "Assigned Patients", "Priority Risk List", "View Details & Risk", "Field Visit Work", "Mark Complete"
        ]),
        ("4. PHC DASHBOARD", (238, 242, 255, 255), (79, 70, 229, 255), (67, 56, 202), draw_icon_hospital, [
            "PHC Area Patients", "Access Medical History", "Follow-up Care Plan", "Coordinate Work", "Hospital Referral"
        ]),
        ("5. DISTRICT OFFICER DASHBOARD", (254, 252, 232, 255), (202, 138, 4, 255), (161, 98, 7), draw_icon_gavel, [
            "Monitor Workers", "Assigned Patients", "Visit & Task Status", "District Performance", "Take Action / Escalation"
        ]),
        ("6. FAMILY MEMBER DASHBOARD", (250, 245, 255, 255), (147, 51, 234, 255), (126, 34, 206), draw_icon_user, [
            "Linked Patient Card", "Health Status Timeline", "Reports & Findings", "Medicines & Schedule", "Receive SOS Alerts"
        ])
    ]

    for d_idx, (d_title, d_bg, d_border, d_txt_col, d_icon_fn, d_flow) in enumerate(dashboards):
        dy = 150 + d_idx * 380
        dbox = (2245, dy, width - pad, dy + 360)
        draw_shadow_box(img, dbox, radius=12, shadow_offset=(0, 3), shadow_blur=8, shadow_color=(30, 58, 138, 15))
        draw_rounded_rect(draw, dbox, radius=12, fill=d_bg, outline=d_border, width=2)
        
        draw_rounded_rect(draw, (dbox[0] + 12, dbox[1] + 8, dbox[2] - 12, dbox[1] + 44), radius=6, fill=d_border)
        d_icon_fn(draw, dbox[0] + 28, dbox[1] + 26, size=10, color=(255, 255, 255))
        draw.text((dbox[0] + 48, dbox[1] + 14), d_title, fill=(255, 255, 255), font=font_header)

        # Flow steps horizontally inside dashboard box
        for s_idx, sname in enumerate(d_flow):
            fx = dbox[0] + 12 + s_idx * 308
            fy = dbox[1] + 54
            fbox = (fx, fy, fx + 280, fy + 290)
            draw_rounded_rect(draw, fbox, radius=8, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)
            
            words = sname.split(" ")
            line1 = " ".join(words[:len(words)//2 + 1])
            line2 = " ".join(words[len(words)//2 + 1:])
            draw.text((fbox[0] + 12, fbox[1] + 50), line1, fill=(15, 23, 42), font=font_body_bold)
            if line2:
                draw.text((fbox[0] + 12, fbox[1] + 95), line2, fill=(15, 23, 42), font=font_body_bold)

            if s_idx < len(d_flow) - 1:
                draw_arrow(draw, (fbox[2], fbox[1] + 110), (fx + 308, fbox[1] + 110), color=d_txt_col, width=2, arrow_size=7)

    # -------------------------------------------------------------
    # BOTTOM ROW (DATA STORAGE, TECH STACK, KEY OUTCOMES)
    # y: 1675 to 2145 - ZERO WHITE SPACE!
    # -------------------------------------------------------------
    
    # Bottom Left: Data Storage & Flow (Backend) (x: 12 to 1515, y: 1675 to 2145)
    ds_box = (12, 1675, 1515, 2145)
    draw_shadow_box(img, ds_box, radius=12, shadow_offset=(0, 3), shadow_blur=8, shadow_color=(2, 132, 199, 20))
    draw_rounded_rect(draw, ds_box, radius=12, fill=(240, 249, 255, 255), outline=(2, 132, 199, 255), width=2)
    
    draw_rounded_rect(draw, (ds_box[0] + 12, ds_box[1] + 8, ds_box[2] - 12, ds_box[1] + 46), radius=6, fill=(2, 132, 199, 255))
    draw_icon_database(draw, ds_box[0] + 28, ds_box[1] + 27, size=10, color=(255, 255, 255))
    draw.text((ds_box[0] + 48, ds_box[1] + 14), "DATA STORAGE & FLOW (BACKEND)", fill=(255, 255, 255), font=font_header)

    ds_items = [("Patient Data", "Profile & Symptoms"), ("Medical Reports", "OCR Files & PDF"), ("AI Analysis", "Risk History Logs"), ("Alert Engine", "Family & SOS Logs"), ("ASHA Records", "Field Visit Logs"), ("Cloud DB", "Firestore / Mongo")]
    for i, (ds_t1, ds_t2) in enumerate(ds_items):
        dx = ds_box[0] + 12 + i * 248
        dy = ds_box[1] + 54
        dbox = (dx, dy, dx + 228, dy + 400)
        draw_rounded_rect(draw, dbox, radius=8, fill=(255, 255, 255, 255), outline=(186, 230, 253, 255), width=2)
        draw_icon_database(draw, dbox[0] + 20, dbox[1] + 35, size=9, color=(2, 132, 199))
        draw.text((dbox[0] + 36, dbox[1] + 25), ds_t1, fill=(15, 23, 42), font=font_body_bold)
        draw.text((dbox[0] + 12, dbox[1] + 75), ds_t2, fill=(71, 85, 105), font=font_body)
        if i < len(ds_items) - 1:
            draw_arrow(draw, (dbox[2], dbox[1] + 120), (dx + 248, dbox[1] + 120), color=(2, 132, 199), width=2, arrow_size=7)

    # Bottom Middle: Tech Stack (High Level) (x: 1530 to 2740)
    ts_box = (1530, 1675, 2740, 2145)
    draw_shadow_box(img, ts_box, radius=12, shadow_offset=(0, 3), shadow_blur=8, shadow_color=(30, 41, 59, 20))
    draw_rounded_rect(draw, ts_box, radius=12, fill=(248, 250, 252, 255), outline=(71, 85, 105, 255), width=2)
    
    draw_rounded_rect(draw, (ts_box[0] + 12, ts_box[1] + 8, ts_box[2] - 12, ts_box[1] + 46), radius=6, fill=(30, 41, 59, 255))
    draw.text((ts_box[0] + 25, ts_box[1] + 14), "TECH STACK (HIGH LEVEL)", fill=(255, 255, 255), font=font_header)

    techs = [
        ("React / Vite", "Frontend Web App", draw_icon_cloud),
        ("Node.js", "Express API Server", draw_icon_database),
        ("MongoDB/Cloud", "Firestore Database", draw_icon_database),
        ("Gemini AI", "ML Risk Engine", draw_icon_brain),
        ("Firebase Cloud", "Push Notifications", draw_icon_bell)
    ]
    for i, (tname, tdesc, icon_fn) in enumerate(techs):
        tx = ts_box[0] + 12 + i * 238
        ty = ts_box[1] + 54
        tbox = (tx, ty, tx + 222, ty + 400)
        draw_rounded_rect(draw, tbox, radius=8, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=2)
        icon_fn(draw, tbox[0] + 20, tbox[1] + 35, size=9, color=(30, 58, 138))
        draw.text((tbox[0] + 36, tbox[1] + 25), tname, fill=(30, 58, 138), font=font_body_bold)
        draw.text((tbox[0] + 12, tbox[1] + 75), tdesc, fill=(100, 116, 139), font=font_body)

    # Bottom Right: Key Outcomes (x: 2755 to 3828)
    ko_box = (2755, 1675, width - pad, 2145)
    draw_shadow_box(img, ko_box, radius=12, shadow_offset=(0, 3), shadow_blur=8, shadow_color=(5, 150, 105, 20))
    draw_rounded_rect(draw, ko_box, radius=12, fill=(236, 253, 245, 255), outline=(5, 150, 105, 255), width=2)
    
    draw_rounded_rect(draw, (ko_box[0] + 12, ko_box[1] + 8, ko_box[2] - 12, ko_box[1] + 46), radius=6, fill=(5, 150, 105, 255))
    draw_icon_check(draw, ko_box[0] + 28, ko_box[1] + 27, size=10, color=(255, 255, 255))
    draw.text((ko_box[0] + 48, ko_box[1] + 14), "KEY OUTCOMES", fill=(255, 255, 255), font=font_header)

    outcomes = [
        "✔ Early Risk Detection & AI Triaging",
        "✔ Rapid Emergency SOS Escalation",
        "✔ Automated Multi-Role Coordination",
        "✔ High-Risk Pregnancy Monitoring",
        "✔ Stronger Maternal Health Network"
    ]
    for i, oc in enumerate(outcomes):
        draw.text((ko_box[0] + 20, ko_box[1] + 70 + i * 75), oc, fill=(6, 78, 59), font=font_body_bold)

    # Save image
    final_img = Image.new("RGB", (width, height), (255, 255, 255))
    final_img.paste(img, mask=img.split()[3])
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_img.save(output_path, quality=98)
    print(f"Generated tight filled diagram at: {output_path}")

if __name__ == "__main__":
    out_img = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "maarakshak_system_workflow_diagram.png"))
    generate_tight_compact_diagram(out_img)
