# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "pictures" / "academia" / "docs"
MEDIA_DIR = ROOT / "docs" / "media"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

from build_pinned_diplomas import create_supersampled_pushpin

g_p1 = Image.open(DOCS_DIR / "diploma-graduacao-p1.png").convert("RGBA")
m_p1 = Image.open(DOCS_DIR / "diploma-mestrado-p1.png").convert("RGBA")

# Resize diplomas to high-res standard size for composition (1400 x 990)
target_w = 1400
ratio_g = target_w / g_p1.width
ratio_m = target_w / m_p1.width

g_resized = g_p1.resize((target_w, int(g_p1.height * ratio_g)), Image.Resampling.LANCZOS)
m_resized = m_p1.resize((target_w, int(m_p1.height * ratio_m)), Image.Resampling.LANCZOS)

def make_paper_with_shadow(img, angle=0.0):
    w, h = img.size
    paper = Image.new("RGBA", (w + 4, h + 4), (255, 255, 255, 255))
    draw = ImageDraw.Draw(paper)
    draw.rectangle([0, 0, w + 3, h + 3], outline=(220, 220, 220, 255), width=1)
    paper.paste(img, (2, 2))
    
    pad = 120
    sw, sh = paper.size[0] + pad * 2, paper.size[1] + pad * 2
    canvas = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    
    # Ambient shadow (soft, subtle)
    ambient = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    adraw = ImageDraw.Draw(ambient)
    adraw.rectangle([pad + 4, pad + 4, pad + paper.size[0] - 4, pad + paper.size[1] - 4], fill=(0, 0, 0, 38))
    ambient = ambient.filter(ImageFilter.GaussianBlur(24))
    
    # Directional shadow (offset bottom-right)
    directional = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    ddraw = ImageDraw.Draw(directional)
    ddraw.rectangle([pad + 8, pad + 16, pad + paper.size[0] + 8, pad + paper.size[1] + 16], fill=(0, 0, 0, 60))
    directional = directional.filter(ImageFilter.GaussianBlur(16))
    
    canvas.paste(ambient, (0, 0), ambient)
    canvas.paste(directional, (0, 0), directional)
    canvas.paste(paper, (pad, pad), paper)
    
    if abs(angle) > 0.01:
        canvas = canvas.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
        
    return canvas

# Undergrad in background (tilted -4.0 deg)
g_sheet = make_paper_with_shadow(g_resized, angle=-4.0)
# Master's in foreground (tilted +2.2 deg)
m_sheet = make_paper_with_shadow(m_resized, angle=2.2)

# Canvas
canvas_w = 2300
canvas_h = 1350
comp = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))

# Place Undergrad (first diploma) on the left
g_x, g_y = 40, 60
comp.paste(g_sheet, (g_x, g_y), g_sheet)

# Place Master's (second diploma) OVER the first one, shifted right
# so "Tecnólogo em Análise e Desenvolvimento de Sistemas" remains clearly visible on the first diploma
m_x, m_y = 620, 130
comp.paste(m_sheet, (m_x, m_y), m_sheet)

# Pushpin
pin_size = 85
pin_red = create_supersampled_pushpin(size=pin_size, color=(205, 32, 38))

# Pin 1: Undergrad diploma top-center
pin1_x = int(g_x + g_sheet.width * 0.46)
pin1_y = int(g_y + 95)
comp.paste(pin_red, (pin1_x, pin1_y), pin_red)

# Pin 2: Master's diploma top-center
pin2_x = int(m_x + m_sheet.width * 0.48)
pin2_y = int(m_y + 95)
comp.paste(pin_red, (pin2_x, pin2_y), pin_red)

# Crop transparent border
bbox = comp.getbbox()
if bbox:
    comp = comp.crop((max(0, bbox[0]-15), max(0, bbox[1]-15), min(canvas_w, bbox[2]+15), min(canvas_h, bbox[3]+15)))

# Save to destination paths
mockup_dest = DOCS_DIR / "diplomas-mockup.png"
media_dest = MEDIA_DIR / "diplomas-mockup.png"
comp.save(mockup_dest)
comp.save(media_dest)

preview_dest = Path("output/subtle_mockup_preview2.png")
comp.save(preview_dest)
print(f"Generated subtle mockup: {comp.width}x{comp.height}")
