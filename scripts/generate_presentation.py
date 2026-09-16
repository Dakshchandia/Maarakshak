import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_full_bleed_presentation(output_path, diagram_img_path):
    prs = Presentation()
    # 16:9 Widescreen layout (13.333" x 7.5")
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    COLOR_BG = RGBColor(15, 23, 42)          # #0F172A (Deep Slate Navy)
    COLOR_TITLE = RGBColor(255, 255, 255)    # Pure White
    COLOR_ACCENT = RGBColor(251, 146, 60)    # Warm Orange Glow

    # Create Single Slide
    slide = prs.slides.add_slide(blank_layout)

    # Dark background fill
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = COLOR_BG

    # Top Accent Bar
    top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.1))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = COLOR_ACCENT
    top_bar.line.fill.background()

    # Header Text
    head_box = slide.shapes.add_textbox(Inches(0.2), Inches(0.12), Inches(12.933), Inches(0.55))
    tf = head_box.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0)
    tf.margin_top = Inches(0)

    p = tf.paragraphs[0]
    p.text = "MAARAKSHAK — COMPLETE SYSTEM WORKFLOW ARCHITECTURE"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_TITLE
    p.font.name = "Arial"

    p_sub = tf.add_paragraph()
    p_sub.text = "AI-POWERED MATERNAL HEALTH EARLY WARNING & CARE NETWORK  |  END-TO-END SYSTEM WORKFLOW"
    p_sub.font.size = Pt(10)
    p_sub.font.bold = True
    p_sub.font.color.rgb = COLOR_ACCENT
    p_sub.font.name = "Arial"

    # Embed High-Resolution Complete Architecture Diagram FULL BLEED (ZERO WHITE SPACE)
    if os.path.exists(diagram_img_path):
        # Left: 0.1", Top: 0.68", Width: 13.133", Height: 6.75"
        slide.shapes.add_picture(diagram_img_path, Inches(0.1), Inches(0.68), Inches(13.133), Inches(6.75))

    # Save presentation
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    prs.save(output_path)
    print(f"Full-bleed presentation generated at: {output_path}")

if __name__ == "__main__":
    ppt_out = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Maarakshak_Complete_System_Workflow.pptx"))
    img_in = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "maarakshak_system_workflow_diagram.png"))
    create_full_bleed_presentation(ppt_out, img_in)
