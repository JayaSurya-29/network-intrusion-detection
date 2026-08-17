import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Image
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

PROJECT_ROOT = r"C:\Users\jayas\.gemini\antigravity\scratch\network-intrusion-detection"

def build_pdf(md_filepath, output_pdf):
    with open(md_filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0f172a'),
        alignment=TA_CENTER,
        spaceAfter=12
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#475569'),
        alignment=TA_CENTER,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#0284c7'),
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#1e293b'),
        alignment=TA_LEFT,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#0f172a'),
        backColor=colors.HexColor('#f1f5f9'),
        borderColor=colors.HexColor('#cbd5e1'),
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=6,
        spaceAfter=8
    )

    caption_style = ParagraphStyle(
        'ImageCaption',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#64748b'),
        alignment=TA_CENTER,
        spaceBefore=4,
        spaceAfter=12
    )

    story = []

    def clean_md(text):
        # Format bold, italic, code
        text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
        text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
        text = re.sub(r'`(.*?)`', r'<font face="Courier" color="#0284c7">\1</font>', text)
        return text

    def try_add_image(img_path, caption_text):
        """Try to embed an image into the PDF. Returns True if successful."""
        # Resolve relative paths against project root
        if not os.path.isabs(img_path):
            img_path = os.path.join(PROJECT_ROOT, img_path)
        
        if os.path.exists(img_path):
            try:
                # Calculate available width (letter width minus margins)
                available_width = letter[0] - 108  # 54pt left + 54pt right margin
                img = Image(img_path, width=available_width, height=available_width * 0.5625)
                img.hAlign = 'CENTER'
                story.append(Spacer(1, 8))
                story.append(img)
                if caption_text:
                    story.append(Paragraph(f"<i>{caption_text}</i>", caption_style))
                story.append(Spacer(1, 8))
                return True
            except Exception as e:
                print(f"Warning: Could not embed image {img_path}: {e}")
                return False
        else:
            print(f"Warning: Image not found at {img_path}")
            return False

    lines = content.split('\n')
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i].strip()

        if not line:
            i += 1
            continue

        # Image embed: ![caption](path)
        img_match = re.match(r'^!\[(.*?)\]\((.*?)\)$', line)
        if img_match:
            caption_text = img_match.group(1)
            img_path = img_match.group(2)
            try_add_image(img_path, caption_text)
            i += 1
            continue

        # Page Break marker
        if line == '---':
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceBefore=8, spaceAfter=12))
            i += 1
            continue

        # Code Block
        if line.startswith('```'):
            code_lines = []
            i += 1
            while i < n and not lines[i].strip().startswith('```'):
                code_lines.append(lines[i])
                i += 1
            i += 1
            code_text = '\n'.join(code_lines).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(code_text.replace('\n', '<br/>'), code_style))
            continue

        # Markdown Table
        if '|' in line and i + 1 < n and '|' in lines[i+1] and '---' in lines[i+1]:
            table_lines = []
            while i < n and '|' in lines[i]:
                table_lines.append(lines[i])
                i += 1
            
            # Process table lines
            table_data = []
            for t_idx, t_line in enumerate(table_lines):
                if '---' in t_line:
                    continue
                cells = [clean_md(c.strip()) for c in t_line.split('|')[1:-1]]
                if cells:
                    row_cells = [Paragraph(c, ParagraphStyle('TC', parent=body_style, fontSize=8, leading=10, fontName='Helvetica-Bold' if t_idx==0 else 'Helvetica')) for c in cells]
                    table_data.append(row_cells)
            
            if table_data:
                t = Table(table_data)
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e0f2fe')),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#0369a1')),
                    ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                    ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
                    ('TOPPADDING', (0,0), (-1,-1), 4),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ]))
                story.append(Spacer(1, 4))
                story.append(t)
                story.append(Spacer(1, 8))
            continue

        # Headings
        if line.startswith('# '):
            story.append(Paragraph(clean_md(line[2:]), title_style))
        elif line.startswith('## '):
            story.append(Paragraph(clean_md(line[3:]), h1_style))
        elif line.startswith('### '):
            story.append(Paragraph(clean_md(line[4:]), h2_style))
        elif line.startswith('#### '):
            story.append(Paragraph(clean_md(line[5:]), h3_style))
        elif line.startswith('##### '):
            story.append(Paragraph(clean_md(line[6:]), h3_style))
        elif line.startswith('- ') or line.startswith('* '):
            story.append(Paragraph(f"• {clean_md(line[2:])}", bullet_style))
        elif re.match(r'^\d+\.\s', line):
            story.append(Paragraph(clean_md(line), bullet_style))
        else:
            story.append(Paragraph(clean_md(line), body_style))

        i += 1

    doc.build(story)
    print(f"Successfully generated PDF: {output_pdf}")
    print(f"File size: {os.path.getsize(output_pdf):,} bytes")

if __name__ == '__main__':
    md_file = os.path.join(PROJECT_ROOT, "PROJECT_REPORT.md")
    pdf_file = os.path.join(PROJECT_ROOT, "PROJECT_REPORT.pdf")
    build_pdf(md_file, pdf_file)
